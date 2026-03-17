"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SparklineChartProps {
  data: number[];
  color?: string;
}

export function SparklineChart({ data, color = "#3b2559" }: SparklineChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: [color],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: { enabled: false },
  };

  const series = [{ data }];

  return <Chart options={options} series={series} type="line" height={40} width={80} />;
}
