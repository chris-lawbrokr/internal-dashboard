"use client";

import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { AccountsTable } from "@/app/components/AccountsTable";

export default function AccountsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title="Accounts" />
      <AccountsTable />
    </div>
  );
}
