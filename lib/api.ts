/*
Thin fetch wrapper for calling the admin API proxy.
Handles 401 redirects so individual components don't have to.

Usage:
const data = await api("accounts");
const account = await api("account?law_firm_id=9");
const usage = await api("account/usage/details?law_firm_id=9");
*/

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`/api/admin/${path}`);

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`API error ${res.status} on ${path}:`, body);
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
