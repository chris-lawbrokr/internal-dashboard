"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function UsersMonthChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: ["var(--color-chart-indigo)"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: "Users",
      data: [120, 180, 150, 220, 170, 200, 260, 230, 280, 250, 310, 290],
    },
  ];

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">867.4k</span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            ↑10%
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Users this month</span>
      </CardContent>
      <div className="mt-2 flex-1 min-h-0">
        <Chart options={options} series={series} type="area" height={80} />
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
