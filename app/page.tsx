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
import type { Account, AccountsResponse } from "@/app/components/AccountsTable";
import {
  SkeletonMetricCard,
  SkeletonChart,
  SkeletonRadialChart,
  SkeletonTable,
} from "@/components/ui/Skeleton";
import { useSkeletonTransition } from "@/components/ui/SkeletonTransition";

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
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  useEffect(() => {
    setData(null);
    setChartData(null);
    setAccounts(null);
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
    api<AccountsResponse>(`admin/accounts?${dateQuery}`, getAccessToken)
      .then((res) => setAccounts(res.data))
      .catch((err: unknown) => {
        console.error("Failed to load accounts:", err);
      });
  }, [user, getAccessToken, dateQuery]);

  const loading = !data || !accounts;
  const { showSkeleton, fading } = useSkeletonTransition(loading);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface">
        <PageHeader title={`Welcome back, ${firstname}`} />
      </div>
      <div className="m-4 mt-0 overflow-y-scroll">
        <div>
          {showSkeleton || !data || !accounts ? (
            <div
              className={`overflow-clip flex-1 flex flex-col gap-4${fading ? " skeleton-fade-out" : ""}`}
            >
              <div className="flex flex-col gap-4 @lg:flex-row">
                <div className="flex flex-col gap-4 flex-1">
                  <SkeletonMetricCard className="h-full" />
                  <SkeletonMetricCard className="h-full" />
                </div>
                <SkeletonChart className="flex-[2]" />
                <SkeletonRadialChart className="flex-1" />
              </div>
              <SkeletonTable rows={10} />
            </div>
          ) : (
            <div className="overflow-clip flex-1 flex flex-col gap-4 skeleton-stagger">
              <div className="flex flex-col gap-4 @lg:flex-row skeleton-stagger">
                <div className="flex flex-col gap-4 flex-1">
                  <MetricCard
                    label="Total Visits"
                    value={data.summary.visits}
                    change={data.month_over_month.visits_change}
                    sparkline={data.series.visits}
                    className="h-full"
                  />
                  <MetricCard
                    label="Responses"
                    value={data.summary.conversions}
                    change={data.month_over_month.conversions_change}
                    sparkline={data.series.conversions}
                    className="h-full"
                  />
                </div>
                <LeadsChart data={chartData} className="flex-[2]" />
                <ConversionRateChart
                  value={data.summary.conversion_rate}
                  change={data.month_over_month.conversion_rate_change}
                  className="flex-1"
                />
              </div>
              <AccountsTable accounts={accounts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
