"use client";

import { useAuth } from "@/lib/auth";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

export default function Home() {
  const { user } = useAuth();
  const firstname = user?.first_name ?? "";

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <PageHeader title={`Welcome back, ${firstname}`} back="/accounts" />
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <Card>card 1</Card>
          <Card>card 1</Card>
        </div>
        <Card className="flex-1">card 1</Card>
        <Card className="flex-1">card 1</Card>
      </div>
    </div>
  );
}
