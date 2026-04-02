// api.ts — Authenticated fetch wrapper
// Single `api()` function that all parts of the app should use when making HTTP requests to the backend

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lawbrokr.ca/v1/legacy";

let refreshHandler: (() => Promise<string | null>) | null = null;
// AuthProvider on mount - 401 response triggers refresh attempt before giving up
export function setRefreshHandler(fn: () => Promise<string | null>) {
  refreshHandler = fn;
}

// wrapper around native fetch() API. Used for 401-retry
async function doFetch(
  path: string,
  token: string | null,
  options?: RequestInit,
): Promise<Response> {
  // Start with an Authorization header if we have a token.
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // Merge additional headers
  if (options?.headers) {
    const extra = new Headers(options.headers);
    extra.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Fire HTTP request
  return fetch(`${API_BASE}/${path}`, {
    credentials: "include",
    // e.g. method: "POST", body: JSON.stringify(...)
    ...options,
    // always use our merged headers, not options.headers
    headers,
  });
}

// api (public)
// main api function exported for use throughout the app.
//
// Generic parameter T:
//   Callers can specify the expected response shape
//   return type is properly inferred, e.g.:
//   const data = await api<AdminAccount[]>("admin/accounts", getAccessToken);
//
// Parameters:
//   path           — URL path + optional query string e.g. "admin/account?law_firm_id=9"
//   getAccessToken — A function reading latest in-memory token at call time
//   options        — Optional fetch settings

export async function api<T>(
  path: string,
  getAccessToken: () => string | null,
  options?: RequestInit,
): Promise<T> {
  let res: Response;

  // Initial request
  // Attempt fetch with current access token
  // Thrown error here means network-level failure - send user to /login
  const method = options?.method ?? "GET";
  const token = getAccessToken();
  console.log(
    `[api] ${method} /${path} → sending… (token: ${token ? "yes" : "none"})`,
  );
  try {
    res = await doFetch(path, token, options);
  } catch {
    console.log(`[api] ${method} /${path} → network error`);
    window.location.href = "/login";
    throw new Error("Network error — redirecting to login");
  }
  console.log(`[api] ${method} /${path} → ${res.status}`);

  // 401 handling
  // catch 401 and attempt silent token refresh
  // TODO: remove debug logs after verifying auth flows
  if (res.status === 401) {
    if (!refreshHandler) {
      console.log(
        `[api] ${method} /${path} → ${res.status} (no refresh handler, redirecting)`,
      );
      window.location.href = "/login";
      throw new Error("Session expired");
    }
    console.log(`[api] ${method} /${path} → ${res.status}, refreshing token…`);
    const newToken = await refreshHandler();
    if (!newToken) {
      console.log(`[api] ${method} /${path} → refresh failed, redirecting`);
      window.location.href = "/login";
      throw new Error("Session expired");
    }
    console.log(`[api] ${method} /${path} → retrying with new token…`);
    res = await doFetch(path, newToken, options);
    console.log(`[api] ${method} /${path} (retry) → ${res.status}`);
  }

  // Error handling
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.log(`[api] ${method} /${path} → ${res.status} ERROR`, body);
    throw new Error(`API error ${String(res.status)}: ${body}`);
  }
  return res.json() as Promise<T>;
}
