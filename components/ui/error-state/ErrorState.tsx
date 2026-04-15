"use client";

import Image from "next/image";

interface ErrorCopy {
  title: string;
  subtitle: string;
}

// Friendly copy for every status code the dashboard can encounter.
// `0` represents a network-level failure (offline, DNS, CORS, TLS).
const ERROR_COPY: Record<number, ErrorCopy> = {
  0: { title: "Connection Error", subtitle: "Unable to reach the server. Check your connection and try again." },
  400: { title: "400 Bad Request", subtitle: "The request couldn't be processed." },
  401: { title: "401 Unauthorized", subtitle: "Your session has expired. Please log in again." },
  403: { title: "403 Forbidden", subtitle: "You don't have permission to view this." },
  404: { title: "404 Not Found", subtitle: "Whoops! That page doesn't exist." },
  408: { title: "408 Request Timeout", subtitle: "The server took too long to respond. Please try again." },
  409: { title: "409 Conflict", subtitle: "This request conflicts with the current state. Please refresh and retry." },
  422: { title: "422 Unprocessable", subtitle: "The submitted data was invalid." },
  429: { title: "429 Too Many Requests", subtitle: "You're going a little fast. Please try again in a moment." },
  500: { title: "500 Server Error", subtitle: "Something went wrong on our end. Please try again." },
  502: { title: "502 Bad Gateway", subtitle: "The server is having trouble. Please try again shortly." },
  503: { title: "503 Service Unavailable", subtitle: "The service is temporarily unavailable. Please try again shortly." },
  504: { title: "504 Gateway Timeout", subtitle: "The server took too long to respond. Please try again." },
};

const FALLBACK: ErrorCopy = {
  title: "Something went wrong",
  subtitle: "An unexpected error occurred. Please try again.",
};

interface ErrorStateProps {
  status?: number;
  title?: string;
  subtitle?: string;
}

export function ErrorState({ status, title, subtitle }: ErrorStateProps) {
  const copy = (status != null && ERROR_COPY[status]) || FALLBACK;
  return (
    <div className="error-state-fade-in w-full h-full min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/images/Logo.svg"
        alt="lawbrokr"
        priority
        height={30}
        width={117}
        style={{ height: "auto" }}
      />
      <h1 className="mt-8 text-4xl sm:text-5xl font-bold text-brand-dark">
        {title ?? copy.title}
      </h1>
      <p className="mt-4 text-base text-muted-foreground max-w-md">
        {subtitle ?? copy.subtitle}
      </p>
    </div>
  );
}
