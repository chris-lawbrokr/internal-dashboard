"use client";

import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { AccountsTable } from "@/app/components/AccountsTable";

export default function AccountsPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface">
        <PageHeader title="Accounts" />
      </div>
      <div className="m-4 mt-0 overflow-y-scroll">
        <AccountsTable defaultPageSize={20} />
      </div>
    </div>
  );
}
