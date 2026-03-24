"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import DATASET from "./datasets.json";

/** Convert epoch ms dates to display labels based on the time span */
function normalise() {
  const span = DATASET.dates[DATASET.dates.length - 1] - DATASET.dates[0];
  const ONE_DAY = 86_400_000;

  let fmt: Intl.DateTimeFormat;
  if (span < ONE_DAY) {
    fmt = new Intl.DateTimeFormat("en", { hour: "numeric", hour12: true });
  } else if (span < ONE_DAY * 60) {
    fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  } else if (span < ONE_DAY * 730) {
    fmt = new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" });
  } else {
    fmt = new Intl.DateTimeFormat("en", { year: "numeric" });
  }

  const categories = DATASET.dates.map((ts) => fmt.format(new Date(ts)));
  return { categories, series: DATASET.series, totals: DATASET.totals };
}

export function LineChart() {
  const t = useTranslations("charts");
  const { categories, series, totals } = normalise();

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["var(--color-primary)", "var(--color-chart-tan)"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories,
      tickAmount: 8,
      labels: {
        rotate: 0,
        hideOverlappingLabels: true,
        style: { fontSize: "11px", colors: "var(--color-muted-foreground)" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "11px", colors: "var(--color-muted-foreground)" } },
    },
    grid: {
      borderColor: "var(--color-background)",
      strokeDashArray: 4,
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
    },
  };

  const translatedSeries = series.map((s) => ({
    ...s,
    name: t(s.name as "visits" | "responses"),
  }));

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">
            {t("visits")}: <span className="font-semibold text-foreground">{totals.visits.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-chart-tan" />
          <span className="text-xs text-muted-foreground">
            {t("responses")}: <span className="font-semibold text-foreground">{totals.responses.toLocaleString()}</span>
          </span>
        </div>
      </div>
      <Chart options={options} series={translatedSeries} type="area" height="100%" />
    </div>
  );
}
