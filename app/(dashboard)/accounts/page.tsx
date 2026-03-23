"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
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
import { DateRangePickerWithPresets } from "@/components/ui/datepicker";
import { DATE_RANGE_MIN, dateRangeMax } from "@/lib/dates";

type HealthStatus = "success" | "warning" | "error";

interface Account {
  id: number;
  name: string;
  website: string;
  employees: number;
  location: string;
  totalVisits: number;
  totalResponses: number;
  conversionRate: number;
  nextPaymentDue: string;
  status: "Active" | "Inactive";
  onboarding: HealthStatus;
  performance: HealthStatus;
  websiteHealth: HealthStatus;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const healthStatuses: HealthStatus[] = ["success", "warning", "error"];

const fakeAccounts: Account[] = Array.from({ length: 100 }, (_, i) => {
  const r = seededRandom(i + 1);
  const iconIdx = Math.floor(seededRandom(i + 200) * 3);
  return {
    id: i + 1,
    name: "Law Firm Name",
    website: "www.lawfirmwebsite.com",
    employees: 10,
    location: "Los Angeles, CA",
    totalVisits: 10000,
    totalResponses: 10000,
    conversionRate: 10000,
    nextPaymentDue: "Mar. 20, 2026",
    status: r > 0.3 ? "Active" : "Inactive",
    onboarding: healthStatuses[iconIdx],
    performance: healthStatuses[iconIdx],
    websiteHealth: healthStatuses[iconIdx],
  };
});

const PAGE_SIZE = 20;

type SortField = "totalVisits" | "totalResponses" | "conversionRate";
type SortDir = "asc" | "desc";

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const router = useRouter();
  const t = useTranslations("accounts");
  const tc = useTranslations("common");

  const filtered = fakeAccounts.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.website.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
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
    <div className="flex flex-col h-full">
      <div className="flex flex-col @xl:flex-row @xl:items-center justify-between gap-4 pb-4">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <div className="w-full @xl:w-auto [&>div]:w-full @xl:[&>div]:w-auto [&>div>button:first-child]:w-full @xl:[&>div>button:first-child]:w-auto">
          <DateRangePickerWithPresets
            defaultPreset="90d"
            minDate={DATE_RANGE_MIN}
            maxDate={dateRangeMax()}
          />
        </div>
      </div>
      <div className="overflow-y-auto min-h-0 flex-1 flex flex-col gap-4 pb-2">
        <Table
          toolbar={
            <div className="flex flex-col @md/table:flex-row @md/table:items-center justify-between gap-4">
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
              <TableHead className="whitespace-nowrap">
                {t("accountName")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("website")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("employee")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("location")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("totalVisits")}
                >
                  {t("totalVisits")}
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("totalResponses")}
                >
                  {t("totalResponses")}
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("conversionRate")}
                >
                  {t("conversionRate")}
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("nextPaymentDue")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {tc("status")}
              </TableHead>
              <TableHead className="whitespace-nowrap text-center">
                {t("onboarding")}
              </TableHead>
              <TableHead className="whitespace-nowrap text-center">
                {t("performance")}
              </TableHead>
              <TableHead className="whitespace-nowrap text-center">
                {t("website")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((account) => (
              <TableRow
                key={account.id}
                className="border-b border-background cursor-pointer"
                onClick={() => router.push("/accounts/account")}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {account.name}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.website}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.employees}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.location}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.totalVisits.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.totalResponses.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.conversionRate.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.nextPaymentDue}
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
      </div>
    </div>
  );
}
