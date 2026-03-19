"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { chartColors } from "@/lib/chart-colors";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function UsersByCountryChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: [chartColors.amber],
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 3,
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "10px", colors: chartColors.label } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "10px", colors: chartColors.label } },
    },
    grid: {
      borderColor: chartColors.grid,
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const series = [
    {
      name: "Users",
      data: [2486, 2100, 2260, 1900, 1600, 1400, 1800],
    },
  ];

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">385,756</span>
        </div>
        <span className="text-xs text-muted-foreground">Users by country</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] border rounded px-2 py-0.5 text-muted-foreground">
            United States
          </span>
          <span className="text-[11px] border rounded px-2 py-0.5 text-muted-foreground">
            Desktop
          </span>
        </div>
      </CardContent>
      <div className="mt-2 flex-1 min-h-0">
        <Chart options={options} series={series} type="bar" height={150} />
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>
    </Card>
  );
}
