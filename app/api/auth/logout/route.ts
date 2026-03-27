import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Best-effort call to backend to clear refresh token
  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: refreshToken ? `refresh_token=${refreshToken}` : "",
      },
    });
  } catch {
    // Ignore — we clear local cookies regardless
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", { path: "/", maxAge: 0 });
  response.cookies.set("session_user", "", { path: "/", maxAge: 0 });
  response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  return response;
}
