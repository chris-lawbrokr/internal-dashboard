"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SparklineChartProps {
  data: number[];
  color?: string;
}

export function SparklineChart({ data: rawData, color = "var(--color-primary)" }: SparklineChartProps) {
  // Trim trailing low values (< 10) so the chart doesn't draw a flat line
  let end = rawData.length;
  while (end > 0 && (rawData[end - 1] ?? 0) < 10) end--;
  const data = rawData.slice(0, end);

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
