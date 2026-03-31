"use client";

import { use } from "react";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { Tabs, useTabSearchParam } from "@/components/ui/tabs/Tabs";
import type { Tab } from "@/components/ui/tabs/Tabs";

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
  const [activeTab, setActiveTab] = useTabSearchParam(accountTabs);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={`Account ${id}`} back="/accounts" />
      <Tabs tabs={accountTabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div>
        {activeTab === "overview" && <p>Overview content</p>}
        {activeTab === "performance" && <p>Performance content</p>}
        {activeTab === "website" && <p>Website content</p>}
        {activeTab === "usage" && <p>Usage content</p>}
      </div>
    </div>
  );
}
