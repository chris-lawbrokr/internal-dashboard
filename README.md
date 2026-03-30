# Lawbrokr Internal Dashboard

## Getting Started

```bash
npm install
```

```bash
npm run dev
```

```bash
http://localhost:3000
```

---

## Environment

Copy `.env.example` to `.env.local` and set the API base URL:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8000`) |

---

## Auth

Authentication uses JWT tokens stored in HTTP-only cookies, with Next.js middleware protecting all routes.

### Flow

1. User submits email/password on `/login`
2. Next.js route handler (`/api/auth/login`) proxies the request to the backend (`{API_BASE_URL}/auth/login`)
3. Backend returns a JWT access token (15 min) and user info
4. Route handler sets HTTP-only cookies: `access_token`, `refresh_token` (forwarded from backend), `session` (7-day marker), and `session_user` (readable by client for display)
5. Middleware checks `session` + `access_token` on every request — if the access token is expired, it attempts a refresh via the backend's `/auth/refresh` endpoint
6. If refresh fails, all cookies are cleared and the user is redirected to `/login`

### Files

| File | Purpose |
|---|---|
| `middleware.ts` | Route protection, automatic token refresh |
| `lib/auth.tsx` | `AuthProvider` context and `useAuth` hook |
| `app/api/auth/login/route.ts` | Proxies login to backend, sets cookies |
| `app/api/auth/refresh/route.ts` | Proxies token refresh to backend |
| `app/api/auth/logout/route.ts` | Clears cookies, notifies backend |
| `app/login/page.tsx` | Login form |

### Cookies

| Cookie | HttpOnly | TTL | Purpose |
|---|---|---|---|
| `access_token` | Yes | 15 min | JWT for API requests |
| `refresh_token` | Yes | Set by backend | Used to obtain new access tokens |
| `session` | Yes | 7 days | Middleware auth gate |
| `session_user` | No | 7 days | Client-side user display (name, email) |
