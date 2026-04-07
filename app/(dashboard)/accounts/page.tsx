"use client";

import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { AccountsTable } from "@/app/components/AccountsTable";

export default function AccountsPage() {
  return (
    <div className="w-full h-full flex flex-col flex-1">
      <div className="sticky top-0 z-10 bg-surface pt-16 min-[480px]:pt-4 @md:pt-6 pb-4">
        <PageHeader title="Accounts" />
      </div>
      <div className="overflow-clip flex-1 flex flex-col justify-center">
        <AccountsTable />
      </div>
    </div>
  );
}
