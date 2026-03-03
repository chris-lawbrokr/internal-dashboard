"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function UsersWeekChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#312e81", "#6366f1", "#a5b4fc", "#e0e7ff"],
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
    { name: "Series 1", data: [44, 55, 41, 67, 22, 43, 36] },
    { name: "Series 2", data: [13, 23, 20, 8, 13, 27, 18] },
    { name: "Series 3", data: [11, 17, 15, 15, 21, 14, 11] },
    { name: "Series 4", data: [8, 12, 10, 12, 15, 10, 8] },
  ];

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">91.2k</span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            ↑10%
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Users this week</span>
      </CardContent>
      <div className="mt-2 flex-1 min-h-0">
        <Chart options={options} series={series} type="bar" height={150} />
      </div>
      <div className="flex items-center gap-3 mt-1">
        {[
          { label: "Series 1", color: "#312e81" },
          { label: "Series 2", color: "#6366f1" },
          { label: "Series 4", color: "#e0e7ff" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
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
