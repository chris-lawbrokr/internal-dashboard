"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useDateRange } from "@/lib/useDateRange";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

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
}

function formatChange(value: number): string {
  const arrow = value >= 0 ? "↑" : "↓";
  return `${arrow} ${Math.abs(Math.round(value))}% vs last month`;
}

export default function Home() {
  const { user, getAccessToken } = useAuth();
  const firstname = user?.first_name ?? "";
  const { dateQuery } = useDateRange();
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    if (!user) return;
    const qs = dateQuery ? `?${dateQuery}` : "";
    api<AnalyticsSummary>(`admin/analytics/summary${qs}`, getAccessToken)
      .then(setData)
      .catch((err) => console.error("Failed to load summary:", err));
  }, [user, getAccessToken, dateQuery]);

  const visits = data?.summary.visits ?? 0;
  const conversions = data?.summary.conversions ?? 0;
  const conversionRate = data?.summary.conversion_rate ?? 0;
  const mom = data?.month_over_month;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={`Welcome back, ${firstname}`} />
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Visits</p>
            <p className="text-2xl font-bold">{visits.toLocaleString()}</p>
            {mom && (
              <p className="text-xs text-muted-foreground">
                {formatChange(mom.visits_change)}
              </p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Conversions</p>
            <p className="text-2xl font-bold">{conversions.toLocaleString()}</p>
            {mom && (
              <p className="text-xs text-muted-foreground">
                {formatChange(mom.conversions_change)}
              </p>
            )}
          </Card>
        </div>
        <Card className="flex-1 p-4">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
          {mom && (
            <p className="text-xs text-muted-foreground">
              {formatChange(mom.conversion_rate_change)}
            </p>
          )}
        </Card>
        <Card className="flex-1 p-4">card 1</Card>
      </div>
    </div>
  );
}
