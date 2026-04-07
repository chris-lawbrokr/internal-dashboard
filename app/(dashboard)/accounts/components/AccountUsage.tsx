"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useDateRange } from "@/lib/useDateRange";
import { SkeletonChecklist, SkeletonStatusCard, SkeletonValueCard, SkeletonTable } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge/Badge";
import { StatusIcon } from "@/components/ui/badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";

// ── Types ───────────────────────────────────────────────────────────

interface UsageSummary {
  active: boolean;
  funnel_live: boolean;
  lawbrokr_url_live: boolean;
  integrations_active: number;
  users_added: number;
  status: "active" | "inactive";
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
  funnels: {
    name: string;
    url: string;
    visits: number;
    conversions: number;
    conversion_rate: number;
    workflows: number;
    created_at: number;
    status: string;
  }[];
  workflows: {
    name: string;
    url: string;
    questions: number;
    visits: number;
    conversions: number;
    conversion_rate: number;
    completion_time: number;
    created_at: number;
    status: string;
  }[];
  landing_pages: {
    name: string;
    url: string;
    visits: number;
    conversions: number;
    conversion_rate: number;
    created_at: number;
    status: string;
  }[];
  ad_campaigns: {
    name: string;
    url: string;
    impressions: number;
    clicks: number;
    conversions: number;
    click_through_rate: number;
    spend: number;
    created_at: number;
    status: string;
  }[];
  clips: {
    name: string;
    clicks: number;
    conversions: number;
    conversion_rate: number;
    created_at: number;
    status: string;
  }[];
  automations: {
    name: string;
    type: string;
    sent: number;
    open_rate: number;
    created_at: number;
    status: string;
  }[];
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
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
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min. ${secs} sec.`;
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <Badge
      variant={isActive ? "success" : "error"}
      dot
      className="px-2 py-1 text-sm capitalize"
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}

function BoolIcon({ value }: { value: boolean }) {
  return (
    <StatusIcon variant={value ? "success" : "error"} />
  );
}

// ── Paginated table hook ────────────────────────────────────────────

function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return { page: currentPage, totalPages, paginated, setPage, total: items.length };
}

// ── Component ───────────────────────────────────────────────────────

interface AccountUsageProps {
  lawFirmId: string;
}

const PAGE_SIZE = 5;

export function AccountUsage({ lawFirmId }: AccountUsageProps) {
  const { user, getAccessToken } = useAuth();
  const { dateQuery } = useDateRange();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [users, setUsers] = useState<UsageUser[]>([]);
  const [details, setDetails] = useState<UsageDetails | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const qs = dateQuery ? `&${dateQuery}` : "";

    api<UsageSummary>(
      `admin/account/usage?law_firm_id=${lawFirmId}`,
      getAccessToken,
    )
      .then((data) => { if (!cancelled) setUsage(data); })
      .catch(() => {});

    api<{ data: UsageUser[] }>(
      `admin/account/usage/users?law_firm_id=${lawFirmId}`,
      getAccessToken,
    )
      .then((data) => { if (!cancelled) setUsers(data.data); })
      .catch(() => {});

    api<UsageDetails>(
      `admin/account/usage/details?law_firm_id=${lawFirmId}${qs}`,
      getAccessToken,
    )
      .then((data) => { if (!cancelled) setDetails(data); })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [user, getAccessToken, lawFirmId, dateQuery]);

  if (!usage)
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
          <SkeletonChecklist />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonStatusCard />
            <SkeletonValueCard />
            <SkeletonValueCard />
            <SkeletonValueCard />
            <SkeletonValueCard />
            <SkeletonValueCard />
          </div>
        </div>
        <SkeletonTable rows={5} />
        <SkeletonTable rows={5} />
        <SkeletonTable rows={5} />
      </div>
    );

  const checklist = [
    { label: "Account status is active", ok: usage.active },
    { label: "A funnel with a workflow is live", ok: usage.funnel_live },
    { label: "At least one Lawbrokr URL is live on website", ok: usage.lawbrokr_url_live },
    { label: "At least one integration is connected", ok: usage.integrations_active > 0 },
    { label: "At least one team member added", ok: usage.users_added > 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top section */}
      <TopSection usage={usage} checklist={checklist} />

      {/* Account Users */}
      <UsersTable users={users} />

      {/* Detail tables */}
      {details && <DetailTables details={details} />}
    </div>
  );
}

// ── Top Section ─────────────────────────────────────────────────────

function TopSection({
  usage,
  checklist,
}: {
  usage: UsageSummary;
  checklist: { label: string; ok: boolean }[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
      {/* Onboarding Checklist */}
      <Card className="p-5 flex flex-col gap-1">
        <h3 className="text-base font-semibold mb-2">Onboarding Checklist</h3>
        {checklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-2 border-b border-background last:border-b-0"
          >
            <span className="text-sm">{item.label}</span>
            <StatusIcon variant={item.ok ? "success" : "error"} />
          </div>
        ))}
      </Card>

      {/* Status cards grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Account Status</p>
          <Badge
            variant={usage.status === "active" ? "success" : "error"}
            dot
            className="px-2 py-1 text-sm w-fit capitalize"
          >
            {usage.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Subscription Type</p>
          <p className="text-2xl font-bold capitalize">{usage.contract_term}</p>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Account Created</p>
          <p className="text-2xl font-bold">{formatDate(usage.activation_date)}</p>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Next Payment Due</p>
          <p className="text-2xl font-bold">{formatDate(usage.next_payment_date)}</p>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Live Funnels</p>
          <p className="text-2xl font-bold">{usage.live_funnels}</p>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Live Workflows</p>
          <p className="text-2xl font-bold">{usage.live_workflows}</p>
        </Card>
      </div>
    </div>
  );
}

// ── Users Table ─────────────────────────────────────────────────────

function UsersTable({ users }: { users: UsageUser[] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(users, PAGE_SIZE);

  return (
    <Table
      title="Account Users"
      footer={
        total > PAGE_SIZE ? (
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        ) : undefined
      }
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>User Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead>Latest Interactions</TableHead>
          <TableHead className="text-center">Lead Notif.</TableHead>
          <TableHead className="text-center">Integration Notif.</TableHead>
          <TableHead className="text-center">Platform Notif.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((u, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{u.name}</TableCell>
            <TableCell className="capitalize">{u.role}</TableCell>
            <TableCell className="text-sm">{u.email}</TableCell>
            <TableCell className="text-sm">{formatPhone(u.phone)}</TableCell>
            <TableCell className="text-sm">{formatEpoch(u.last_visit)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {u.latest_interactions?.map((item) => (
                  <Badge key={item} variant="neutral" className="px-2 py-0.5 text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-center"><BoolIcon value={u.lead_notifications} /></TableCell>
            <TableCell className="text-center"><BoolIcon value={u.integration_notifications} /></TableCell>
            <TableCell className="text-center"><BoolIcon value={u.platform_notifications} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Detail Tables ───────────────────────────────────────────────────

function DetailTables({ details }: { details: UsageDetails }) {
  return (
    <>
      <FunnelsTable items={details.funnels} />
      <WorkflowsTable items={details.workflows} />
      <LandingPagesTable items={details.landing_pages} />
      <AdCampaignsTable items={details.ad_campaigns} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClipsTable items={details.clips} />
        <AutomationsTable items={details.automations} />
      </div>
    </>
  );
}

function FunnelsTable({ items }: { items: UsageDetails["funnels"] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(items, PAGE_SIZE);
  return (
    <Table
      title="Funnels"
      footer={total > PAGE_SIZE ? <TablePagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} /> : undefined}
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>Funnel Name</TableHead>
          <TableHead>Funnel URL</TableHead>
          <TableHead className="text-right">Visits</TableHead>
          <TableHead className="text-right">Responses</TableHead>
          <TableHead className="text-right">Conversion Rate</TableHead>
          <TableHead className="text-right">Workflows</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((f, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{f.name}</TableCell>
            <TableCell className="text-sm">{f.url}</TableCell>
            <TableCell className="text-right">{f.visits.toLocaleString()}</TableCell>
            <TableCell className="text-right">{f.conversions.toLocaleString()}</TableCell>
            <TableCell className="text-right">{Math.round(f.conversion_rate)}%</TableCell>
            <TableCell className="text-right">{f.workflows}</TableCell>
            <TableCell className="text-sm">{formatEpoch(f.created_at)}</TableCell>
            <TableCell className="text-right"><StatusBadge status={f.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WorkflowsTable({ items }: { items: UsageDetails["workflows"] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(items, PAGE_SIZE);
  return (
    <Table
      title="Workflows"
      footer={total > PAGE_SIZE ? <TablePagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} /> : undefined}
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>Workflow Name</TableHead>
          <TableHead>Workflow URL</TableHead>
          <TableHead className="text-right">Questions</TableHead>
          <TableHead className="text-right">Visits</TableHead>
          <TableHead className="text-right">Responses</TableHead>
          <TableHead className="text-right">Conversion Rate</TableHead>
          <TableHead>Completion Time</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((w, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{w.name}</TableCell>
            <TableCell className="text-sm">{w.url}</TableCell>
            <TableCell className="text-right">{w.questions}</TableCell>
            <TableCell className="text-right">{w.visits.toLocaleString()}</TableCell>
            <TableCell className="text-right">{w.conversions.toLocaleString()}</TableCell>
            <TableCell className="text-right">{Math.round(w.conversion_rate)}%</TableCell>
            <TableCell className="text-sm">{formatCompletionTime(w.completion_time)}</TableCell>
            <TableCell className="text-sm">{formatEpoch(w.created_at)}</TableCell>
            <TableCell className="text-right"><StatusBadge status={w.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LandingPagesTable({ items }: { items: UsageDetails["landing_pages"] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(items, PAGE_SIZE);
  return (
    <Table
      title="Landing Pages"
      footer={total > PAGE_SIZE ? <TablePagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} /> : undefined}
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>Landing Page Name</TableHead>
          <TableHead>Landing Page URL</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((lp, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{lp.name}</TableCell>
            <TableCell className="text-sm">{lp.url}</TableCell>
            <TableCell className="text-sm">{formatEpoch(lp.created_at)}</TableCell>
            <TableCell className="text-right"><StatusBadge status={lp.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdCampaignsTable({ items }: { items: UsageDetails["ad_campaigns"] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(items, PAGE_SIZE);
  return (
    <Table
      title="Ad Campaigns"
      footer={total > PAGE_SIZE ? <TablePagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} /> : undefined}
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>Campaign Name</TableHead>
          <TableHead>Campaign URL</TableHead>
          <TableHead className="text-right">Impressions</TableHead>
          <TableHead className="text-right">Conversions</TableHead>
          <TableHead className="text-right">CTR</TableHead>
          <TableHead className="text-right">Amount Spent</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((c, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell className="text-sm">{c.url}</TableCell>
            <TableCell className="text-right">{c.impressions.toLocaleString()}</TableCell>
            <TableCell className="text-right">{c.conversions.toLocaleString()}</TableCell>
            <TableCell className="text-right">{Math.round(c.click_through_rate)}%</TableCell>
            <TableCell className="text-right">${c.spend.toLocaleString()}</TableCell>
            <TableCell className="text-sm">{formatEpoch(c.created_at)}</TableCell>
            <TableCell className="text-right"><StatusBadge status={c.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ClipsTable({ items }: { items: UsageDetails["clips"] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(items, PAGE_SIZE);
  return (
    <Table
      title="Clips"
      footer={total > PAGE_SIZE ? <TablePagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} /> : undefined}
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>Clips Name</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="text-right">Responses</TableHead>
          <TableHead className="text-right">Conversion Rate</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((c, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell className="text-right">{c.clicks.toLocaleString()}</TableCell>
            <TableCell className="text-right">{c.conversions.toLocaleString()}</TableCell>
            <TableCell className="text-right">{Math.round(c.conversion_rate)}%</TableCell>
            <TableCell className="text-sm">{formatEpoch(c.created_at)}</TableCell>
            <TableCell className="text-right"><StatusBadge status={c.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AutomationsTable({ items }: { items: UsageDetails["automations"] }) {
  const { page, totalPages, paginated, setPage, total } = usePagination(items, PAGE_SIZE);
  return (
    <Table
      title="Automations"
      footer={total > PAGE_SIZE ? <TablePagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} /> : undefined}
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>Automation Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Sent</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((a, i) => (
          <TableRow key={i} className="border-b border-background">
            <TableCell className="font-medium">{a.name}</TableCell>
            <TableCell className="text-sm">{a.type}</TableCell>
            <TableCell className="text-right">{a.sent.toLocaleString()}</TableCell>
            <TableCell className="text-sm">{formatEpoch(a.created_at)}</TableCell>
            <TableCell className="text-right"><StatusBadge status={a.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
