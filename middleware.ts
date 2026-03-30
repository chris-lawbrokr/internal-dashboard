import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth", "/_next", "/images"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;

  // No session at all — redirect to login
  if (!session) {
    return redirectToLogin(request);
  }

  // Session exists and access_token is present — proceed normally
  if (request.cookies.get("access_token")?.value) {
    return NextResponse.next();
  }

  // Session exists but access_token expired — attempt refresh
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return expireSession(request);
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const backendRes = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken}` },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      return expireSession(request);
    }

    const data = await backendRes.json();
    const response = NextResponse.next();

    // Set the refreshed access_token
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    // Forward rotated refresh_token from backend
    const setCookieHeaders = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    // Extend session marker
    response.cookies.set("session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return expireSession(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

function expireSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes get a 401 JSON response
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.json(
      { error: "Session expired" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  // Page routes redirect to login
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearAuthCookies(response);
  return response;
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("session");
  response.cookies.delete("session_user");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
