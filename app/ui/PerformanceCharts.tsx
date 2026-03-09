"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  sparkData: number[];
}

export function StatCard({ title, value, change, sparkData }: StatCardProps) {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", sparkline: { enabled: true } },
    colors: ["#374151"],
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };

  return (
    <Card className="p-4">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-green-600">&uarr; {change} vs last month</p>
        </div>
        <div className="w-24 h-10">
          <Chart options={options} series={[{ data: sparkData }]} type="line" height={40} width="100%" />
        </div>
      </CardContent>
    </Card>
  );
}

export function VisitsResponsesChart() {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    colors: ["#312e81", "#e8b86d"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] },
    },
    xaxis: {
      categories: ["Jun 21", "Jun 22", "Jun 23", "Jun 24", "Jun 25", "Jun 26", "Jun 27"],
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#9ca3af" },
        formatter: (val: number) => `$${(val / 1000).toFixed(0)},000`,
      },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "12px",
      markers: { size: 6, shape: "circle" as const },
      formatter: (seriesName: string, opts: { seriesIndex: number }) => {
        const totals = ["4,268", "426"];
        return `${seriesName}: <strong>${totals[opts.seriesIndex]}</strong>`;
      },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const series = [
    { name: "Visits", data: [15000, 18000, 12000, 20000, 14000, 16000, 11000] },
    { name: "Responses", data: [8000, 10000, 7000, 12000, 9000, 11000, 6000] },
  ];

  return (
    <Card className="p-4">
      <CardContent>
        <Chart options={options} series={series} type="area" height={250} />
      </CardContent>
    </Card>
  );
}

export function ConversionRateCard() {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "radialBar" },
    colors: ["#a78bfa"],
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        track: { background: "#ede9fe", strokeWidth: "100%" },
        dataLabels: {
          name: { show: false },
          value: { show: false },
        },
      },
    },
    stroke: { lineCap: "round" },
  };

  return (
    <Card className="p-4">
      <CardContent className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-3xl font-bold">10%</p>
          <p className="text-xs text-green-600">&uarr; 10% vs last month</p>
        </div>
        <div className="w-32 h-32 ml-auto">
          <Chart options={options} series={[10]} type="radialBar" height={130} />
        </div>
      </CardContent>
    </Card>
  );
}

export function ConversionRatesOverPeriodsChart() {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#312e81", "#a78bfa"],
    plotOptions: {
      bar: { columnWidth: "60%", borderRadius: 3 },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      markers: { size: 6, shape: "circle" as const },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const series = [
    { name: "Templates", data: [85, 120, 60, 110, 90, 130, 50] },
    { name: "Icons", data: [70, 95, 45, 85, 75, 105, 65] },
  ];

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">Conversion Rates over Periods</h3>
        <div className="border-t" />
        <Chart options={options} series={series} type="bar" height={320} />
      </CardContent>
    </Card>
  );
}

const funnels = Array.from({ length: 10 }, () => ({
  name: "Funnel Name Here",
  visits: 1000,
  conversions: 100,
  rate: "10%",
}));

export function FunnelsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(funnels.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const paginated = funnels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">Funnels</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Funnel Name</th>
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Total Visits</th>
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Total Conversions</th>
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((funnel, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-3 px-2 font-medium">{funnel.name}</td>
                <td className="py-3 px-2">{funnel.visits.toLocaleString()}</td>
                <td className="py-3 px-2">{funnel.conversions}</td>
                <td className="py-3 px-2">{funnel.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            Rows per page
            <select aria-label="Rows per page" className="border rounded px-1 py-0.5 text-sm" defaultValue={99}>
              <option value={99}>99</option>
            </select>
            <span>
              <strong>1-{Math.min(currentPage * pageSize, funnels.length)}</strong> of <strong>{funnels.length}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 text-sm font-medium hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
