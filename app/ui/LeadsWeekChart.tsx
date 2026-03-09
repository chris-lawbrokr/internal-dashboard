"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function LeadsWeekChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#312e81", "#6366f1"],
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
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
    { name: "Organic", data: [30, 40, 35, 50, 49, 60, 55] },
    { name: "Paid", data: [20, 25, 22, 30, 28, 35, 30] },
  ];

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">3.8k</span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            ↑25%
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Leads generated per week
        </span>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-[11px] text-muted-foreground">
            Money spent: <span className="font-semibold text-foreground">$3,425</span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            Conversion rate: <span className="font-semibold text-foreground">0.3%</span>
          </span>
        </div>
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
