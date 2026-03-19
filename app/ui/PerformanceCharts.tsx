"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { chartColors } from "@/lib/chart-colors";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  sparkData: number[];
}

export function StatCard({ title, value, change, sparkData }: StatCardProps) {
  const tp = useTranslations("performance");
  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", sparkline: { enabled: true } },
    colors: [chartColors.gray],
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };

  return (
    <Card className="p-4">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-green-600">
            &uarr; {change} {tp("vsLastMonth")}
          </p>
        </div>
        <div className="w-24 h-10">
          <Chart
            options={options}
            series={[{ data: sparkData }]}
            type="line"
            height={40}
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function VisitsResponsesChart() {
  const tc = useTranslations("charts");
  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    colors: [chartColors.indigo, chartColors.gold],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: [
        "Jun 21",
        "Jun 22",
        "Jun 23",
        "Jun 24",
        "Jun 25",
        "Jun 26",
        "Jun 27",
      ],
      labels: { style: { fontSize: "11px", colors: chartColors.label } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: chartColors.label },
        formatter: (val: number) => `$${(val / 1000).toFixed(0)},000`,
      },
    },
    grid: { borderColor: chartColors.grid, strokeDashArray: 4 },
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
    {
      name: tc("visits"),
      data: [15000, 18000, 12000, 20000, 14000, 16000, 11000],
    },
    {
      name: tc("responses"),
      data: [8000, 10000, 7000, 12000, 9000, 11000, 6000],
    },
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
  const tp = useTranslations("performance");
  const options: ApexCharts.ApexOptions = {
    chart: { type: "radialBar" },
    colors: [chartColors.purple],
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        track: { background: chartColors.purpleTrack, strokeWidth: "100%" },
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
          <p className="text-sm text-muted-foreground">
            {tp("conversionRate")}
          </p>
          <p className="text-3xl font-bold">10%</p>
          <p className="text-xs text-green-600">
            &uarr; 10% {tp("vsLastMonth")}
          </p>
        </div>
        <div className="w-32 h-32 ml-auto">
          <Chart
            options={options}
            series={[10]}
            type="radialBar"
            height={130}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ConversionRatesOverPeriodsChart() {
  const tp = useTranslations("performance");
  const tc = useTranslations("charts");
  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: [chartColors.primary, chartColors.lavender],
    plotOptions: {
      bar: {
        columnWidth: "70%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "11px", colors: chartColors.label } },
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
    { name: tc("templates"), data: [85, 120, 60, 110, 90, 130, 50] },
    { name: tc("icons"), data: [70, 95, 45, 85, 75, 105, 65] },
  ];

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">
          {tp("conversionRatesOverPeriods")}
        </h3>
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
  const tp = useTranslations("performance");
  const pageSize = 6;
  const totalPages = Math.ceil(funnels.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const paginated = funnels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <Table
      toolbar={
        <h3 className="text-base font-semibold">{tp("funnels")}</h3>
      }
      footer={
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={funnels.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      }
    >
      <TableHeader>
        <TableRow>
          <TableHead className="py-2 px-2">
            {tp("funnelName")}
          </TableHead>
          <TableHead className="py-2 px-2">
            {tp("totalVisits")}
          </TableHead>
          <TableHead className="py-2 px-2">
            {tp("totalConversions")}
          </TableHead>
          <TableHead className="py-2 px-2">
            {tp("conversionRate")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((funnel, i) => (
          <TableRow key={i}>
            <TableCell className="py-3 px-2 font-medium">{funnel.name}</TableCell>
            <TableCell className="py-3 px-2">
              {funnel.visits.toLocaleString()}
            </TableCell>
            <TableCell className="py-3 px-2">{funnel.conversions}</TableCell>
            <TableCell className="py-3 px-2">{funnel.rate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
