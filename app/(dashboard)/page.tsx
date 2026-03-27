"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { AccountsTable } from "@/app/(dashboard)/ui/AccountsTable";
import { PieChart } from "@/app/(dashboard)/ui/charts/PieChart";
import { LineChart } from "@/app/(dashboard)/ui/charts/LineChart";
import type { LineChartData } from "@/app/(dashboard)/ui/charts/LineChart";
import { SparklineChart } from "@/app/(dashboard)/ui/charts/SparklineChart";
import { DateRangePickerWithPresets } from "@/components/ui/datepicker";
import { DATE_RANGE_MIN, dateRangeMax } from "@/lib/dates";
import { useAuth } from "@/lib/auth";

interface AnalyticsSummary {
  summary: {
    visits: number;
    conversions: number;
    conversion_rate: number;
  };
  month_over_month: {
    visits_change: number;
    conversions_change: number;
    conversion_rate_change: number;
  };
  series: {
    visits: number[];
    conversions: number[];
  };
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function ChangeIndicator({ change, label }: { change: number; label: string }) {
  const isPositive = change >= 0;
  const arrow = isPositive ? "\u2191" : "\u2193";
  const colorClass = isPositive
    ? "text-status-success-border"
    : "text-status-error-border";

  return (
    <p className="text-xs text-muted-foreground">
      <span className={colorClass}>
        {arrow} {Math.round(Math.abs(change))}%
      </span>{" "}
      {label}
    </p>
  );
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`API error: ${url} → ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`API fetch failed: ${url}`, err);
    return null;
  }
}

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<LineChartData | null>(null);

  // Date range state — drives all API fetches
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 90);

  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);

  // Fetch whenever the date range changes
  useEffect(() => {
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const qs = `start_date=${fmt(startDate)}&end_date=${fmt(endDate)}`;

    setAnalytics(null);
    setChartData(null);
    fetchJson<AnalyticsSummary>(`/api/analytics/summary?${qs}`).then(setAnalytics);
    fetchJson<LineChartData>(`/api/analytics/chart/leads?${qs}`).then(setChartData);
  }, [startDate, endDate]);

  const visits = analytics?.summary.visits ?? 0;
  const conversions = analytics?.summary.conversions ?? 0;
  const conversionRate = analytics?.summary.conversion_rate ?? 0;
  const mom = analytics?.month_over_month;
  const series = analytics?.series;

  return (
    <div className="flex flex-col h-full">
      {/* Welcome + Date Filter */}
      <div className="flex flex-col @xl:flex-row @xl:items-center justify-between gap-4 pb-4">
        <h1 className="text-2xl font-bold">
          {t("welcome", { name: firstName })}
        </h1>
        <div className="w-full @xl:w-auto [&>div]:w-full @xl:[&>div]:w-auto [&>div>button:first-child]:w-full @xl:[&>div>button:first-child]:w-auto">
          <DateRangePickerWithPresets
            defaultPreset="90d"
            minDate={DATE_RANGE_MIN}
            maxDate={dateRangeMax()}
            onChange={(start, end) => {
              if (start && end) {
                setStartDate(start);
                setEndDate(end);
              }
            }}
          />
        </div>
      </div>

      <div className="overflow-y-auto min-h-0 flex-1 flex flex-col gap-4 pb-2">
        {/* Stats Row */}
        <div className="flex flex-col gap-4 @xl:flex-row">
            {/* Left: Stacked stat cards */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <Card className="flex-1 p-4 @container/stat">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {t("totalVisits")}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(visits)}
                    </p>
                    <ChangeIndicator
                      change={mom?.visits_change ?? 0}
                      label={t("vsLastMonth")}
                    />
                  </div>
                  <div className="hidden @[200px]/stat:block">
                    <SparklineChart
                      data={series?.visits ?? []}
                      color="#bcbc95"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 p-4 @container/stat2">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {t("totalResponses")}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(conversions)}
                    </p>
                    <ChangeIndicator
                      change={mom?.conversions_change ?? 0}
                      label={t("vsLastMonth")}
                    />
                  </div>
                  <div className="hidden @[200px]/stat2:block">
                    <SparklineChart
                      data={series?.conversions ?? []}
                      color="#bcbc95"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle: Area chart */}
            <Card className="flex-[2] min-w-0 p-4 flex">
              <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
                <LineChart data={chartData} />
              </CardContent>
            </Card>

            {/* Right: Conversion rate + donut */}
            <Card className="flex-1 min-w-0 p-4 @container/conv">
              <CardContent className="flex flex-col @[200px]/conv:flex-row @[200px]/conv:items-center @[200px]/conv:justify-between h-full gap-2">
                <div className="flex flex-col gap-1 items-start h-full">
                  <p className="text-sm text-muted-foreground">
                    {t("conversionRate")}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(conversionRate)}%
                  </p>
                  <ChangeIndicator
                    change={mom?.conversion_rate_change ?? 0}
                    label={t("vsLastMonth")}
                  />
                </div>
                <div className="shrink-0 self-center">
                  <PieChart value={Math.round(conversionRate)} />
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Accounts Table */}
        <AccountsTable startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
}
