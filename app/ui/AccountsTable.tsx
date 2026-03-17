"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  X,
  Check,
  ChevronDown,
  AlertCircle,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type StatusIcon = "check" | "warning" | "error";

interface Account {
  id: number;
  name: string;
  website: string;
  totalVisits: number;
  totalResponses: number;
  conversionRate: number;
  status: "Active" | "Inactive";
  onboarding: StatusIcon;
  performance: StatusIcon;
  websiteHealth: StatusIcon;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const statusIcons: StatusIcon[] = ["check", "warning", "error"];

const fakeAccounts: Account[] = Array.from({ length: 100 }, (_, i) => {
  const r = seededRandom(i + 1);
  const iconIdx = Math.floor(seededRandom(i + 200) * 3);
  return {
    id: i + 1,
    name: "Law Firm Name",
    website: "www.lawfirmwebsite.com",
    totalVisits: 10000,
    totalResponses: 10000,
    conversionRate: 10000,
    status: r > 0.3 ? "Active" : "Inactive",
    onboarding: statusIcons[iconIdx],
    performance: statusIcons[iconIdx],
    websiteHealth: statusIcons[iconIdx],
  };
});

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium border ${
        status === "Active"
          ? "bg-[#ededc7] text-[#626444] border-[#bcbc95]"
          : "bg-[#ffd9c5] text-[#b13c33] border-[#eaa289]"
      }`}
    >
      {status}
    </span>
  );
}

function StatusIconCell({ icon }: { icon: StatusIcon }) {
  const styles = {
    check: "bg-[#ededc7] border-[#bcbc95] text-[#626444]",
    warning: "bg-[#fff2cf] border-[#daad75] text-[#A56737]",
    error: "bg-[#ffd9c5] border-[#eaa289] text-[#b13c33]",
  };

  const icons = {
    check: <Check size={14} strokeWidth={2.5} />,
    warning: <AlertCircle size={14} strokeWidth={2} />,
    error: <X size={14} strokeWidth={2.5} />,
  };

  return (
    <div
      className={`inline-flex items-center justify-center size-6 rounded-full border ${styles[icon]}`}
    >
      {icons[icon]}
    </div>
  );
}

type SortField = "totalVisits" | "totalResponses" | "conversionRate";
type SortDir = "asc" | "desc";

export function AccountsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");

  const filtered = fakeAccounts.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) || a.website.toLowerCase().includes(q)
    );
  });

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortDir === "asc" ? diff : -diff;
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, sorted.length);

  return (
    <div className="rounded-xl bg-card text-card-foreground shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.05)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-[#c8c8c8]">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            aria-label={t("searchAccounts")}
            placeholder={t("searchAccounts")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 w-56 rounded-md border border-input pl-9 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#3b2559] px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            {tc("filters")}
            <ChevronDown size={14} />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#3b2559] px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
          >
            {tc("actions")}
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c8c8c8]">
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">
                {t("accountName")}
              </th>
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">
                {tc("website")}
              </th>
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("totalVisits")}
                >
                  {t("totalVisitsShort")}
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("totalResponses")}
                >
                  {t("totalResponsesShort")}
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("conversionRate")}
                >
                  {t("conversionRateShort")}
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="h-10 px-3 text-left font-medium text-muted-foreground">
                {tc("status")}
              </th>
              <th className="h-10 px-3 text-center font-medium text-muted-foreground">
                {t("onboarding")}
              </th>
              <th className="h-10 px-3 text-center font-medium text-muted-foreground">
                {t("performanceCol")}
              </th>
              <th className="h-10 px-3 text-center font-medium text-muted-foreground">
                {tc("website")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((account) => (
              <tr
                key={account.id}
                className="border-b border-[#f2f2f2] transition-colors hover:bg-muted/50"
              >
                <td className="p-3 font-medium">{account.name}</td>
                <td className="p-3 font-medium">{account.website}</td>
                <td className="p-3 font-medium">
                  {account.totalVisits.toLocaleString()}
                </td>
                <td className="p-3 font-medium">
                  {account.totalResponses.toLocaleString()}
                </td>
                <td className="p-3 font-medium">
                  {account.conversionRate.toLocaleString()}
                </td>
                <td className="p-3">
                  <StatusBadge status={account.status} />
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center">
                    <StatusIconCell icon={account.onboarding} />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center">
                    <StatusIconCell icon={account.performance} />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center">
                    <StatusIconCell icon={account.websiteHealth} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm text-muted-foreground">
          {startItem}-{endItem} {tc("of")} {sorted.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft size={14} />
            {tc("previous")}
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 rounded-md border border-[#3b2559] px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {tc("next")}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
