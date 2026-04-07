"use client";

import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default function AnalyticsPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface pt-16 min-[480px]:pt-4 @md:pt-6 pb-4">
        <PageHeader title="Analytics" />
      </div>
      <div className="overflow-clip flex-1 flex flex-col">
        <p className="text-muted-foreground text-sm">
          Analytics content goes here
        </p>
      </div>
    </div>
  );
}
