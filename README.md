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

## Linting & Type Checking

The project enforces strict TypeScript and ESLint rules to catch bugs early.

### TypeScript (`tsconfig.json`)

`"strict": true` is enabled along with additional flags:

| Flag                         | What it does                                             |
| ---------------------------- | -------------------------------------------------------- |
| `noUncheckedIndexedAccess`   | Array/object index access returns `T \| undefined`       |
| `noUnusedLocals`             | Errors on unused local variables                         |
| `noUnusedParameters`         | Errors on unused function parameters                     |
| `exactOptionalPropertyTypes` | Distinguishes `undefined` values from missing properties |
| `noFallthroughCasesInSwitch` | Requires `break`/`return` in every `switch` case         |

### ESLint (`eslint.config.mjs`)

Uses `typescript-eslint` strict type-checked rules on top of the Next.js defaults. Key rules include:

- **`no-floating-promises`** — unhandled async calls
- **`no-misused-promises`** — passing promises where booleans are expected
- **`no-unsafe-*`** — `any` leaking into typed code
- **`restrict-template-expressions`** — non-string types in template literals

### Scripts

| Script              | Command                  | Purpose                           |
| ------------------- | ------------------------ | --------------------------------- |
| `npm run typecheck` | `tsc --noEmit`           | Type-check without emitting files |
| `npm run lint`      | `eslint`                 | Run ESLint                        |
| `npm run check`     | `tsc --noEmit && eslint` | Run both in sequence              |

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

| File                            | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| `middleware.ts`                 | Route protection, automatic token refresh |
| `lib/auth.tsx`                  | `AuthProvider` context and `useAuth` hook |
| `app/api/auth/login/route.ts`   | Proxies login to backend, sets cookies    |
| `app/api/auth/refresh/route.ts` | Proxies token refresh to backend          |
| `app/api/auth/logout/route.ts`  | Clears cookies, notifies backend          |
| `app/login/page.tsx`            | Login form                                |

### Cookies

| Cookie          | HttpOnly | TTL            | Purpose                                |
| --------------- | -------- | -------------- | -------------------------------------- |
| `access_token`  | Yes      | 15 min         | JWT for API requests                   |
| `refresh_token` | Yes      | Set by backend | Used to obtain new access tokens       |
| `session`       | Yes      | 7 days         | Middleware auth gate                   |
| `session_user`  | No       | 7 days         | Client-side user display (name, email) |
