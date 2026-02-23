"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PieChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Direct", "Organic", "Referral", "Social"],
    colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"],
    legend: {
      position: "bottom",
    },
  };

  const series = [44, 25, 18, 13];

  return (
    <Chart options={options} series={series} type="pie" height="100%" />
  );
}
