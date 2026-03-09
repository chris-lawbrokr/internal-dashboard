"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PieChart() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
    },
    colors: ["#6366f1"],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "55%",
        },
        track: {
          background: "#e5e7eb",
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
    labels: ["Conversion"],
  };

  const series = [90];

  return (
    <Chart options={options} series={series} type="radialBar" height="100%" />
  );
}
