import { NextRequest, NextResponse } from "next/server";

/*
Catch-all API proxy for /api/admin/*
Forwards all requests to the backend API with the access token attached.
e.g. /api/admin/accounts - {API_BASE_URL}/admin/accounts
e.g. /api/admin/account/usage/details?law_firm_id=9 - {API_BASE_URL}/admin/account/usage/details?law_firm_id=9
Auth routes (login, refresh, logout) are handled separately because
they need to set/clear cookies. These admin routes just pass data through.
*/

async function proxyRequest(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  // Build the backend URL from the incoming path and query string
  const url = new URL(request.url);
  const backendPath = url.pathname.replace(/^\/api/, "");
  const backendUrl = `${apiBase}${backendPath}${url.search}`;

  // Only include Content-Type and body for requests that have a body
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const backendRes = await fetch(backendUrl, {
      method: request.method,
      headers,
      ...(hasBody ? { body: await request.text() } : {}),
      cache: "no-store",
    });

    // Pass through the backend response as-is
    const data = await backendRes.text();
    return new NextResponse(data, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to the server" },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
