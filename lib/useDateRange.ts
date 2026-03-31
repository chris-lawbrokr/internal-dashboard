"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  setDateRange: (start: Date | null, end: Date | null) => void;
  /** Formatted as YYYY-MM-DD for API calls */
  startString: string;
  endString: string;
  /** Ready-to-append query string, e.g. "start_date=2026-01-01&end_date=2026-03-31" */
  dateQuery: string;
}

export function useDateRange(): DateRange {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const now = new Date();
  const defaultEnd = now;
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);

  const startDate = parseDate(searchParams.get("start")) ?? defaultStart;
  const endDate = parseDate(searchParams.get("end")) ?? defaultEnd;

  const setDateRange = (start: Date | null, end: Date | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const resolvedStart = start ?? defaultStart;
    const resolvedEnd = end ?? defaultEnd;
    params.set("start", toDateString(resolvedStart));
    params.set("end", toDateString(resolvedEnd));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const startStr = toDateString(startDate);
  const endStr = toDateString(endDate);

  return {
    startDate,
    endDate,
    setDateRange,
    startString: startStr,
    endString: endStr,
    dateQuery: `start_date=${startStr}&end_date=${endStr}`,
  };
}
