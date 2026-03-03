"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function CountrySessionsChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "scatter",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#312e81"],
    xaxis: {
      min: -180,
      max: 180,
      tickAmount: 6,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: -60,
      max: 80,
      tickAmount: 4,
      labels: { show: false },
    },
    grid: { show: false },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
      custom({ seriesIndex, dataPointIndex, w }) {
        const point = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div class="px-2 py-1 text-xs">${point.z?.toLocaleString() ?? ""} sessions</div>`;
      },
    },
    markers: {
      size: [6, 8, 5, 10, 7, 9, 4, 6, 8, 5, 7, 6, 5, 8, 4, 6],
    },
  };

  const series = [
    {
      name: "Sessions",
      data: [
        { x: -100, y: 40, z: 3856 },
        { x: -80, y: 35, z: 2400 },
        { x: -60, y: -15, z: 1200 },
        { x: 0, y: 52, z: 2800 },
        { x: 10, y: 48, z: 3200 },
        { x: 15, y: 44, z: 2600 },
        { x: 25, y: 55, z: 1800 },
        { x: 35, y: 35, z: 1500 },
        { x: 50, y: 25, z: 900 },
        { x: 75, y: 35, z: 2100 },
        { x: 80, y: 30, z: 1400 },
        { x: 105, y: 38, z: 1900 },
        { x: 120, y: 35, z: 2400 },
        { x: 140, y: -25, z: 1600 },
        { x: -45, y: 10, z: 800 },
        { x: 30, y: 0, z: 700 },
      ],
    },
  ];

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <span className="text-sm font-semibold">Country wise sessions</span>
      </CardContent>
      <div className="mt-2 flex-1 min-h-0">
        <Chart options={options} series={series} type="scatter" height={180} />
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
