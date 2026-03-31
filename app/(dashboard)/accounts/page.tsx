"use client";

import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default function AccountsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title="Accounts" />
      <p className="text-muted-foreground text-sm">Accounts table goes here</p>
    </div>
  );
}
