"use client";

import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default function AnalyticsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title="Analytics" />
      <p className="text-muted-foreground text-sm">Analytics content goes here</p>
    </div>
  );
}
