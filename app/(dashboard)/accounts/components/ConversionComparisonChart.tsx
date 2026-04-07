"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LABEL_STYLE = {
  fontSize: "11px",
  colors: "var(--color-muted-foreground)",
};

interface ComparisonChart {
  series: {
    current: number[];
    previous: number[];
  };
  labels: string[];
}

interface ConversionComparisonChartProps {
  data?: ComparisonChart | null;
}

export function ConversionComparisonChart({
  data,
}: ConversionComparisonChartProps) {
  const labels = data?.labels ?? [];
  const seriesData = [
    { name: "Current", data: data?.series.current ?? [] },
    { name: "Previous", data: data?.series.previous ?? [] },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#3B2559", "#B6B2D3"],
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 3,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      categories: labels,
      labels: { style: LABEL_STYLE },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: LABEL_STYLE } },
    grid: { borderColor: "var(--color-background)", strokeDashArray: 4 },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: { shape: "circle", size: 5 },
      fontSize: "12px",
      labels: { colors: "var(--color-muted-foreground)" },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  return (
    <Card className="min-w-0 p-4 flex flex-col">
      <h3 className="text-base font-semibold px-2 mb-2">
        Conversion Rate Comparison
      </h3>
      <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
        <Chart options={options} series={seriesData} type="bar" height={300} />
      </CardContent>
    </Card>
  );
}
