// api.ts — Authenticated fetch wrapper
// Single `api()` function that all parts of the app should use when making HTTP requests to the backend

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lawbrokr.ca/v1/legacy";

// Thrown by api() so callers can branch on HTTP status (404, 403, 5xx, etc.).
// status === 0 means a network-level failure (offline, DNS, CORS, TLS).
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshHandler: (() => Promise<string | null>) | null = null;
let inflightRefresh: Promise<string | null> | null = null;

// AuthProvider on mount - 401 response triggers refresh attempt before giving up
export function setRefreshHandler(fn: () => Promise<string | null>) {
  refreshHandler = fn;
}

// Trigger a refresh through the shared deduplication layer.
// AuthProvider calls this on mount so api() calls can join the same promise.
export function triggerRefresh(): Promise<string | null> {
  return deduplicatedRefresh();
}

// Deduplicate concurrent refresh calls so only one hits the server at a time
function deduplicatedRefresh(): Promise<string | null> {
  if (!refreshHandler) return Promise.resolve(null);
  if (inflightRefresh) return inflightRefresh;
  inflightRefresh = refreshHandler().finally(() => {
    inflightRefresh = null;
  });
  return inflightRefresh;
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
  let token = getAccessToken();

  // If no token but a refresh is already in-flight (e.g. page reload),
  // wait for it instead of sending a request we know will 401.
  if (!token && inflightRefresh) {
    token = await inflightRefresh;
  }

  try {
    res = await doFetch(path, token, options);
  } catch {
    throw new ApiError(0, `Network error on ${method} /${path}`);
  }

  // 401 handling
  // catch 401 and attempt silent token refresh via deduplicated handler
  if (res.status === 401) {
    if (!refreshHandler) {
      throw new ApiError(401, "Session expired — no refresh handler");
    }
    const newToken = await deduplicatedRefresh();
    if (!newToken) {
      throw new ApiError(401, "Session expired — refresh failed");
    }
    res = await doFetch(path, newToken, options);
  }

  // Error handling
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, `API error ${String(res.status)}`, body);
  }
  return res.json() as Promise<T>;
}
