"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LABEL_STYLE = { fontSize: "11px", colors: "var(--color-muted-foreground)" };

export interface LineChartData {
  totals: { visits: number; conversions: number };
  series: { visits: number[]; conversions: number[] };
  labels: string[];
}

interface LineChartProps {
  data?: LineChartData | null;
}

export function LineChart({ data }: LineChartProps) {
  const t = useTranslations("charts");

  const totals = data?.totals ?? { visits: 0, conversions: 0 };
  const labels = data?.labels ?? [];
  const seriesData = [
    { name: t("visits"), data: data?.series.visits ?? [] },
    { name: t("responses"), data: data?.series.conversions ?? [] },
  ];

  const legend = [
    { label: t("visits"), total: totals.visits, dot: "bg-primary" },
    { label: t("responses"), total: totals.conversions, dot: "bg-chart-tan" },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    colors: ["var(--color-primary)", "var(--color-chart-tan)"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 100] },
    },
    xaxis: {
      categories: labels,
      tickAmount: 8,
      labels: { rotate: 0, hideOverlappingLabels: true, style: LABEL_STYLE },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: LABEL_STYLE } },
    grid: { borderColor: "var(--color-background)", strokeDashArray: 4 },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        {legend.map(({ label, total, dot }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="text-xs text-muted-foreground">
              {label}: <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
            </span>
          </div>
        ))}
      </div>
      <Chart
        options={options}
        series={seriesData}
        type="area"
        height="100%"
      />
    </div>
  );
}
