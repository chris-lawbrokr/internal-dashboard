"use client";

/*
Auth Context & Provider
Provides authentication state and actions to the entire app via React context.
- Expose the current `user` (read from the session_user cookie on mount)
- Provide `login()` and `logout()` functions for the login page and nav
- Run a silent background refresh every 10 minutes to keep the JWT alive

Cookie layout (see middleware.ts and route handlers where these are set):
- access_token  (httpOnly) — 15 min JWT, used by API proxy routes
- refresh_token (httpOnly) — set by backend, used to obtain new access tokens
- session       (httpOnly) — 7 day marker, tells middleware user is logged in
- session_user  (readable) — JSON with { name, email } for client display
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

export interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

interface LoginApiResponse {
  user: User;
}

interface LoginApiError {
  error?: string;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => Promise.resolve({}),
  logout: () => Promise.resolve(),
});

// Hook to access auth state and actions from any component.
export function useAuth() {
  return useContext(AuthContext);
}

// Parse a cookie value by name from document.cookie.
function parseCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

// How often to proactively refresh the token (before the 15-min JWT expires)
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// On refresh failure, retry at this interval to handle temporary network drops
const RETRY_INTERVAL_MS = 10 * 1000; // 10 seconds

// Maximum consecutive retry attempts before giving up and forcing logout
const MAX_RETRIES = 3;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Track retry state across renders without causing re-renders
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // Clear all cookies on the server and redirect to /login.
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  // Silently refresh the access token in the background. (Called on 10 min interval)
  const silentRefresh = useCallback(async () => {
    // Don't try to refresh if there's no active session
    if (!parseCookie("session")) return;

    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        // Refresh succeeded
        retryCountRef.current = 0;
        clearRetryTimer();
        return;
      }
      if (res.status === 401) {
        // Backend explicitly rejected the refresh token.
        void logout();
        return;
      }
      // Any other status (500, 503) — treat as a transient server
      throw new Error("Refresh failed");
    } catch {
      retryCountRef.current += 1;
      if (retryCountRef.current <= MAX_RETRIES) {
        // Schedule another attempt in 10 seconds
        clearRetryTimer();
        retryTimerRef.current = setTimeout(() => { void silentRefresh(); }, RETRY_INTERVAL_MS);
      } else {
        // All retries exhausted — force logout
        retryCountRef.current = 0;
        void logout();
      }
    }
  }, [logout, clearRetryTimer]);

  // On mount: restore user state from the session_user cookie.
  useEffect(() => {
    const raw = parseCookie("session_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Start the background refresh interval once the user is logged in.
  useEffect(() => {
    if (!user) return; // Don't poll when logged out
    intervalRef.current = setInterval(() => { void silentRefresh(); }, REFRESH_INTERVAL_MS);
    // Cleanup on unmount or when user logs out
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearRetryTimer();
    };
  }, [user, silentRefresh, clearRetryTimer]);

  // Log in with email and password.
  // On success, the route handler sets all auth cookies and returns the user.
  const login = async (
    email: string,
    password: string,
  ): Promise<{ error?: string }> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = (await res.json()) as LoginApiError;
      return { error: data.error ?? "Login failed" };
    }

    const data = (await res.json()) as LoginApiResponse;
    setUser(data.user);
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
