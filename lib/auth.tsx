"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({}),
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function parseCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = parseCookie("session_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error || "Login failed" };
    }

    const data = await res.json();
    setUser(data.user);
    return {};
  };

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  // Refresh token every 10 minutes with retry on failure
  const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
  const RETRY_DELAY = 10 * 1000; // 10 seconds
  const MAX_RETRIES = 3;
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshToken = useCallback(async () => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        if (res.ok) return; // success — done
        if (res.status === 401) {
          // session gone server-side, log out
          await logout();
          return;
        }
      } catch {
        // network error — will retry
      }

      // If we have retries left, wait 10s before next attempt
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
      }
    }

    // All retries exhausted — force logout
    await logout();
  }, [logout]);

  useEffect(() => {
    if (!user) return;

    const schedule = () => {
      refreshTimer.current = setTimeout(async () => {
        await refreshToken();
        // Schedule the next refresh (only if we didn't logout)
        schedule();
      }, REFRESH_INTERVAL);
    };

    schedule();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [user, refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
