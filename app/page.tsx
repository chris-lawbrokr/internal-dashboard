"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/ui/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { AccountsTable } from "@/app/ui/AccountsTable";
import { PieChart } from "@/app/ui/PieChart";
import { LineChart } from "@/app/ui/LineChart";
import { SparklineChart } from "@/app/ui/SparklineChart";
import { DateRangePickerWithPresets } from "@/components/ui/datepicker";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = useTranslations("dashboard");

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-[#fbfbfb]">
          {/* Welcome + Date Filter */}
          <div className="flex flex-col @xl:flex-row @xl:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">
              {t("welcome", { name: "Penelope" })}
            </h1>
            <div className="w-full @xl:w-auto [&>div]:w-full @xl:[&>div]:w-auto [&>div>button:first-child]:w-full @xl:[&>div>button:first-child]:w-auto">
              <DateRangePickerWithPresets defaultPreset="90d" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-col gap-4 @xl:flex-row">
            {/* Left: Stacked stat cards */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <Card className="flex-1 p-4 @container/stat">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {t("totalVisits")}
                    </p>
                    <p className="text-2xl font-bold">4,268</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                      {t("vsLastMonth")}
                    </p>
                  </div>
                  <div className="hidden @[200px]/stat:block">
                    <SparklineChart
                      data={[30, 40, 35, 50, 45, 55, 60]}
                      color="#bcbc95"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 p-4 @container/stat2">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {t("totalResponses")}
                    </p>
                    <p className="text-2xl font-bold">426</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                      {t("vsLastMonth")}
                    </p>
                  </div>
                  <div className="hidden @[200px]/stat2:block">
                    <SparklineChart
                      data={[20, 25, 22, 30, 28, 35, 40]}
                      color="#bcbc95"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle: Area chart */}
            <Card className="flex-[2] min-w-0 p-4 flex">
              <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
                <LineChart />
              </CardContent>
            </Card>

            {/* Right: Conversion rate + donut */}
            <Card className="flex-1 min-w-0 p-4 @container/conv">
              <CardContent className="flex flex-col @[200px]/conv:flex-row @[200px]/conv:items-center @[200px]/conv:justify-between h-full gap-2">
                <div className="flex flex-col gap-1 items-start h-full">
                  <p className="text-sm text-muted-foreground">
                    {t("conversionRate")}
                  </p>
                  <p className="text-3xl font-bold text-[#070043]">10%</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                    {t("vsLastMonth")}
                  </p>
                </div>
                <div className="shrink-0 self-center">
                  <PieChart />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts Table */}
          <div className="min-w-[320px]">
            <AccountsTable />
          </div>
      </div>
    </div>
  );
}
