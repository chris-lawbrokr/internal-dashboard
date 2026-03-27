"use client";

import { useState, useEffect } from "react";
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
import { Spinner } from "@/components/ui/Spinner";

type HealthStatus = "success" | "warning" | "error";

interface Account {
  law_firm_id: number;
  name: string;
  website: string;
  employees: number | null;
  location: string | null;
  visits: number;
  conversions: number;
  conversion_rate: number;
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  status: string;
  onboarding_health: string;
  performance_health: string;
  website_health: string;
  practice_areas: string[] | null;
}

function healthToVariant(health: string): HealthStatus {
  switch (health) {
    case "good":
      return "success";
    case "fair":
      return "warning";
    default:
      return "error";
  }
}

function formatPaymentDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PAGE_SIZE = 20;

type SortField = "visits" | "conversions" | "conversion_rate";
type SortDir = "asc" | "desc";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const router = useRouter();
  const t = useTranslations("accounts");
  const tc = useTranslations("common");

  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 90);

  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);

  useEffect(() => {
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const qs = `start_date=${fmt(startDate)}&end_date=${fmt(endDate)}`;

    setAccounts(null);
    fetch(`/api/accounts?${qs}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setAccounts(data.data ?? []))
      .catch((err) => console.error("Failed to fetch accounts:", err));
  }, [startDate, endDate]);

  const filtered = (accounts ?? []).filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.website.toLowerCase().includes(q) ||
      (a.location ?? "").toLowerCase().includes(q)
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
            onChange={(start, end) => {
              if (start && end) {
                setStartDate(start);
                setEndDate(end);
              }
            }}
          />
        </div>
      </div>
      {accounts === null ? (
        <Spinner />
      ) : (
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
                  onClick={() => handleSort("visits")}
                >
                  {t("totalVisits")}
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("conversions")}
                >
                  {t("totalResponses")}
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("conversion_rate")}
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
            {paginated.map((account, i) => (
              <TableRow
                key={`${account.name}-${i}`}
                className="border-b border-background cursor-pointer"
                onClick={() => router.push(`/accounts/account?law_firm_id=${account.law_firm_id ?? 1}`)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {account.name}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.website}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.employees ?? "—"}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.location ?? "—"}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.visits.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {account.conversions.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {Math.round(account.conversion_rate)}%
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {formatPaymentDate(account.next_payment_date)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={account.status === "active" ? "success" : "error"}
                    className="px-2 py-1 text-sm"
                  >
                    {account.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <StatusIcon variant={healthToVariant(account.onboarding_health)} />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <StatusIcon variant={healthToVariant(account.performance_health)} />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <StatusIcon variant={healthToVariant(account.website_health)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}
    </div>
  );
}
