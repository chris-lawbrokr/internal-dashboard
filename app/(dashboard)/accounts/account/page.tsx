"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { DateRangePickerWithPresets } from "@/components/ui/datepicker";
import { DATE_RANGE_MIN, dateRangeMax } from "@/lib/dates";
import { OverviewTab } from "./tabs/OverviewTab";
import { PerformanceTab } from "./tabs/PerformanceTab";
import { WebsiteTab } from "./tabs/WebsiteTab";
import { UsageTab } from "./tabs/UsageTab";

export interface AccountDetail {
  name: string;
  username: string;
  website: string;
  employees: number | null;
  location: string | null;
  marketing_agency: string | null;
  marketing_spend: number | null;
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  status: string;
  onboarding_health: string;
  performance_health: string;
  website_health: string;
  practice_areas: string[] | null;
  integrations: string[] | null;
  tech_stack: string[] | null;
  features: string[] | null;
}

export interface AccountUser {
  name: string;
  role: string;
  email: string;
  created_date: string;
}

const tabKeys = ["overview", "performance", "website", "usage"] as const;

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [users, setUsers] = useState<AccountUser[]>([]);
  const t = useTranslations("account");
  const searchParams = useSearchParams();
  const lawFirmId = searchParams.get("law_firm_id");

  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 90);

  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);

  useEffect(() => {
    if (!lawFirmId) return;

    fetch(`/api/account?law_firm_id=${lawFirmId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setAccount)
      .catch((err) => console.error("Failed to fetch account:", err));

    fetch(`/api/account/users?law_firm_id=${lawFirmId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setUsers(data.data ?? []))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, [lawFirmId]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-4">
        <Link
          href="/accounts"
          className="self-start flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>
        <div className="flex flex-col @xl:flex-row @xl:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {account?.name ?? ""}
          </h1>
          <div className="w-full @xl:w-auto [&>div]:w-full @xl:[&>div]:w-auto [&>div>button:first-child]:w-full @xl:[&>div>button:first-child]:w-auto">
            <DateRangePickerWithPresets
              defaultPreset="90d"
              minDate={DATE_RANGE_MIN}
              maxDate={dateRangeMax()}
              onChange={(start, end) => {
                if (start && end) {
                  setStartDate(start);
                  setEndDate(end);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs – dropdown on mobile, inline tabs on desktop */}
      <div className="relative @xl:hidden pb-4">
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
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-3.5 w-3.5" />
      </div>
      <div className="hidden @xl:flex gap-6 border-b border-border mb-4">
        {tabKeys.map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => setActiveTab(tabKey)}
            className={`pb-2 text-base font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === tabKey
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(tabKey)}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto min-h-0 flex-1 flex flex-col gap-4 pb-2">
        {activeTab === "overview" && (
          <OverviewTab account={account} users={users} />
        )}
        {activeTab === "performance" && (
          <PerformanceTab
            lawFirmId={lawFirmId}
            startDate={startDate}
            endDate={endDate}
          />
        )}
        {activeTab === "website" && <WebsiteTab lawFirmId={lawFirmId} />}
        {activeTab === "usage" && (
          <UsageTab
            lawFirmId={lawFirmId}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </div>
  );
}
