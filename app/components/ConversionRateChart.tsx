"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ConversionRateChartProps {
  value?: number;
  label?: string;
  change?: number | undefined;
  className?: string;
}

export function ConversionRateChart({
  value = 10,
  label = "Conversion",
  change,
  className,
}: ConversionRateChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: false },
      toolbar: { show: false },
    },
    grid: {
      padding: { top: -25, bottom: -25, left: -15, right: -15 },
    },
    colors: ["var(--color-chart-purple)"],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "55%",
        },
        track: {
          background: "var(--color-status-neutral-bg)",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: [label],
  };

  const series = [value];

  return (
    <Card className={`p-4 flex items-center justify-center ${className ?? ""}`}>
      <div className="w-full h-full">
        <p className="text-sm text-muted-foreground">Conversion Rate</p>
        <p className="text-2xl font-bold">{Math.round(value)}%</p>
        {change != null && (
          <p className="text-xs text-muted-foreground">
            <span
              className={
                change >= 0
                  ? "text-status-success-border"
                  : "text-status-error-border"
              }
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(Math.round(change))}%
            </span>{" "}
            vs last month
          </p>
        )}
      </div>
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={140}
        width={140}
      />
    </Card>
  );
}
