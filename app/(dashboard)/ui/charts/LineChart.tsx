"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// --- Swap between sample datasets to test different API structures ---

const DATASETS = {
  // 8 hours on Mar 24, 2025: 9am–4pm
  hours: {
    dates: [1742810400000, 1742814000000, 1742817600000, 1742821200000, 1742824800000, 1742828400000, 1742832000000, 1742835600000],
    series: [
      { name: "visits", data: [12, 25, 38, 42, 35, 30, 28, 18] },
      { name: "responses", data: [4, 10, 15, 18, 14, 12, 9, 6] },
    ],
    totals: { visits: 228, responses: 88 },
  },

  // 7 consecutive days: Mar 18–24, 2025
  days: {
    dates: [1742256000000, 1742342400000, 1742428800000, 1742515200000, 1742601600000, 1742688000000, 1742774400000],
    series: [
      { name: "visits", data: [120, 98, 140, 135, 160, 88, 72] },
      { name: "responses", data: [45, 38, 62, 55, 70, 30, 25] },
    ],
    totals: { visits: 813, responses: 325 },
  },

  // 7 consecutive months: Jan–Jul 2025
  months: {
    dates: [1735689600000, 1738368000000, 1740787200000, 1743465600000, 1746057600000, 1748736000000, 1751328000000],
    series: [
      { name: "visits", data: [1200, 1350, 1100, 1500, 1420, 1600, 1750] },
      { name: "responses", data: [400, 480, 390, 520, 510, 560, 620] },
    ],
    totals: { visits: 9920, responses: 3480 },
  },

  // 7 consecutive years: 2019–2025
  years: {
    dates: [1546300800000, 1577836800000, 1609459200000, 1640995200000, 1672531200000, 1704067200000, 1735689600000],
    series: [
      { name: "visits", data: [8500, 12000, 9800, 15000, 22000, 28000, 35000] },
      { name: "responses", data: [2100, 3500, 2800, 4200, 6500, 8400, 10500] },
    ],
    totals: { visits: 130300, responses: 38000 },
  },
};

type DatasetKey = keyof typeof DATASETS;

/** Convert epoch ms dates to display labels based on the time span */
function normalise(key: DatasetKey) {
  const ds = DATASETS[key];
  const span = ds.dates[ds.dates.length - 1] - ds.dates[0];
  const ONE_DAY = 86_400_000;

  let fmt: Intl.DateTimeFormat;
  if (span < ONE_DAY) {
    // Hours range — show "9 AM"
    fmt = new Intl.DateTimeFormat("en", { hour: "numeric", hour12: true });
  } else if (span < ONE_DAY * 60) {
    // Days range — show "Mar 18"
    fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  } else if (span < ONE_DAY * 730) {
    // Months range — show "Jan 25"
    fmt = new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" });
  } else {
    // Years range — show "2019"
    fmt = new Intl.DateTimeFormat("en", { year: "numeric" });
  }

  const categories = ds.dates.map((ts) => fmt.format(new Date(ts)));
  return { categories, series: ds.series, totals: ds.totals };
}

export function LineChart() {
  const t = useTranslations("charts");
  const [activeDS, setActiveDS] = useState<DatasetKey>("hours");
  const { categories, series, totals } = normalise(activeDS);

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
      labels: { style: { fontSize: "11px", colors: "var(--color-muted-foreground)" } },
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
      {/* Dataset switcher for testing */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground font-medium">Time&nbsp;range:</span>
        {(Object.keys(DATASETS) as DatasetKey[]).map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => setActiveDS(key)}
            className={`px-2 py-0.5 rounded text-xs border transition-colors ${
              activeDS === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

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
