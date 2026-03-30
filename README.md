# Lawbrokr Internal Dashboard

Internal admin dashboard for managing law firm accounts, analytics, performance, and usage data.

Built with [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/                  Next.js App Router pages and API route handlers
  (dashboard)/        Dashboard layout and pages (accounts, analytics)
  api/                API route handlers (proxy to backend)
  login/              Login page
components/ui/        Shared UI components
lib/                  Utilities (auth, date helpers)
```

## API

The dashboard proxies requests to a backend API. See [API-Mock-Endpoints.md](API-Mock-Endpoints.md) for endpoint documentation.
