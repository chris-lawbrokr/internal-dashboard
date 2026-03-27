import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken && !accessToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const backendRes = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: refreshToken ? `refresh_token=${refreshToken}` : "",
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 },
      );
    }

    const data = await backendRes.json();
    // data: { access_token, token_type }

    const response = NextResponse.json({ ok: true });

    // Update the access token
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    // Forward rotated refresh_token cookie from the backend
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
    return NextResponse.json(
      { error: "Unable to connect to the server" },
      { status: 502 },
    );
  }
}
