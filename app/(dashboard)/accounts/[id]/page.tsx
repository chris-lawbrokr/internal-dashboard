"use client";

import { use, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { Tabs, useTabSearchParam } from "@/components/ui/tabs/Tabs";
import type { Tab } from "@/components/ui/tabs/Tabs";
import { AccountOverview } from "../components/AccountOverview";

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

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api<{ name: string }>(`admin/account?law_firm_id=${id}`, getAccessToken)
      .then((data) => {
        if (!cancelled) setFirmName(data.name);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user, getAccessToken, id]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={firmName ?? ""} back="/accounts" />
      <Tabs tabs={accountTabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div>
        {activeTab === "overview" && <AccountOverview lawFirmId={id} onTabChange={setActiveTab} />}
        {activeTab === "performance" && <p>Performance content</p>}
        {activeTab === "website" && <p>Website content</p>}
        {activeTab === "usage" && <p>Usage content</p>}
      </div>
    </div>
  );
}
