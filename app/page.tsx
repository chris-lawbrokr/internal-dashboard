"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useDateRange } from "@/lib/useDateRange";

import { MetricCard } from "@/app/components/MetricCard";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { ConversionRateChart } from "@/app/components/ConversionRateChart";
import { LeadsChart } from "@/app/components/LeadsChart";
import type { LeadsChartData } from "@/app/components/LeadsChart";

import { AccountsTable } from "@/app/components/AccountsTable";

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

export default function Home() {
  const { user, getAccessToken } = useAuth();
  const firstname = user?.first_name ?? "";
  const { dateQuery } = useDateRange();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<LeadsChartData | null>(null);

  useEffect(() => {
    if (!user) return;
    const qs = dateQuery ? `?${dateQuery}` : "";
    api<AnalyticsSummary>(`admin/analytics/summary${qs}`, getAccessToken)
      .then(setData)
      .catch((err: unknown) => {
        console.error("Failed to load summary:", err);
      });
    api<LeadsChartData>(`admin/analytics/chart/leads${qs}`, getAccessToken)
      .then(setChartData)
      .catch((err: unknown) => {
        console.error("Failed to load chart:", err);
      });
  }, [user, getAccessToken, dateQuery]);

  const visits = data?.summary.visits ?? 0;
  const conversions = data?.summary.conversions ?? 0;
  const conversionRate = data?.summary.conversion_rate ?? 0;
  const mom = data?.month_over_month;
  const series = data?.series;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={`Welcome back, ${firstname}`} />
      <div className="flex flex-col gap-4 @lg:flex-row">
        {/* consolidate request for all cards */}
        <div className="flex flex-col gap-4 flex-1">
          <MetricCard
            label="Total Visits"
            value={visits}
            change={mom?.visits_change}
            sparkline={series?.visits}
            className="h-full"
          />
          <MetricCard
            label="Conversions"
            value={conversions}
            change={mom?.conversions_change}
            sparkline={series?.conversions}
            className="h-full"
          />
        </div>
        <LeadsChart data={chartData} className="flex-[2]" />
        <ConversionRateChart
          value={conversionRate}
          change={mom?.conversion_rate_change}
          className="flex-1"
        />
      </div>
      <AccountsTable />
    </div>
  );
}
