"use client";

import { use } from "react";
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
    <div className="w-full h-full">
      <h1 className="text-xl font-semibold mb-4">Account {id}</h1>
      <Tabs tabs={accountTabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-4">
        {activeTab === "overview" && <p>Overview content</p>}
        {activeTab === "performance" && <p>Performance content</p>}
        {activeTab === "website" && <p>Website content</p>}
        {activeTab === "usage" && <p>Usage content</p>}
      </div>
    </div>
  );
}
