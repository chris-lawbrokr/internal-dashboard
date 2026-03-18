"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Sidebar } from "@/app/ui/Sidebar";
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
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

        <div className="flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-[#fbfbfb]">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="self-start flex items-center gap-1.5 rounded-xl border border-[#c8c8c8] px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </Link>
            <div className="flex flex-col @xl:flex-row @xl:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-[#070043]">
                Smith Law Firm
              </h1>
              <div className="w-full @xl:w-auto [&>div]:w-full @xl:[&>div]:w-auto [&_button]:w-full @xl:[&_button]:w-auto">
                <DateRangePickerWithPresets defaultPreset="90d" />
              </div>
            </div>
          </div>

          {/* Tabs – dropdown on mobile, inline tabs on desktop */}
          <div className="relative @xl:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              aria-label={t("selectTab")}
              className="w-full appearance-none rounded-md border px-3 py-2 pr-8 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {tabKeys.map((tabKey) => (
                <option key={tabKey} value={tabKey}>
                  {t(tabKey)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-3.5 w-3.5"
            />
          </div>
          <div className="hidden @xl:flex gap-6 border-b border-[#c8c8c8]">
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
  );
}
