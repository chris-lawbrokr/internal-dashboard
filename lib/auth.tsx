"use client";

/*
Auth Context & Provider
- Direct backend calls with credentials: "include" (CORS-friendly)
- Access token stored in-memory (useRef) — never in cookies/localStorage
- JWT-exp-based refresh scheduling (precise, not a fixed interval)
- httpOnly refresh_token cookie managed by the backend
- Session cookies (set client-side) for middleware route protection
- Retry logic on refresh failure

Cookie layout:
- refresh_token (httpOnly) — set by backend, used to obtain new access tokens
- session       (readable) — 7 day marker, tells middleware user is logged in
- session_user  (readable) — JSON with user info for client display on reload
*/

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

// ── Configuration ──────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lawbrokr.ca/v1/legacy";

const REFRESH_BUFFER_MS =
  Number(process.env.NEXT_PUBLIC_REFRESH_BUFFER_SECONDS ?? "60") * 1000;

const MAX_RETRIES = 3;
const RETRY_INTERVAL_MS = 10 * 1000;

// ── JWT helpers ────────────────────────────────────────────────

interface JwtPayload {
  sub: string;
  exp: number;
}

function decodeJwtPayload(token: string): JwtPayload {
  const base64Url = token.split(".")[1];
  if (!base64Url) throw new Error("Invalid JWT");
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
  return JSON.parse(json) as JwtPayload;
}

// ── Cookie helpers ─────────────────────────────────────────────

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// ── Types ──────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: number | null;
  law_firm_id: number | null;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface RefreshResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  /** Get the current in-memory access token for API calls */
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => Promise.resolve({}),
  logout: () => Promise.resolve(),
  getAccessToken: () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ── Provider ───────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const accessTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doRefreshRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  // ── Timer cleanup ──────────────────────────────────────────

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current !== null) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // ── Session cookies ────────────────────────────────────────

  const persistSession = useCallback((userData: User) => {
    setCookie("session", "1", 7);
    setCookie("session_user", JSON.stringify(userData), 7);
  }, []);

  const clearSessionCookies = useCallback(() => {
    deleteCookie("session");
    deleteCookie("session_user");
  }, []);

  // ── Refresh scheduling (JWT-exp based) ─────────────────────

  const scheduleRefresh = useCallback(
    (token: string) => {
      clearRefreshTimer();
      try {
        const { exp } = decodeJwtPayload(token);
        const expiresAt = exp * 1000;
        const refreshAt = expiresAt - REFRESH_BUFFER_MS;
        const delay = refreshAt - Date.now();

        if (delay > 0) {
          refreshTimerRef.current = setTimeout(() => {
            void doRefreshRef.current?.();
          }, delay);
        } else {
          void doRefreshRef.current?.();
        }
      } catch {
        void doRefreshRef.current?.();
      }
    },
    [clearRefreshTimer],
  );

  // ── Logout ─────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Best-effort — clear local state regardless
    }
    accessTokenRef.current = null;
    clearRefreshTimer();
    clearRetryTimer();
    retryCountRef.current = 0;
    setUser(null);
    clearSessionCookies();
    router.push("/login");
  }, [router, clearRefreshTimer, clearRetryTimer, clearSessionCookies]);

  // ── Token refresh with retry logic ─────────────────────────

  const doRefresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          void logout();
          return;
        }
        throw new Error(`HTTP ${String(res.status)}`);
      }

      const data = (await res.json()) as RefreshResponse;
      accessTokenRef.current = data.access_token;
      retryCountRef.current = 0;
      clearRetryTimer();
      scheduleRefresh(data.access_token);
    } catch {
      retryCountRef.current += 1;
      if (retryCountRef.current <= MAX_RETRIES) {
        clearRetryTimer();
        retryTimerRef.current = setTimeout(() => {
          void doRefreshRef.current?.();
        }, RETRY_INTERVAL_MS);
      } else {
        retryCountRef.current = 0;
        void logout();
      }
    }
  }, [scheduleRefresh, clearRetryTimer, logout]);

  // Wire up the ref so scheduled timers call the latest doRefresh
  useEffect(() => {
    doRefreshRef.current = doRefresh;
  }, [doRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRefreshTimer();
      clearRetryTimer();
    };
  }, [clearRefreshTimer, clearRetryTimer]);

  // ── Hydrate session from cookie on mount ───────────────────

  useEffect(() => {
    const raw = getCookie("session_user");
    if (raw) {
      try {
        const restored = JSON.parse(raw) as User;
        setUser(restored);
        void doRefresh();
      } catch {
        clearSessionCookies();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // ── Login ──────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const err = (await res.json().catch(() => null)) as {
            message?: string;
          } | null;
          return { error: err?.message ?? "Login failed" };
        }

        const data = (await res.json()) as LoginResponse;
        accessTokenRef.current = data.access_token;
        setUser(data.user);
        persistSession(data.user);
        scheduleRefresh(data.access_token);
        return {};
      } catch {
        return { error: "Unable to connect to the server" };
      }
    },
    [persistSession, scheduleRefresh],
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
