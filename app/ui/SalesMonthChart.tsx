"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function SalesMonthChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["var(--color-chart-indigo)", "var(--color-chart-indigo-medium)", "var(--color-chart-indigo)", "var(--color-chart-indigo-medium)", "var(--color-chart-indigo)", "var(--color-chart-indigo-light)", "var(--color-chart-indigo)"],
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 3,
        distributed: true,
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "10px", colors: "var(--color-chart-label)" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const series = [
    {
      name: "Sales",
      data: [180, 150, 200, 140, 220, 90, 170],
    },
  ];

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$987,756</span>
          <span className="text-[11px] text-muted-foreground">
            Apr 17–May 17, 2025
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Sales this month</span>
      </CardContent>
      <div className="mt-2 flex-1 min-h-0">
        <Chart options={options} series={series} type="bar" height={150} />
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <span className="text-xs text-muted-foreground">Last 7 days</span>
        <a href="#" className="text-xs text-indigo-600 font-medium hover:underline">
          Users report &rsaquo;
        </a>
      </div>
    </Card>
  );
}
