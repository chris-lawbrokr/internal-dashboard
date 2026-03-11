"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function LineChart() {
  const t = useTranslations("charts");

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["#6366f1", "#a78bfa"],
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
    },
  };

  const series = [
    {
      name: t("visits"),
      data: [45, 52, 38, 30, 42, 55, 60],
    },
    {
      name: t("responses"),
      data: [20, 25, 32, 35, 28, 35, 40],
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
          <span className="text-xs text-muted-foreground">{t("visits")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#a78bfa]" />
          <span className="text-xs text-muted-foreground">{t("responses")}</span>
        </div>
      </div>
      <Chart options={options} series={series} type="area" height="100%" />
    </div>
  );
}
