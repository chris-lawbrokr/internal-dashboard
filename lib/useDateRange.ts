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
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (start: Date | null, end: Date | null) => void;
  /** Formatted as YYYY-MM-DD for API calls, or null */
  startString: string | null;
  endString: string | null;
}

export function useDateRange(): DateRange {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const startDate = parseDate(searchParams.get("start"));
  const endDate = parseDate(searchParams.get("end"));

  const setDateRange = (start: Date | null, end: Date | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (start) {
      params.set("start", toDateString(start));
    } else {
      params.delete("start");
    }
    if (end) {
      params.set("end", toDateString(end));
    } else {
      params.delete("end");
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return {
    startDate,
    endDate,
    setDateRange,
    startString: startDate ? toDateString(startDate) : null,
    endString: endDate ? toDateString(endDate) : null,
  };
}
