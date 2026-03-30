import { NextRequest, NextResponse } from "next/server";

/*
Auth Middleware
1. Public path (login, auth API, static assets) - allow through
2. No session cookie - redirect to /login
3. Session + valid access_token - allow through
4. Session + expired access_token + refresh_token - attempt silent refresh
  - Refresh succeeds - update cookies and allow through
  - Refresh fails - clear all auth cookies and redirect to /login
5. Session + no access_token + no refresh_token - expire session
*/

interface BackendRefreshResponse {
  access_token: string;
  token_type: string;
}

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/auth", "/_next", "/images"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public paths without auth checks
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 2. Check for the session marker cookie (7 day)
  // cookie that indicates the user has logged in at some point
  const session = request.cookies.get("session")?.value;

  if (!session) {
    return redirectToLogin(request);
  }

  // 3. Check if the access_token cookie is still present
  if (request.cookies.get("access_token")?.value) {
    return NextResponse.next();
  }

  // 4. Access token has expired — try to get a new one using the refresh token.
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    // No refresh token available — can't recover, force re-login
    return expireSession(request);
  }

  // Call the backend's refresh endpoint directly from the middleware
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  try {
    const backendRes = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken}` },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      // Backend rejected the refresh token — it's expired or revoked
      return expireSession(request);
    }

    const data = (await backendRes.json()) as BackendRefreshResponse;
    const response = NextResponse.next();

    // Set the new access_token (httpOnly, 15 min TTL)
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    // The backend may rotate the refresh token on each use.
    // Forward any Set-Cookie headers from the backend response so the
    // browser receives the new refresh_token value.
    const setCookieHeaders = backendRes.headers.getSetCookie();
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    // Extend the session marker for another 7 days
    response.cookies.set("session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    // Network error reaching the backend
    return expireSession(request);
  }
}

// Redirect the user to the login page.
function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

// End the user's session by clearing all auth cookies.
function expireSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.json(
      { error: "Session expired" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  clearAuthCookies(response);
  return response;
}

// Remove all auth-related cookies
function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("session");
  response.cookies.delete("session_user");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
