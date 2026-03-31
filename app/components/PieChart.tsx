"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartProps {
  value?: number;
  label?: string;
}

export function PieChart({ value = 10, label = "Conversion" }: PieChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    colors: ["var(--color-chart-purple)"],
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
    labels: [label],
  };

  const series = [value];

  return (
    <Chart
      options={options}
      series={series}
      type="radialBar"
      height={140}
      width={140}
    />
  );
}
