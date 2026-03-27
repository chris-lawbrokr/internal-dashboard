import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const backendRes = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => null);
      return NextResponse.json(
        { error: err?.detail || "Invalid credentials" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    // data: { access_token, token_type, user: { id, email, first_name, last_name, role, ... } }

    const user = {
      name: [data.user.first_name, data.user.last_name].filter(Boolean).join(" "),
      email: data.user.email,
    };

    const response = NextResponse.json({ user });

    // Store access token in httpOnly cookie (server-side only)
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 min — will be refreshed
    });

    // Forward the refresh_token cookie from the backend
    const setCookieHeaders = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    // Session cookie for middleware auth check
    response.cookies.set("session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Readable cookie for client-side user display
    response.cookies.set("session_user", JSON.stringify(user), {
      httpOnly: false,
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
