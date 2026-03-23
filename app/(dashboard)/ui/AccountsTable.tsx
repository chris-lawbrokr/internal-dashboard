"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import {
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Badge, StatusIcon } from "@/components/ui/badge/Badge";

type HealthStatus = "success" | "warning" | "error";

interface Account {
  id: number;
  name: string;
  website: string;
  totalVisits: number;
  totalResponses: number;
  conversionRate: number;
  status: "Active" | "Inactive";
  onboarding: HealthStatus;
  performance: HealthStatus;
  websiteHealth: HealthStatus;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const statusIcons: HealthStatus[] = ["success", "warning", "error"];

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

  return (
    <Table
      toolbar={
        <div className="flex flex-col @md/table:flex-row @md/table:items-center justify-between">
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
              className="h-9 w-full @md/table:w-56 rounded-md border border-input pl-9 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="flex-1 @md/table:flex-none flex items-center gap-1.5 rounded-md border border-primary px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              {tc("filters")}
              <ChevronDown size={14} />
            </button>

            <button
              type="button"
              className="flex-1 @md/table:flex-none flex items-center gap-1.5 rounded-md border border-primary px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
            >
              {tc("actions")}
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      }
      footer={
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={sorted.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      }
    >
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead>{t("accountName")}</TableHead>
          <TableHead>{tc("website")}</TableHead>
          <TableHead>
            <button
              type="button"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleSort("totalVisits")}
            >
              {t("totalVisitsShort")}
              <ArrowUpDown size={14} />
            </button>
          </TableHead>
          <TableHead>
            <button
              type="button"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleSort("totalResponses")}
            >
              {t("totalResponsesShort")}
              <ArrowUpDown size={14} />
            </button>
          </TableHead>
          <TableHead>
            <button
              type="button"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleSort("conversionRate")}
            >
              {t("conversionRateShort")}
              <ArrowUpDown size={14} />
            </button>
          </TableHead>
          <TableHead>{tc("status")}</TableHead>
          <TableHead className="text-center">{t("onboarding")}</TableHead>
          <TableHead className="text-center">{t("performanceCol")}</TableHead>
          <TableHead className="text-center">{tc("website")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((account) => (
          <TableRow key={account.id} className="border-b border-background">
            <TableCell className="font-medium">{account.name}</TableCell>
            <TableCell className="font-medium">{account.website}</TableCell>
            <TableCell className="font-medium">
              {account.totalVisits.toLocaleString()}
            </TableCell>
            <TableCell className="font-medium">
              {account.totalResponses.toLocaleString()}
            </TableCell>
            <TableCell className="font-medium">
              {account.conversionRate.toLocaleString()}
            </TableCell>
            <TableCell>
              <Badge
                variant={account.status === "Active" ? "success" : "error"}
                className="px-2 py-1 text-sm"
              >
                {account.status}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <StatusIcon variant={account.onboarding} />
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <StatusIcon variant={account.performance} />
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <StatusIcon variant={account.websiteHealth} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
