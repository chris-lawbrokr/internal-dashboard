"use client";

import { use, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { ErrorState } from "@/components/ui/error-state/ErrorState";
import { Tabs, useTabSearchParam } from "@/components/ui/tabs/Tabs";
import type { Tab } from "@/components/ui/tabs/Tabs";
import { AccountOverview } from "../components/AccountOverview";
import { AccountPerformance } from "../components/AccountPerformance";
import { AccountWebsite } from "../components/AccountWebsite";
import { AccountUsage } from "../components/AccountUsage";

const accountTabs: Tab[] = [
  { id: "overview", label: "Overview" },
  { id: "performance", label: "Performance" },
  { id: "website", label: "Website" },
  { id: "usage", label: "Usage" },
];

export default function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, getAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useTabSearchParam(accountTabs);
  const [firmName, setFirmName] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setErrorStatus(null);
    api<{ name: string }>(`admin/account?law_firm_id=${id}`, getAccessToken)
      .then((data) => {
        if (!cancelled) setFirmName(data.name);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setErrorStatus(err instanceof ApiError ? err.status : 0);
      });
    return () => {
      cancelled = true;
    };
  }, [user, getAccessToken, id]);

  if (errorStatus !== null) {
    return (
      <div className="w-full h-full flex flex-col">
        <ErrorState status={errorStatus} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface">
        <PageHeader title={firmName ?? ""} back="/accounts" />
        <div>
          <Tabs
            tabs={accountTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
      <div className="m-4 overflow-y-scroll h-full pb-1">
        {activeTab === "overview" && (
          <AccountOverview lawFirmId={id} onTabChange={setActiveTab} />
        )}
        {activeTab === "performance" && <AccountPerformance lawFirmId={id} />}
        {activeTab === "website" && <AccountWebsite lawFirmId={id} />}
        {activeTab === "usage" && <AccountUsage lawFirmId={id} />}
      </div>
    </div>
  );
}
