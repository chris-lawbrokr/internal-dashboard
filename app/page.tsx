"use client";

import { useTranslations } from "next-intl";
import { Calendar, ChevronDown } from "lucide-react";
import { Sidebar } from "@/app/ui/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { AccountsTable } from "@/app/ui/AccountsTable";
import { PieChart } from "@/app/ui/PieChart";
import { LineChart } from "@/app/ui/LineChart";
import { SparklineChart } from "@/app/ui/SparklineChart";

export default function Dashboard() {
  const t = useTranslations("dashboard");

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar />

        <div className="flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-[#fbfbfb]">
          {/* Welcome + Date Filter */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {t("welcome", { name: "Penelope" })}
            </h1>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted cursor-pointer"
            >
              <Calendar size={14} />
              {t("last90Days")}
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Stats Row */}
          <div className="min-w-[320px] flex flex-col gap-4 @xl:flex-row">
            {/* Left: Stacked stat cards */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <Card className="flex-1 p-4">
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
                  <SparklineChart
                    data={[30, 40, 35, 50, 45, 55, 60]}
                    color="#3b2559"
                  />
                </CardContent>
              </Card>
              <Card className="flex-1 p-4">
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
                  <SparklineChart
                    data={[20, 25, 22, 30, 28, 35, 40]}
                    color="#3b2559"
                  />
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
            <Card className="flex-1 min-w-0 p-4">
              <CardContent className="flex flex-col h-full">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">
                    {t("conversionRate")}
                  </p>
                  <p className="text-3xl font-bold text-[#070043]">10%</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                    {t("vsLastMonth")}
                  </p>
                </div>
                <div className="flex-1 min-h-0 flex items-center justify-center">
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
