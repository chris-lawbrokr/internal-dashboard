"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

// ── Config ───────────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lawbrokr.ca/v1/legacy";

const MAX_REFRESH_RETRIES = 3;
const RETRY_INTERVAL_MS = 10_000;

const COOKIE_REFRESH_SECONDS = Number(
  process.env.NEXT_PUBLIC_REFRESH_BUFFER_SECONDS ?? "30",
);
const COOKIE_REFRESH_MS = COOKIE_REFRESH_SECONDS * 1000;

const HARD_LOGOUT_MINUTES = 2;
const HARD_LOGOUT_DAYS = HARD_LOGOUT_MINUTES / (60 * 24);

// ── Types ───────────────────────────────────────────────────

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

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({}),
  logout: async () => {},
  getAccessToken: () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ── Helpers ─────────────────────────────────────────────────

function getJwtExpiry(token: string): number {
  const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
  if (!base64) throw new Error("Invalid JWT");
  return JSON.parse(atob(base64)).exp;
}

function setCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; expires=${new Date(
    Date.now() + days * 864e5,
  ).toUTCString()}; SameSite=Lax`;
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

function clearTimer(
  ref: React.RefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

// ── Provider ────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const accessTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  // ── Session helpers ──

  const session = {
    save(user: User) {
      setCookie("session", "1", HARD_LOGOUT_DAYS);
      setCookie("session_user", JSON.stringify(user), HARD_LOGOUT_DAYS);
    },
    clear() {
      deleteCookie("session");
      deleteCookie("session_user");
    },
  };

  // ── Logout ──

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }

    accessTokenRef.current = null;
    clearTimer(refreshTimerRef);
    clearTimer(retryTimerRef);
    retryCountRef.current = 0;

    setUser(null);
    session.clear();

    router.push("/login");
  }, [router]);

  // ── Refresh logic ──

  const scheduleRefresh = useCallback(
    (token: string) => {
      clearTimer(refreshTimerRef);

      let delay = 0;
      try {
        delay = getJwtExpiry(token) * 1000 - COOKIE_REFRESH_MS - Date.now();
      } catch {}

      if (delay <= 0) return void doRefresh();

      refreshTimerRef.current = setTimeout(doRefresh, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const doRefresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401) {
        const body = await res.json().catch(() => null);
        if (body?.code === "authentication_error") {
          return logout();
        }
      }

      if (!res.ok) throw new Error();

      const { access_token } = await res.json();

      accessTokenRef.current = access_token;
      retryCountRef.current = 0;

      clearTimer(retryTimerRef);
      scheduleRefresh(access_token);
    } catch {
      retryCountRef.current++;

      if (retryCountRef.current <= MAX_REFRESH_RETRIES) {
        clearTimer(retryTimerRef);
        retryTimerRef.current = setTimeout(doRefresh, RETRY_INTERVAL_MS);
      } else {
        retryCountRef.current = 0;
        logout();
      }
    }
  }, [logout, scheduleRefresh]);

  // ── Lifecycle ──

  useEffect(() => {
    return () => {
      clearTimer(refreshTimerRef);
      clearTimer(retryTimerRef);
    };
  }, []);

  useEffect(() => {
    const raw = getCookie("session_user");
    if (!raw) return;

    try {
      setUser(JSON.parse(raw));
      doRefresh();
    } catch {
      session.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──

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

        accessTokenRef.current = data.access_token;
        setUser(data.user);

        session.save(data.user);
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
