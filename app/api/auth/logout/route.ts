import { NextRequest, NextResponse } from "next/server";

/*
POST /api/auth/logout

Ends the user's session by:
1. Notifying the backend to invalidate the refresh token (best-effort)
2. Clearing all auth cookies on the browser regardless of whether the backend call succeeds

The backend call is fire-and-forget because even if it fails (e.g. network
error), clearing the cookies ensures the user is logged out in the browser.
The refresh token will eventually expire on the backend side.
*/
export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Best-effort: tell the backend to revoke the refresh token
  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: refreshToken ? `refresh_token=${refreshToken}` : "",
      },
    });
  } catch {
    // Ignore errors — cookie cleanup below ensures local logout
  }

  // Clear all auth cookies by setting them to empty with maxAge 0
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", { path: "/", maxAge: 0 });
  response.cookies.set("session_user", "", { path: "/", maxAge: 0 });
  response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  return response;
}
