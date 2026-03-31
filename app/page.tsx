"use client";

import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default function Home() {
  const { user } = useAuth();
  const firstname = user?.first_name ?? "";
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={`Welcome back, ${firstname}`} back="/accounts" />
      <div>card 1</div>
    </div>
  );
}
