"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
const DATASET = {
  totals: { visits: 30435, responses: 9822 },
  series: {
    visits: [
      363, 404, 491, 504, 246, 320, 270, 173, 413, 246, 217, 212, 435, 272, 328,
      413, 305, 300, 405, 227, 203, 230, 359, 130, 243, 363, 400, 347, 376, 307,
      344, 350, 508, 292, 361, 278, 286, 352, 149, 405, 311, 447, 349, 287, 299,
      319, 244, 365, 317, 338, 352, 407, 427, 387, 376, 522, 314, 430, 456, 426,
      451, 299, 257, 181, 346, 228, 351, 367, 294, 283, 546, 381, 293, 283, 430,
      425, 257, 295, 249, 152, 277, 392, 218, 306, 426, 381, 388, 480, 516, 483,
    ],
    responses: [
      92, 109, 146, 152, 73, 127, 87, 46, 107, 81, 79, 79, 130, 78, 102, 104,
      100, 116, 158, 86, 64, 89, 130, 34, 82, 141, 123, 101, 125, 106, 124, 128,
      199, 81, 132, 97, 87, 108, 39, 153, 115, 121, 90, 90, 88, 94, 75, 106,
      112, 112, 107, 120, 107, 145, 129, 202, 118, 127, 150, 146, 134, 116, 77,
      72, 104, 76, 89, 139, 93, 105, 145, 118, 98, 78, 154, 116, 90, 106, 72,
      54, 74, 101, 76, 117, 114, 119, 142, 175, 133, 186,
    ],
  },
  dates: [
    1766620800000, 1766707200000, 1766793600000, 1766880000000, 1766966400000,
    1767052800000, 1767139200000, 1767225600000, 1767312000000, 1767398400000,
    1767484800000, 1767571200000, 1767657600000, 1767744000000, 1767830400000,
    1767916800000, 1768003200000, 1768089600000, 1768176000000, 1768262400000,
    1768348800000, 1768435200000, 1768521600000, 1768608000000, 1768694400000,
    1768780800000, 1768867200000, 1768953600000, 1769040000000, 1769126400000,
    1769212800000, 1769299200000, 1769385600000, 1769472000000, 1769558400000,
    1769644800000, 1769731200000, 1769817600000, 1769904000000, 1769990400000,
    1770076800000, 1770163200000, 1770249600000, 1770336000000, 1770422400000,
    1770508800000, 1770595200000, 1770681600000, 1770768000000, 1770854400000,
    1770940800000, 1771027200000, 1771113600000, 1771200000000, 1771286400000,
    1771372800000, 1771459200000, 1771545600000, 1771632000000, 1771718400000,
    1771804800000, 1771891200000, 1771977600000, 1772064000000, 1772150400000,
    1772236800000, 1772323200000, 1772409600000, 1772496000000, 1772582400000,
    1772668800000, 1772755200000, 1772841600000, 1772928000000, 1773014400000,
    1773100800000, 1773187200000, 1773273600000, 1773360000000, 1773446400000,
    1773532800000, 1773619200000, 1773705600000, 1773792000000, 1773878400000,
    1773964800000, 1774051200000, 1774137600000, 1774224000000, 1774310400000,
  ],
};

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LABEL_STYLE = { fontSize: "11px", colors: "var(--color-muted-foreground)" };

const ONE_DAY = 86_400_000;
const FORMAT_OPTS: [number, Intl.DateTimeFormatOptions][] = [
  [ONE_DAY, { hour: "numeric", hour12: true }],
  [ONE_DAY * 60, { month: "short", day: "numeric" }],
  [ONE_DAY * 730, { month: "short", year: "2-digit" }],
  [Infinity, { year: "numeric" }],
];

function formatDates(dates: number[]) {
  const span = dates[dates.length - 1] - dates[0];
  const opts = FORMAT_OPTS.find(([max]) => span < max)![1];
  const fmt = new Intl.DateTimeFormat("en", opts);
  return dates.map((ts) => fmt.format(new Date(ts)));
}

const categories = formatDates(DATASET.dates);
const series = Object.entries(DATASET.series).map(([name, data]) => ({ name, data }));

const LEGEND = [
  { key: "visits" as const, total: DATASET.totals.visits, dot: "bg-primary" },
  { key: "responses" as const, total: DATASET.totals.responses, dot: "bg-chart-tan" },
];

const OPTIONS: ApexCharts.ApexOptions = {
  chart: { type: "area", toolbar: { show: false } },
  colors: ["var(--color-primary)", "var(--color-chart-tan)"],
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 100] },
  },
  xaxis: {
    categories,
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

export function LineChart() {
  const t = useTranslations("charts");

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        {LEGEND.map(({ key, total, dot }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="text-xs text-muted-foreground">
              {t(key)}: <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
            </span>
          </div>
        ))}
      </div>
      <Chart
        options={OPTIONS}
        series={series.map((s) => ({ ...s, name: t(s.name as "visits" | "responses") }))}
        type="area"
        height="100%"
      />
    </div>
  );
}
