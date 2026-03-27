"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart } from "@/app/(dashboard)/ui/charts/LineChart";
import type { LineChartData } from "@/app/(dashboard)/ui/charts/LineChart";
import { SparklineChart } from "@/app/(dashboard)/ui/charts/SparklineChart";
import { PieChart } from "@/app/(dashboard)/ui/charts/PieChart";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

interface PerformanceChart {
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

interface PerformanceTabProps {
  lawFirmId?: string | null;
  startDate?: Date;
  endDate?: Date;
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

export function PerformanceTab({ lawFirmId, startDate, endDate }: PerformanceTabProps) {
  const t = useTranslations("dashboard");
  const tp = useTranslations("performance");
  const tc = useTranslations("charts");

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<LineChartData | null>(null);
  const [perfChart, setPerfChart] = useState<PerformanceChart | null>(null);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [funnelPage, setFunnelPage] = useState(1);

  useEffect(() => {
    if (!lawFirmId) return;

    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const dateQs = startDate && endDate
      ? `&start_date=${fmt(startDate)}&end_date=${fmt(endDate)}`
      : "";

    fetch(`/api/analytics/summary?law_firm_id=${lawFirmId}${dateQs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setAnalytics)
      .catch((e) => console.error("Failed to fetch analytics summary:", e));

    fetch(`/api/analytics/chart/leads?law_firm_id=${lawFirmId}${dateQs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setChartData)
      .catch((e) => console.error("Failed to fetch chart data:", e));

    fetch(`/api/account/performance/chart?law_firm_id=${lawFirmId}${dateQs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setPerfChart)
      .catch((e) => console.error("Failed to fetch performance chart:", e));

    fetch(`/api/account/performance/funnels?law_firm_id=${lawFirmId}${dateQs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setFunnels(data.data ?? []))
      .catch((e) => console.error("Failed to fetch funnels:", e));
  }, [lawFirmId, startDate, endDate]);

  const visits = analytics?.summary.visits ?? 0;
  const conversions = analytics?.summary.conversions ?? 0;
  const conversionRate = analytics?.summary.conversion_rate ?? 0;
  const mom = analytics?.month_over_month;
  const series = analytics?.series;

  // Performance chart options
  const perfChartOptions: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["var(--color-primary)", "var(--color-chart-lavender)"],
    plotOptions: {
      bar: {
        columnWidth: "70%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      categories: perfChart?.labels ?? [],
      labels: { style: { fontSize: "11px", colors: "var(--color-chart-label)" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      markers: { size: 6, shape: "circle" as const },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const perfChartSeries = [
    { name: tc("templates"), data: perfChart?.series.current ?? [] },
    { name: tc("icons"), data: perfChart?.series.previous ?? [] },
  ];

  // Funnels pagination
  const funnelPageSize = 6;
  const funnelTotalPages = Math.ceil(funnels.length / funnelPageSize);
  const funnelCurrentPage = Math.min(funnelPage, funnelTotalPages || 1);
  const paginatedFunnels = funnels.slice(
    (funnelCurrentPage - 1) * funnelPageSize,
    funnelCurrentPage * funnelPageSize,
  );

  return (
    <>
      {/* Stats Row */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <Card className="flex-1 p-4 @container/stat">
            <CardContent className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  {t("totalVisits")}
                </p>
                <p className="text-2xl font-bold">{visits.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{conversions.toLocaleString()}</p>
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

        <Card className="flex-[2] min-w-0 p-4 flex">
          <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
            <LineChart data={chartData} />
          </CardContent>
        </Card>

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

      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4">
        {/* Conversion Rates over Periods */}
        <Card className="p-4 h-full">
          <CardContent className="flex flex-col gap-2 h-full">
            <h3 className="text-base font-semibold">
              {tp("conversionRatesOverPeriods")}
            </h3>
            <div className="border-t" />
            <div className="flex-1 min-h-[320px]">
              <Chart options={perfChartOptions} series={perfChartSeries} type="bar" height="100%" />
            </div>
          </CardContent>
        </Card>

        {/* Funnels Table */}
        <Table
          toolbar={
            <h3 className="text-base font-semibold">{tp("funnels")}</h3>
          }
          footer={
            <TablePagination
              page={funnelCurrentPage}
              totalPages={funnelTotalPages}
              totalItems={funnels.length}
              pageSize={funnelPageSize}
              onPageChange={setFunnelPage}
            />
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-2">{tp("funnelName")}</TableHead>
              <TableHead className="py-2 px-2">{tp("totalVisits")}</TableHead>
              <TableHead className="py-2 px-2">{tp("totalConversions")}</TableHead>
              <TableHead className="py-2 px-2">{tp("conversionRate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFunnels.map((funnel, i) => (
              <TableRow key={`${funnel.name}-${i}`}>
                <TableCell className="py-3 px-2 font-medium">{funnel.name}</TableCell>
                <TableCell className="py-3 px-2">
                  {funnel.visits.toLocaleString()}
                </TableCell>
                <TableCell className="py-3 px-2">
                  {funnel.conversions.toLocaleString()}
                </TableCell>
                <TableCell className="py-3 px-2">
                  {Math.round(funnel.conversion_rate)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
