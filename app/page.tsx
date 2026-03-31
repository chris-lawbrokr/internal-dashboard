"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useDateRange } from "@/lib/useDateRange";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/app/components/StatCard";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { PieChart } from "@/app/components/PieChart";
import { LineChart } from "@/app/components/LineChart";
import type { LineChartData } from "@/app/components/LineChart";
import { CardContent } from "@/components/ui/card";
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
  const [chartData, setChartData] = useState<LineChartData | null>(null);

  useEffect(() => {
    if (!user) return;
    const qs = dateQuery ? `?${dateQuery}` : "";
    api<AnalyticsSummary>(`admin/analytics/summary${qs}`, getAccessToken)
      .then(setData)
      .catch((err) => console.error("Failed to load summary:", err));
    api<LineChartData>(`admin/analytics/chart/leads${qs}`, getAccessToken)
      .then(setChartData)
      .catch((err) => console.error("Failed to load chart:", err));
  }, [user, getAccessToken, dateQuery]);

  const visits = data?.summary.visits ?? 0;
  const conversions = data?.summary.conversions ?? 0;
  const conversionRate = data?.summary.conversion_rate ?? 0;
  const mom = data?.month_over_month;
  const series = data?.series;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={`Welcome back, ${firstname}`} />
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <StatCard
            label="Total Visits"
            value={visits}
            change={mom?.visits_change}
            sparkline={series?.visits}
            className="h-full"
          />
          <StatCard
            label="Conversions"
            value={conversions}
            change={mom?.conversions_change}
            sparkline={series?.conversions}
            className="h-full"
          />
        </div>
        <Card className="flex-[2] min-w-0 p-4 flex">
          <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
            <LineChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="flex-1 p-4 flex items-center justify-center">
          <div className="h-full">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
          </div>
          <PieChart value={conversionRate} label="Conversion" />
        </Card>
      </div>
      <AccountsTable />
    </div>
  );
}
