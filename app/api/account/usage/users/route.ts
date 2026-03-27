import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();
  for (const key of ["law_firm_id"]) {
    const val = searchParams.get(key);
    if (val) params.set(key, val);
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const qs = params.toString();
  const url = `${apiBase}/admin/account/usage/users${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch usage users" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch usage users" }, { status: 502 });
  }
}
