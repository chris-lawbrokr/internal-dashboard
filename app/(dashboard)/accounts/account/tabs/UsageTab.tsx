"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import { Badge, StatusIcon } from "@/components/ui/badge/Badge";
import { Spinner } from "@/components/ui/Spinner";

// ── Types ──────────────────────────────────────────────────────────

interface UsageData {
  active: boolean;
  funnel_live: boolean;
  lawbrokr_url_live: boolean;
  integrations_active: number;
  users_added: number;
  status: string;
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  live_funnels: number;
  live_workflows: number;
}

interface UsageUser {
  name: string;
  role: string;
  email: string;
  phone: string;
  last_visit: number;
  latest_interactions: string[] | null;
  lead_notifications: boolean;
  integration_notifications: boolean;
  platform_notifications: boolean;
}

interface UsageDetails {
  funnels: Array<{
    name: string;
    url: string;
    visits: number;
    conversions: number;
    conversion_rate: number;
    workflows: number;
    created_at: number;
    status: string;
  }>;
  workflows: Array<{
    name: string;
    url: string;
    questions: number;
    visits: number;
    conversions: number;
    conversion_rate: number;
    completion_time: number;
    created_at: number;
    status: string;
  }>;
  landing_pages: Array<{
    name: string;
    url: string;
    visits: number;
    conversions: number;
    conversion_rate: number;
    created_at: number;
    status: string;
  }>;
  ad_campaigns: Array<{
    name: string;
    url: string;
    impressions: number;
    clicks: number;
    conversions: number;
    click_through_rate: number;
    spend: number;
    created_at: number;
    status: string;
  }>;
  clips: Array<{
    name: string;
    clicks: number;
    conversions: number;
    conversion_rate: number;
    created_at: number;
    status: string;
  }>;
  automations: Array<{
    name: string;
    type: string;
    sent: number;
    open_rate: number;
    created_at: number;
    status: string;
  }>;
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function formatEpoch(epoch: number): string {
  const d = new Date(epoch * 1000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCompletionTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min} min. ${sec} sec.`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Reusable table section ──────────────────────────────────────────

function TableSection({
  title,
  headers,
  rows,
  pageSize = 10,
}: {
  title: string;
  headers: string[];
  rows: string[][];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <Table
      toolbar={<h3 className="text-lg font-bold text-foreground">{title}</h3>}
      footer={
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={rows.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      }
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          {headers.map((h) => (
            <TableHead key={h} className="py-2 px-2 whitespace-nowrap">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((row, i) => (
          <TableRow key={i} className="border-b border-background last:border-0">
            {row.map((cell, j) => (
              <TableCell key={j} className="py-2.5 px-2 whitespace-nowrap">
                {headers[j] === "Status" ? (
                  <Badge variant={cell === "Active" ? "success" : cell === "Inactive" ? "error" : "warning"}>
                    {cell}
                  </Badge>
                ) : cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Account Users Table ─────────────────────────────────────────────

function AccountUsersTable({ users }: { users: UsageUser[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <Table
      toolbar={
        <h3 className="text-lg font-bold text-foreground">Account Users</h3>
      }
      footer={
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={users.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      }
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead className="py-2 px-2 whitespace-nowrap">User Name</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Role</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Email</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Phone</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Last Visit</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Latest Interactions</TableHead>
          <TableHead className="text-center py-2 px-2 whitespace-nowrap">Lead Notifications</TableHead>
          <TableHead className="text-center py-2 px-2 whitespace-nowrap">Integration Notifications</TableHead>
          <TableHead className="text-center py-2 px-2 whitespace-nowrap">Platform Notifications</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((user, i) => (
          <TableRow key={i} className="border-b border-background last:border-0">
            <TableCell className="py-3 px-2 whitespace-nowrap">{user.name}</TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">{user.role}</TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">{user.email}</TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">{formatPhone(user.phone)}</TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.last_visit ? formatEpoch(user.last_visit) : "—"}
            </TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.latest_interactions && user.latest_interactions.length > 0 ? (
                <div className="flex gap-1">
                  {user.latest_interactions.map((int, j) => (
                    <Badge key={j} variant="neutral">{int}</Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="py-3 px-2">
              <div className="flex justify-center">
                <StatusIcon variant={user.lead_notifications ? "success" : "error"} />
              </div>
            </TableCell>
            <TableCell className="py-3 px-2">
              <div className="flex justify-center">
                <StatusIcon variant={user.integration_notifications ? "success" : "error"} />
              </div>
            </TableCell>
            <TableCell className="py-3 px-2">
              <div className="flex justify-center">
                <StatusIcon variant={user.platform_notifications ? "success" : "error"} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Usage Tab ───────────────────────────────────────────────────────

interface UsageTabProps {
  lawFirmId?: string | null;
  startDate?: Date;
  endDate?: Date;
}

export function UsageTab({ lawFirmId, startDate, endDate }: UsageTabProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [users, setUsers] = useState<UsageUser[]>([]);
  const [details, setDetails] = useState<UsageDetails | null>(null);

  useEffect(() => {
    if (!lawFirmId) return;

    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const dateQs = startDate && endDate
      ? `&start_date=${fmt(startDate)}&end_date=${fmt(endDate)}`
      : "";

    fetch(`/api/account/usage?law_firm_id=${lawFirmId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setUsage)
      .catch((e) => console.error("Failed to fetch usage:", e));

    fetch(`/api/account/usage/users?law_firm_id=${lawFirmId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setUsers(data.data ?? []))
      .catch((e) => console.error("Failed to fetch usage users:", e));

    fetch(`/api/account/usage/details?law_firm_id=${lawFirmId}${dateQs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setDetails)
      .catch((e) => console.error("Failed to fetch usage details:", e));
  }, [lawFirmId, startDate, endDate]);

  if (usage === null) return <Spinner />;

  const statusLabel = usage?.status === "active" ? "Active" : "Inactive";
  const contractLabel = usage?.contract_term === "annual" ? "Annual" : "Monthly";

  return (
    <div className="flex flex-col gap-6">
      {/* Onboarding Checklist + Account Info */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <Card className="flex-1 p-6">
          <CardContent className="flex flex-col gap-0">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Onboarding Checklist
            </h3>
            {[
              { label: "Account status is active", checked: usage?.active ?? false },
              { label: "A funnel with a workflow is live", checked: usage?.funnel_live ?? false },
              { label: "At least one Lawbrokr URL is live on website", checked: usage?.lawbrokr_url_live ?? false },
              { label: "At least one integration is connected", checked: (usage?.integrations_active ?? 0) > 0 },
              { label: "At least one team member added", checked: (usage?.users_added ?? 0) > 0 },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-3 border-t border-border-light"
              >
                <span className="text-sm">{item.label}</span>
                <StatusIcon variant={item.checked ? "success" : "error"} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col @lg:flex-row gap-4">
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <Badge
                  variant={usage?.status === "active" ? "success" : "error"}
                  dot
                  className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold"
                >
                  {statusLabel}
                </Badge>
              </CardContent>
            </Card>
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Subscription Type</p>
                <p className="text-2xl font-bold text-foreground">{contractLabel}</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1 flex flex-col @lg:flex-row gap-4">
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="text-xl font-bold text-foreground">
                  {usage?.activation_date ? formatDate(usage.activation_date) : "—"}
                </p>
              </CardContent>
            </Card>
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Next Payment Due</p>
                <p className="text-xl font-bold text-foreground">
                  {usage?.next_payment_date ? formatDate(usage.next_payment_date) : "—"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1 flex flex-col @lg:flex-row gap-4">
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Live Funnels</p>
                <p className="text-2xl font-bold text-foreground">{usage?.live_funnels ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Live Workflows</p>
                <p className="text-2xl font-bold text-foreground">{usage?.live_workflows ?? 0}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Account Users */}
      <AccountUsersTable users={users} />

      {/* Funnels */}
      <TableSection
        title="Funnels"
        headers={["Funnel Name", "Funnel URL", "Visits", "Responses", "Conversion Rate", "Workflows", "Created At", "Status"]}
        rows={(details?.funnels ?? []).map((f) => [
          f.name,
          f.url,
          f.visits.toLocaleString(),
          f.conversions.toLocaleString(),
          `${Math.round(f.conversion_rate)}%`,
          String(f.workflows),
          formatEpoch(f.created_at),
          f.status === "active" ? "Active" : "Inactive",
        ])}
      />

      {/* Workflows */}
      <TableSection
        title="Workflows"
        headers={["Workflow Name", "Workflow URL", "Questions", "Visits", "Responses", "Conversion Rate", "Completion Time", "Created At", "Status"]}
        rows={(details?.workflows ?? []).map((w) => [
          w.name,
          w.url,
          String(w.questions),
          w.visits.toLocaleString(),
          w.conversions.toLocaleString(),
          `${Math.round(w.conversion_rate)}%`,
          formatCompletionTime(w.completion_time),
          formatEpoch(w.created_at),
          w.status === "active" ? "Active" : "Inactive",
        ])}
      />

      {/* Landing Pages */}
      <TableSection
        title="Landing Pages"
        headers={["Landing Page Name", "Landing Page URL", "Visits", "Responses", "Conversion Rate", "Created At", "Status"]}
        rows={(details?.landing_pages ?? []).map((l) => [
          l.name,
          l.url,
          l.visits.toLocaleString(),
          l.conversions.toLocaleString(),
          `${Math.round(l.conversion_rate)}%`,
          formatEpoch(l.created_at),
          l.status === "active" ? "Active" : "Inactive",
        ])}
      />

      {/* Ad Campaigns */}
      <TableSection
        title="Ad Campaigns"
        headers={["Campaign Name", "Campaign URL", "Impressions", "Clicks", "Conversions", "CTR", "Amount Spent", "Created At", "Status"]}
        rows={(details?.ad_campaigns ?? []).map((a) => [
          a.name,
          a.url,
          a.impressions.toLocaleString(),
          a.clicks.toLocaleString(),
          a.conversions.toLocaleString(),
          `${Math.round(a.click_through_rate)}%`,
          formatCurrency(a.spend),
          formatEpoch(a.created_at),
          a.status === "active" ? "Active" : "Inactive",
        ])}
      />

      {/* Clips + Automations side by side */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <div className="flex-1 min-w-0">
          <TableSection
            title="Clips"
            headers={["Clips Name", "Clicks", "Responses", "Conversion", "Created At", "Status"]}
            rows={(details?.clips ?? []).map((c) => [
              c.name,
              c.clicks.toLocaleString(),
              c.conversions.toLocaleString(),
              `${Math.round(c.conversion_rate)}%`,
              formatEpoch(c.created_at),
              c.status === "active" ? "Active" : "Inactive",
            ])}
          />
        </div>
        <div className="flex-1 min-w-0">
          <TableSection
            title="Automations"
            headers={["Automation Name", "Type", "Sent", "Open Rate", "Created At", "Status"]}
            rows={(details?.automations ?? []).map((a) => [
              a.name,
              a.type,
              a.sent.toLocaleString(),
              `${Math.round(a.open_rate)}%`,
              formatEpoch(a.created_at),
              a.status === "active" ? "Active" : "Inactive",
            ])}
          />
        </div>
      </div>
    </div>
  );
}
