"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useDateRange } from "@/lib/useDateRange";
import { SkeletonMetricCard, SkeletonChart, SkeletonRadialChart, SkeletonTable } from "@/components/ui/Skeleton";
import { useSkeletonTransition } from "@/components/ui/SkeletonTransition";
import { MetricCard } from "@/app/components/MetricCard";
import { LeadsChart } from "@/app/components/LeadsChart";
import type { LeadsChartData } from "@/app/components/LeadsChart";
import { ConversionRateChart } from "@/app/components/ConversionRateChart";
import { ConversionComparisonChart } from "./ConversionComparisonChart";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import { ChevronRight } from "lucide-react";

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

interface ComparisonChart {
  series: {
    current: number[];
    previous: number[];
  };
  labels: string[];
}

interface Funnel {
  name: string;
  visits: number;
  conversions: number;
  conversion_rate: number;
}

interface FunnelsResponse {
  data: Funnel[];
}

interface AccountPerformanceProps {
  lawFirmId: string;
}

const PAGE_SIZE = 6;

export function AccountPerformance({ lawFirmId }: AccountPerformanceProps) {
  const { user, getAccessToken } = useAuth();
  const { dateQuery } = useDateRange();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<LeadsChartData | null>(null);
  const [comparison, setComparison] = useState<ComparisonChart | null>(null);
  const [funnels, setFunnels] = useState<FunnelsResponse | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const qs = dateQuery ? `&${dateQuery}` : "";

    api<AnalyticsSummary>(
      `admin/analytics/summary?law_firm_id=${lawFirmId}${qs}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {});

    api<LeadsChartData>(
      `admin/analytics/chart/leads?law_firm_id=${lawFirmId}${qs}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setChartData(data);
      })
      .catch(() => {});

    api<ComparisonChart>(
      `admin/account/performance/chart?law_firm_id=${lawFirmId}${qs}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setComparison(data);
      })
      .catch(() => {});

    api<FunnelsResponse>(
      `admin/account/performance/funnels?law_firm_id=${lawFirmId}${qs}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setFunnels(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user, getAccessToken, lawFirmId, dateQuery]);

  const { showSkeleton, fading } = useSkeletonTransition(!summary);

  if (showSkeleton)
    return (
      <div className={`flex flex-col gap-4${fading ? " skeleton-fade-out" : ""}`}>
        <div className="flex flex-col gap-4 @lg:flex-row">
          <div className="flex flex-col gap-4 flex-1">
            <SkeletonMetricCard className="h-full" />
            <SkeletonMetricCard className="h-full" />
          </div>
          <SkeletonChart className="flex-[2]" />
          <SkeletonRadialChart className="flex-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonChart />
          <SkeletonTable rows={6} />
        </div>
      </div>
    );

  const s = summary!;
  const mom = s.month_over_month;
  const totalPages = funnels ? Math.ceil(funnels.data.length / PAGE_SIZE) : 0;
  const currentPage = Math.min(page, totalPages || 1);
  const paginatedFunnels = funnels
    ? funnels.data.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: Metrics + Chart + Conversion Rate */}
      <div className="flex flex-col gap-4 @lg:flex-row skeleton-stagger">
        <div className="flex flex-col gap-4 flex-1">
          <MetricCard
            label="Total Visits"
            value={s.summary.visits}
            change={mom.visits_change}
            sparkline={s.series.visits}
            className="h-full"
          />
          <MetricCard
            label="Total Responses"
            value={s.summary.conversions}
            change={mom.conversions_change}
            sparkline={s.series.conversions}
            className="h-full"
          />
        </div>
        <LeadsChart data={chartData} className="flex-[2]" />
        <ConversionRateChart
          value={s.summary.conversion_rate}
          change={mom.conversion_rate_change}
          className="flex-1"
        />
      </div>

      {/* Bottom row: Comparison Chart + Funnels Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 skeleton-stagger">
        <ConversionComparisonChart data={comparison} />

        <Table
          title="Funnels"
          footer={
            funnels && funnels.data.length > PAGE_SIZE ? (
              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={funnels.data.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            ) : undefined
          }
        >
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead>Funnel Name</TableHead>
              <TableHead className="text-right">Total Visits</TableHead>
              <TableHead className="text-right">Total Responses</TableHead>
              <TableHead className="text-right">Conversion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFunnels.map((funnel) => (
              <TableRow
                key={funnel.name}
                className="border-b border-background"
              >
                <TableCell className="font-medium text-primary">
                  <span className="flex items-center gap-1">
                    {funnel.name}
                    <ChevronRight size={14} />
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {funnel.visits.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {funnel.conversions.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(funnel.conversion_rate)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
