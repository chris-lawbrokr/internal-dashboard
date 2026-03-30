import { NextRequest, NextResponse } from "next/server";

/*
POST /api/auth/login
Proxies login requests from the client to the backend API.

Flow:
1. Client sends { email, password }
2. This handler forwards them to the backend's /auth/login endpoint
3. Backend returns { access_token, token_type, user }
4. We store the access_token in an httpOnly cookie (never exposed to JS)
5. We forward any Set-Cookie headers from the backend (refresh_token)
6. We set a session marker cookie (7 days) for the middleware auth check
7. We set a readable session_user cookie so the client can display the user's name/email without needing an API call
8. We return { user } to the client so AuthProvider can update state
*/

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
    // Forward credentials to the backend
    const backendRes = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!backendRes.ok) {
      // Pass through the backend's error (e.g. "Invalid credentials")
      const err = await backendRes.json().catch(() => null);
      return NextResponse.json(
        { error: err?.detail || "Invalid credentials" },
        { status: backendRes.status },
      );
    }

    // Backend response: { access_token, token_type, user: { id, email, first_name, last_name, role, law_firm_id } }
    const data = await backendRes.json();

    // Build a simplified user object for the client
    const user = {
      name: [data.user.first_name, data.user.last_name]
        .filter(Boolean)
        .join(" "),
      email: data.user.email,
    };

    const response = NextResponse.json({ user });

    // Store the JWT access token in an httpOnly cookie.
    // 15-min maxAge matches the JWT's expiry — the browser will auto-remove
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    // The backend may set a refresh_token via its own Set-Cookie header.
    // Forward those headers directly so the browser stores the refresh token.
    const setCookieHeaders = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    // Session marker — a long-lived cookie (7 days) that tells the middleware
    response.cookies.set("session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Readable cookie for the client to display user info (name, email).
    response.cookies.set("session_user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    // fetch() itself failed — backend is unreachable
    return NextResponse.json(
      { error: "Unable to connect to the server" },
      { status: 502 },
    );
  }
}
