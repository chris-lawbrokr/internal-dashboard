"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

// ── Shared pagination component ──────────────────────────────────────

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between text-sm pt-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        Rows per page
        <span className="border rounded px-1.5 py-0.5 text-xs">{pageSize}</span>
        <span>
          <strong>{start}-{end}</strong> of <strong>{total}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-md border border-[#3b2559] px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    Active: { bg: "#ededc7", text: "#626444", border: "#bcbc95" },
    Inactive: { bg: "#ffd9c5", text: "#b13c33", border: "#eaa289" },
    Review: { bg: "#fff2cf", text: "#946a22", border: "#daad75" },
  };
  const s = styles[status] || styles.Active;
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      {status}
    </span>
  );
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <div className={`size-5 rounded-full border flex items-center justify-center ${checked ? "bg-[#ededc7] border-[#bcbc95] text-[#626444]" : "border-[#c8c8c8]"}`}>
      {checked && <Check size={12} strokeWidth={2.5} />}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────

const accountUsers = Array.from({ length: 5 }, (_, i) => ({
  name: "Full Name Here",
  role: ["Owner", "Lawyer", "Marketer", "Admin", "Intake"][i],
  email: `user@lawfirmname.com`,
  phone: "+1 (555) 123-4567",
  lastVisit: "Feb. 3, 2026 9:27 AM",
  latestInteractions: "Home",
  lastMonthly: i % 2 === 0,
  integrationPct: i % 2 === 0,
  platformPct: i % 2 === 0,
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
  const paginated = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-[#070043]">{title}</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c8c8c8]">
                {headers.map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr key={i} className="border-b border-[#f2f2f2] last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2.5 px-2 whitespace-nowrap">
                      {headers[j] === "Status" ? <StatusBadge status={cell} /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={rows.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}

// ── Usage Tab ────────────────────────────────────────────────────────

export function UsageTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Onboarding Checklist + Account Info */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <Card className="flex-1 p-6">
          <CardContent className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#070043]">Onboarding Checklist</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CheckIcon checked={true} />
                <span className="text-sm">Account status is active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon checked={true} />
                <span className="text-sm">A funnel with a workflow is live</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon checked={true} />
                <span className="text-sm">At least one Lawbrokr URL is live on website</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon checked={true} />
                <span className="text-sm">At least one integration is connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon checked={true} />
                <span className="text-sm">At least one team member added</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 p-6">
          <CardContent className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <p className="text-sm text-[#777]">Account Status</p>
              <StatusBadge status="Active" />
            </div>
            <div>
              <p className="text-sm text-[#777]">Subscription Type</p>
              <p className="text-2xl font-bold text-[#070043]">Annual</p>
            </div>
            <div>
              <p className="text-sm text-[#777]">Account Created</p>
              <p className="text-lg font-bold text-[#070043]">Feb. 1, 2026</p>
            </div>
            <div>
              <p className="text-sm text-[#777]">Next Payment Date</p>
              <p className="text-lg font-bold text-[#070043]">Feb. 1, 2027</p>
            </div>
            <div>
              <p className="text-sm text-[#777]">Total Forms</p>
              <p className="text-2xl font-bold text-[#070043]">12</p>
            </div>
            <div>
              <p className="text-sm text-[#777]">Live Links</p>
              <p className="text-2xl font-bold text-[#070043]">29</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Users */}
      <TableSection
        title="Account Users"
        headers={["User Names", "Role", "Email", "Phone", "Last Visit", "Latest Interactions", "Last Monthly", "Integration %", "Platform %"]}
        rows={accountUsers.map((u) => [
          u.name, u.role, u.email, u.phone, u.lastVisit, u.latestInteractions,
          u.lastMonthly ? "✓" : "–", u.integrationPct ? "✓" : "–", u.platformPct ? "✓" : "–",
        ])}
      />

      {/* Funnels */}
      <TableSection
        title="Funnels"
        headers={["Funnel Name", "Funnel URL", "Visits", "Responses", "Conversion Rate", "Workflows", "Created At", "Status"]}
        rows={funnels.map((f) => [
          f.name, f.url, String(f.visits), String(f.responses), f.conversionRate, String(f.workflows), f.createdAt, f.status,
        ])}
      />

      {/* Workflows */}
      <TableSection
        title="Workflows"
        headers={["Workflow Name", "Workflow URL", "Questions", "Visits", "Responses", "Conversion Rate", "Completion Time", "Created At", "Status"]}
        rows={workflows.map((w) => [
          w.name, w.url, String(w.questions), String(w.visits), String(w.responses), w.conversionRate, w.completionTime, w.createdAt, w.status,
        ])}
      />

      {/* Landing Pages */}
      <TableSection
        title="Landing Pages"
        headers={["Landing Page Name", "Landing Page URL", "Created At", "Status"]}
        rows={landingPages.map((l) => [l.name, l.url, l.createdAt, l.status])}
      />

      {/* Ad Campaigns */}
      <TableSection
        title="Ad Campaigns"
        headers={["Campaign Name", "Campaign URL", "Impressions", "Conversions", "CTR", "Amount Spent", "Created At", "Status"]}
        rows={adCampaigns.map((a) => [
          a.name, a.url, String(a.impressions), String(a.conversions), a.ctr, a.amountSpent, a.createdAt, a.status,
        ])}
      />

      {/* Clips + Automations side by side */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <div className="flex-1 min-w-0">
          <TableSection
            title="Clips"
            headers={["Clips Name", "Clicks", "Responses", "Conversion", "Created At", "Status"]}
            rows={clips.map((c) => [
              c.name, String(c.clicks), String(c.responses), c.conversion, c.createdAt, c.status,
            ])}
          />
        </div>
        <div className="flex-1 min-w-0">
          <TableSection
            title="Automations"
            headers={["Automation Name", "Type", "Sent", "Created At", "Status"]}
            rows={automations.map((a) => [a.name, a.type, String(a.sent), a.createdAt, a.status])}
          />
        </div>
      </div>
    </div>
  );
}
