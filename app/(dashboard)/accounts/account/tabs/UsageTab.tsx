"use client";

import { useState } from "react";
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

// ── Data ─────────────────────────────────────────────────────────────

const accountUsers = Array.from({ length: 100 }, (_, i) => ({
  name: "Full Name Here",
  role: ["Owner", "Lawyer", "Marketer", "Admin", "Intake"][i % 5],
  email: "user@lawfirmname.com",
  phone: "+1 (555) 123-4567",
  lastVisit: "Feb. 3, 2026 9:27 AM",
  latestInteractions: "Home",
  leadNotifications: i % 5 < 2 || i % 5 === 4,
  integrationNotifications: i % 5 < 2 || i % 5 === 4,
  platformNotifications: i % 5 < 2 || i % 5 === 4,
}));

const funnels = Array.from({ length: 6 }, () => ({
  name: "Funnel Name",
  url: "www.lawfirm.lawbrokr.com/practiceareas",
  visits: 1000,
  responses: 100,
  conversionRate: "10%",
  workflows: 5,
  createdAt: "Feb. 3, 2026 9:27 AM",
  status: "Active",
}));

const workflows = Array.from({ length: 5 }, () => ({
  name: "Workflow Name",
  url: "www.lawfirm.lawbrokr.com/...",
  questions: 8,
  visits: 100,
  responses: 10,
  conversionRate: "10%",
  completionTime: "5 min. 30 sec.",
  createdAt: "Feb. 3, 2026 9:27 AM",
  status: "Active",
}));

const landingPages = Array.from({ length: 6 }, () => ({
  name: "Funnel Name",
  url: "www.lawfirm.facebook.com/landingpage",
  createdAt: "Feb. 3, 2026 9:27 AM",
  status: "Active",
}));

const adCampaigns = Array.from({ length: 5 }, () => ({
  name: "Workflow Name",
  url: "www.lawfirm.lawbrokr.com/practiceareas",
  impressions: 100,
  conversions: 10,
  ctr: "10%",
  amountSpent: "$1,800",
  createdAt: "Feb. 3, 2026 9:27 AM",
  status: "Active",
}));

const clips = Array.from({ length: 5 }, () => ({
  name: "Clips Name",
  clicks: 100,
  responses: 10,
  conversion: "10%",
  createdAt: "Feb. 3, 2026 9:27 AM",
  status: "Active",
}));

const automations = Array.from({ length: 5 }, () => ({
  name: "Automation Name",
  type: "Abandon Cart",
  sent: 1000,
  createdAt: "Feb. 3, 2026 9:27 AM",
  status: "Active",
}));

// ── Reusable table section ───────────────────────────────────────────

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

// ── Account Users Table ──────────────────────────────────────────────

function AccountUsersTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(accountUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = accountUsers.slice(
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
          totalItems={accountUsers.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      }
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead className="py-2 px-2 whitespace-nowrap">
            User Name
          </TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Role</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Email</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">Phone</TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">
            Last Visit
          </TableHead>
          <TableHead className="py-2 px-2 whitespace-nowrap">
            Latest Interactions
          </TableHead>
          <TableHead className="text-center py-2 px-2 whitespace-nowrap">
            Lead Notifications
          </TableHead>
          <TableHead className="text-center py-2 px-2 whitespace-nowrap">
            Integration Notifications
          </TableHead>
          <TableHead className="text-center py-2 px-2 whitespace-nowrap">
            Platform Notifications
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((user, i) => (
          <TableRow key={i} className="border-b border-background last:border-0">
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.name}
            </TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.role}
            </TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.email}
            </TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.phone}
            </TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              {user.lastVisit}
            </TableCell>
            <TableCell className="py-3 px-2 whitespace-nowrap">
              <Badge variant="neutral">{user.latestInteractions}</Badge>
            </TableCell>
            <TableCell className="py-3 px-2">
              <div className="flex justify-center">
                <StatusIcon variant={user.leadNotifications ? "success" : "error"} />
              </div>
            </TableCell>
            <TableCell className="py-3 px-2">
              <div className="flex justify-center">
                <StatusIcon variant={user.integrationNotifications ? "success" : "error"} />
              </div>
            </TableCell>
            <TableCell className="py-3 px-2">
              <div className="flex justify-center">
                <StatusIcon variant={user.platformNotifications ? "success" : "error"} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Usage Tab ────────────────────────────────────────────────────────

interface UsageTabProps {
  lawFirmId?: string | null;
}

export function UsageTab({ lawFirmId }: UsageTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Onboarding Checklist + Account Info */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        {/* Onboarding Checklist */}
        <Card className="flex-1 p-6">
          <CardContent className="flex flex-col gap-0">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Onboarding Checklist
            </h3>
            {[
              { label: "Account status is active", checked: true },
              { label: "A funnel with a workflow is live", checked: false },
              {
                label: "At least one Lawbrokr URL is live on website",
                checked: true,
              },
              {
                label: "At least one integration is connected",
                checked: false,
              },
              { label: "At least one team member added", checked: true },
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

        {/* Account Info – right side cards */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Row 1: Account Status + Subscription Type */}
          <div className="flex-1 flex flex-col @lg:flex-row gap-4">
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <Badge variant="success" dot className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold">Active</Badge>
              </CardContent>
            </Card>
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Subscription Type</p>
                <p className="text-2xl font-bold text-foreground">Annual</p>
              </CardContent>
            </Card>
          </div>
          {/* Row 2: Account Created + Next Payment Due */}
          <div className="flex-1 flex flex-col @lg:flex-row gap-4">
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="text-xl font-bold text-foreground">Feb. 1, 2026</p>
              </CardContent>
            </Card>
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Next Payment Due</p>
                <p className="text-xl font-bold text-foreground">Feb. 1, 2027</p>
              </CardContent>
            </Card>
          </div>
          {/* Row 3: Live Funnels + Live Workflows */}
          <div className="flex-1 flex flex-col @lg:flex-row gap-4">
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Live Funnels</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </CardContent>
            </Card>
            <Card className="flex-1 p-5">
              <CardContent className="flex flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Live Workflows</p>
                <p className="text-2xl font-bold text-foreground">29</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Account Users */}
      <AccountUsersTable />

      {/* Funnels */}
      <TableSection
        title="Funnels"
        headers={[
          "Funnel Name",
          "Funnel URL",
          "Visits",
          "Responses",
          "Conversion Rate",
          "Workflows",
          "Created At",
          "Status",
        ]}
        rows={funnels.map((f) => [
          f.name,
          f.url,
          String(f.visits),
          String(f.responses),
          f.conversionRate,
          String(f.workflows),
          f.createdAt,
          f.status,
        ])}
      />

      {/* Workflows */}
      <TableSection
        title="Workflows"
        headers={[
          "Workflow Name",
          "Workflow URL",
          "Questions",
          "Visits",
          "Responses",
          "Conversion Rate",
          "Completion Time",
          "Created At",
          "Status",
        ]}
        rows={workflows.map((w) => [
          w.name,
          w.url,
          String(w.questions),
          String(w.visits),
          String(w.responses),
          w.conversionRate,
          w.completionTime,
          w.createdAt,
          w.status,
        ])}
      />

      {/* Landing Pages */}
      <TableSection
        title="Landing Pages"
        headers={[
          "Landing Page Name",
          "Landing Page URL",
          "Created At",
          "Status",
        ]}
        rows={landingPages.map((l) => [l.name, l.url, l.createdAt, l.status])}
      />

      {/* Ad Campaigns */}
      <TableSection
        title="Ad Campaigns"
        headers={[
          "Campaign Name",
          "Campaign URL",
          "Impressions",
          "Conversions",
          "CTR",
          "Amount Spent",
          "Created At",
          "Status",
        ]}
        rows={adCampaigns.map((a) => [
          a.name,
          a.url,
          String(a.impressions),
          String(a.conversions),
          a.ctr,
          a.amountSpent,
          a.createdAt,
          a.status,
        ])}
      />

      {/* Clips + Automations side by side */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <div className="flex-1 min-w-0">
          <TableSection
            title="Clips"
            headers={[
              "Clips Name",
              "Clicks",
              "Responses",
              "Conversion",
              "Created At",
              "Status",
            ]}
            rows={clips.map((c) => [
              c.name,
              String(c.clicks),
              String(c.responses),
              c.conversion,
              c.createdAt,
              c.status,
            ])}
          />
        </div>
        <div className="flex-1 min-w-0">
          <TableSection
            title="Automations"
            headers={[
              "Automation Name",
              "Type",
              "Sent",
              "Created At",
              "Status",
            ]}
            rows={automations.map((a) => [
              a.name,
              a.type,
              String(a.sent),
              a.createdAt,
              a.status,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
