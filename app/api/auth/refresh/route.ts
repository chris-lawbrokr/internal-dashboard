import { NextRequest, NextResponse } from "next/server";

/*
POST /api/auth/refresh
Silently refreshes the access token using the refresh token.

Called by:
The AuthProvider's background interval (every 10 minutes)
The AuthProvider's retry logic (every 10 seconds, up to 3 attempts)

Flow:
1. Read access_token and refresh_token from httpOnly cookies
2. Send both to the backend's /auth/refresh endpoint
3. Backend validates the refresh token and returns a new access_token
4. Update the access_token cookie and forward any rotated refresh_token
5. Extend the session marker cookie
6. Return 200 on success, 401 if the session is truly expired
*/

export async function POST(request: NextRequest) {
  3;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // If we have neither token, there's nothing to refresh
  if (!refreshToken && !accessToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Send both tokens to the backend — the access token via Authorization header
    const backendRes = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: refreshToken ? `refresh_token=${refreshToken}` : "",
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      // Backend rejected the refresh — token is expired or revoked
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Backend returns { access_token, token_type }
    const data = await backendRes.json();

    const response = NextResponse.json({ ok: true });

    // Update the access_token cookie with the new JWT (15 min TTL)
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    // Forward any Set-Cookie headers so the browser stores the new value.
    const setCookieHeaders = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    // Extend the session marker for another 7 days since the user is
    response.cookies.set("session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to the server" },
      { status: 502 },
    );
  }
}
