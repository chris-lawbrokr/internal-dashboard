"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Sidebar, SidebarOpenButton } from "@/app/ui/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/datepicker";
import { OverviewTab } from "./OverviewTab";
import { PerformanceTab } from "./PerformanceTab";
import { WebsiteTab } from "./WebsiteTab";

const tabKeys = ["overview", "performance", "website", "usage"] as const;

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = useTranslations("account");
  const tc = useTranslations("common");

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

        <div className="relative flex-1 min-w-0 flex flex-col bg-[#fbfbfb]">
          {!sidebarOpen && <SidebarOpenButton onClick={() => setSidebarOpen(true)} />}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto overflow-x-hidden @container flex flex-col gap-4">
          <Card className="p-4">
            <CardContent className="flex gap-4 justify-between items-center">
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("back")}
                </Link>
                <h1 className="text-xl font-bold leading-[1.25]">
                  Law Firm Name
                </h1>
              </div>
              <div>
                <DateRangePicker
                  labels={{ start: tc("startDate"), end: tc("endDate") }}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(s, e) => {
                    setStartDate(s);
                    setEndDate(e);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-6 border-b">
            {tabKeys.map((tabKey) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={`pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tabKey
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tabKey)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "website" && <WebsiteTab />}
          </div>
        </div>
    </div>
  );
}
