"use client";

// ============================================================
// AuthProvider.tsx — Authentication context & session manager
// ============================================================
// PURPOSE:
//   This file owns everything related to the user's auth session:
//     - Logging in and out
//     - Storing the short-lived access token in memory (never in a cookie)
//     - Proactively refreshing the access token before it expires
//     - Retrying failed refreshes up to MAX_REFRESH_RETRIES times
//     - Persisting a lightweight session cookie so the user
//       survives a page reload without having to log in again
//     - Exposing a `useAuth()` hook for any component that needs
//       the current user, login/logout actions, or the token getter
//
// TOKEN STRATEGY (two-token pattern):
//   Access token  — short-lived JWT, kept only in memory (accessTokenRef).
//                   Never written to a cookie or localStorage to reduce XSS risk.
//   Refresh token — longer-lived, stored in an httpOnly cookie by the server.
//                   The browser sends it automatically; JS cannot read it.
//   Session cookie — a simple "session=1" cookie written by this client code
//                    so we know on page reload whether to attempt a refresh.
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { setRefreshHandler, triggerRefresh } from "@/lib/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lawbrokr.ca/v1/legacy";

const MAX_REFRESH_RETRIES = 3;
const RETRY_INTERVAL_MS = 10_000;

const REFRESH_BUFFER_SECONDS = Number(
  process.env.NEXT_PUBLIC_REFRESH_BUFFER_SECONDS ?? "30",
);
const REFRESH_BUFFER_MS = REFRESH_BUFFER_SECONDS * 1000;

const SESSION_EXPIRY_DAYS = Number(
  process.env.NEXT_PUBLIC_SESSION_EXPIRY_DAYS ?? "1",
);

// Context
export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: number | null;
  law_firm_id: number | null;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

// Context
const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({}),
  logout: async () => {},
  getAccessToken: () => null,
});

// Convenience hook
export function useAuth() {
  return useContext(AuthContext);
}

// Helpers
// Decode the JWT payload. Returns null if the token is malformed so callers
// can treat it as "expired" and trigger an immediate refresh.
function getJwtExpiry(token: string): number | null {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return null;
    const exp = JSON.parse(atob(base64))?.exp;
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

// Write a cookie visible to all paths. Adds Secure on HTTPS so the cookie
// isn't sent over plaintext; omitted on http://localhost so dev still works.
function setCookie(name: string, value: string, days: number) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${new Date(
    Date.now() + days * 864e5,
  ).toUTCString()}; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// Cancel a pending setTimeout
function clearTimer(
  ref: React.RefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

// Provider
// Wrap app with <AuthProvider> - All child components the use useAuth()
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  // Refs (not state)
  // access token as ref (not state, not a cookie)
  // so it's only accessible within this JS context — invisible to
  // other tabs and inaccessible to XSS scripts that can only read
  // cookies/localStorage.
  const accessTokenRef = useRef<string | null>(null);

  // Timer ID for the next scheduled proactive refresh.
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer ID for the next retry after a failed refresh.
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // How many consecutive refresh failures have occurred.
  const retryCountRef = useRef(0);

  // Stable function reference passed down via context.
  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  // Session cookie triggers a doRefresh() on mount if there was an existing session
  const session = {
    save(user: User) {
      setCookie("session", "1", SESSION_EXPIRY_DAYS);
      // Store the user object to restore on reload without completing refresh.
      setCookie("session_user", JSON.stringify(user), SESSION_EXPIRY_DAYS);
    },
    clear() {
      deleteCookie("session");
      deleteCookie("session_user");
    },
  };

  // Logout
  // Cleans up all auth state — both client-side and server-side.
  const logout = useCallback(async () => {
    // server invalidates refresh-token cookie
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include", // sends the httpOnly refresh-token cookie
      });
    } catch {
      // network error on logout is non-critical
    }

    // Wipe in-memory token so in-flight api() calls get null
    accessTokenRef.current = null;

    // Cancel any pending refresh timers after logout
    clearTimer(refreshTimerRef);
    clearTimer(retryTimerRef);
    retryCountRef.current = 0;

    // Remove the user from React state and delete the session cookies.
    setUser(null);
    session.clear();

    router.push("/login");
  }, [router]);

  // Refresh logic
  // calls doRefresh() in REFRESH_BUFFER_MS before current token expire
  // Called after successful login or refresh so the timer to reflect latest expiry
  // Use a ref so scheduleRefresh always calls the latest doRefresh
  const doRefreshRef = useRef<() => Promise<string | null>>(async () => null);

  const scheduleRefresh = useCallback((token: string) => {
    clearTimer(refreshTimerRef); // cancel any previously scheduled refresh

    const exp = getJwtExpiry(token);
    // If the token can't be decoded, refresh immediately (delay = 0).
    const delay = exp ? exp * 1000 - REFRESH_BUFFER_MS - Date.now() : 0;

    if (delay <= 0) {
      // Token expired refresh immediately
      return void doRefreshRef.current();
    }

    refreshTimerRef.current = setTimeout(() => doRefreshRef.current(), delay);
  }, []);

  // /auth/refresh endpoint exchanges httpOnly refresh-token cookie for a new access token.
  // Also registered with api.ts via setRefreshHandler() so api() trigger on 401
  const doRefresh = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401) {
        // refresh token expired or revoked
        logout();
        return null;
      }

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(body);
      }

      const { access_token } = await res.json();

      // Store new token and reset failure counter
      accessTokenRef.current = access_token;
      retryCountRef.current = 0;

      clearTimer(retryTimerRef);
      scheduleRefresh(access_token);
      return access_token;
    } catch {
      // Network error or non-401
      // retry up to MAX_REFRESH_RETRIES times
      retryCountRef.current++;

      if (retryCountRef.current <= MAX_REFRESH_RETRIES) {
        clearTimer(retryTimerRef);
        retryTimerRef.current = setTimeout(doRefresh, RETRY_INTERVAL_MS);
      } else {
        // Exhausted retries. Log out cleanly
        retryCountRef.current = 0;
        logout();
      }

      return null;
    }
  }, [logout, scheduleRefresh]);

  // Keep the ref in sync so scheduled timers always call the latest doRefresh
  doRefreshRef.current = doRefresh;

  // Lifecycle effects
  // Register with api.ts when doRefresh changes, cleans timers when AuthProvider unmounts
  useEffect(() => {
    setRefreshHandler(doRefresh);
    return () => {
      clearTimer(refreshTimerRef);
      clearTimer(retryTimerRef);
    };
  }, [doRefresh]);

  // On first mount, check for existing session cookie.
  // If found, restore the user into React state immediately
  // kick off a token refresh in background for fresh access token
  useEffect(() => {
    const raw = getCookie("session_user");
    if (!raw) return;

    try {
      setUser(JSON.parse(raw));
      triggerRefresh();
    } catch {
      session.clear();
    }
  }, []);

  // When the tab regains visibility, check if the token has expired
  // while the tab was hidden (browsers throttle timers in background tabs)
  // and trigger a refresh if needed.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && getCookie("session")) {
        const token = accessTokenRef.current;
        if (!token) {
          doRefreshRef.current();
          return;
        }
        const exp = getJwtExpiry(token);
        if (!exp || exp * 1000 - Date.now() < REFRESH_BUFFER_MS) {
          doRefreshRef.current();
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Login
  // Sends credentials to the server.
  // On success server sets httpOnly refresh-token cookie
  // returns the first access token + user object
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          return { error: err?.message ?? "Login failed" };
        }

        const data = await res.json();

        // Store the access token in memory
        accessTokenRef.current = data.access_token;
        setUser(data.user);

        // Persist a session cookie
        session.save(data.user);

        // Start the proactive refresh
        scheduleRefresh(data.access_token);

        return {};
      } catch {
        return { error: "Unable to connect to the server" };
      }
    },
    [scheduleRefresh],
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
