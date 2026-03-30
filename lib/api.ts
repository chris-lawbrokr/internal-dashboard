/*
Fetch wrapper for authenticated API calls.
Calls the backend directly with Bearer token and credentials: "include".
Redirects to /login on 401.

Usage:
  const { getAccessToken } = useAuth();
  const data = await api("admin/accounts", getAccessToken);
  const account = await api("admin/account?law_firm_id=9", getAccessToken);
*/

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lawbrokr.ca/v1/legacy";

export async function api<T>(
  path: string,
  getAccessToken: () => string | null,
  options?: RequestInit,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (options?.headers) {
    const extra = new Headers(options.headers);
    extra.forEach((value, key) => {
      headers[key] = value;
    });
  }

  const res = await fetch(`${API_BASE}/${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${String(res.status)}: ${body}`);
  }

  return res.json() as Promise<T>;
}
