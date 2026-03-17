"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Sidebar, SidebarOpenButton } from "@/app/ui/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePickerWithPresets } from "@/components/ui/datepicker";
import { OverviewTab } from "./OverviewTab";
import { PerformanceTab } from "./PerformanceTab";
import { WebsiteTab } from "./WebsiteTab";
import { UsageTab } from "./UsageTab";

const tabKeys = ["overview", "performance", "website", "usage"] as const;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = useTranslations("account");
  const tc = useTranslations("common");

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

        <div className="relative flex-1 min-w-0 flex flex-col bg-[#fbfbfb]">
          {!sidebarOpen && <SidebarOpenButton onClick={() => setSidebarOpen(true)} />}
          <div className="flex-1 min-h-0 p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-xl border border-[#c8c8c8] px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back")}
              </Link>
              <h1 className="text-2xl font-bold text-[#070043]">
                Smith Law Firm
              </h1>
            </div>
            <DateRangePickerWithPresets defaultPreset="90d" />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#c8c8c8]">
            {tabKeys.map((tabKey) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={`pb-2 text-base font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeTab === tabKey
                    ? "border-[#3b2559] text-[#070043]"
                    : "border-transparent text-[#777] hover:text-[#070043]"
                }`}
              >
                {t(tabKey)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "website" && <WebsiteTab />}
          {activeTab === "usage" && <UsageTab />}
          </div>
        </div>
    </div>
  );
}
