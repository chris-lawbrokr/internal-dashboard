"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { chartColors } from "@/lib/chart-colors";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PieChart() {
  const t = useTranslations("charts");

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    colors: [chartColors.purple],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "55%",
        },
        track: {
          background: "var(--color-status-neutral-bg)",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: [t("conversion")],
  };

  const series = [10];

  return (
    <Chart options={options} series={series} type="radialBar" height={140} width={140} />
  );
}
