"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useDateRange } from "@/lib/useDateRange";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import { Search, X, ArrowUpDown, ListFilter } from "lucide-react";
import { Badge, StatusIcon } from "@/components/ui/badge/Badge";
import { SkeletonTable } from "@/components/ui/skeleton/Skeleton";
import { useSkeletonTransition } from "@/components/ui/skeleton/SkeletonTransition";

type HealthStatus = "success" | "warning" | "error";

export interface Account {
  id: number;
  name: string;
  website: string;
  visits: number;
  conversions: number;
  conversion_rate: number;
  status: string;
  onboarding_health: string;
  performance_health: string;
  website_health: string;
}

export interface AccountsResponse {
  data: Account[];
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

const DEFAULT_pageSize = 10;

type SortField = "visits" | "conversions" | "conversion_rate";
type SortDir = "asc" | "desc";

type FilterColumn =
  | "status"
  | "onboarding_health"
  | "performance_health"
  | "website_health"
  | "visits"
  | "conversions"
  | "conversion_rate";

type NumericOp = "gt" | "lt";

const NUMERIC_COLUMNS: FilterColumn[] = [
  "visits",
  "conversions",
  "conversion_rate",
];

const FILTER_COLUMNS: { key: FilterColumn; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "visits", label: "Visits" },
  { key: "conversions", label: "Responses" },
  { key: "conversion_rate", label: "Conv. Rate" },
  { key: "onboarding_health", label: "Onboarding" },
  { key: "performance_health", label: "Performance" },
  { key: "website_health", label: "Website" },
];

function isNumericColumn(col: FilterColumn): boolean {
  return NUMERIC_COLUMNS.includes(col);
}

function getDistinctValues(
  accounts: Account[],
  column: FilterColumn,
): string[] {
  const values = new Set<string>();
  for (const a of accounts) {
    const raw = a[column];
    values.add(String(raw));
  }
  return [...values].sort();
}

function formatFilterValue(column: FilterColumn, value: string): string {
  if (column === "status") return value === "active" ? "Active" : "Inactive";
  if (column.endsWith("_health")) {
    if (value === "good") return "Good";
    if (value === "fair") return "Fair";
    return "Poor";
  }
  return value;
}

function formatNumericLabel(
  column: FilterColumn,
  op: NumericOp,
  value: number,
): string {
  const symbol = op === "gt" ? ">" : "<";
  if (column === "conversion_rate") return `${symbol} ${value}%`;
  return `${symbol} ${value.toLocaleString()}`;
}

export function AccountsTable({
  accounts: externalAccounts,
  defaultPageSize = DEFAULT_pageSize,
}: {
  accounts?: Account[];
  defaultPageSize?: number;
}) {
  const { user, getAccessToken } = useAuth();
  const { dateQuery } = useDateRange();
  const [internalAccounts, setInternalAccounts] = useState<Account[] | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  // Active filter (what's actually applied to the data)
  const [activeFilterColumn, setActiveFilterColumn] = useState<FilterColumn | null>(null);
  const [activeFilterValue, setActiveFilterValue] = useState<string | null>(null);
  const [activeFilterOp, setActiveFilterOp] = useState<NumericOp | null>(null);
  const [activeFilterNumeric, setActiveFilterNumeric] = useState<number | null>(null);
  // Dropdown navigation state
  const [filterColumn, setFilterColumn] = useState<FilterColumn | null>(null);
  const [filterOp, setFilterOp] = useState<NumericOp>("gt");
  const [filterCustomInput, setFilterCustomInput] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const managed = externalAccounts === undefined;

  useEffect(() => {
    if (managed) setInternalAccounts(null);
    if (!managed || !user) return;
    let cancelled = false;
    api<AccountsResponse>(`admin/accounts?${dateQuery}`, getAccessToken)
      .then((data) => {
        if (!cancelled) setInternalAccounts(data.data);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch accounts:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [managed, user, getAccessToken, dateQuery]);

  const accounts = externalAccounts ?? internalAccounts;

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const { showSkeleton, fading } = useSkeletonTransition(accounts === null);

  if (showSkeleton || accounts === null)
    return (
      <div
        className={`h-full flex-1 flex flex-col min-h-0${fading ? " skeleton-fade-out" : ""}`}
      >
        <SkeletonTable rows={10} className="flex-1" />
      </div>
    );

  const accts = accounts!;
  const filtered = accts.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(q) || a.website.toLowerCase().includes(q);
    let matchesFilter = true;
    if (activeFilterColumn) {
      if (isNumericColumn(activeFilterColumn) && activeFilterOp && activeFilterNumeric !== null) {
        const val = Number(a[activeFilterColumn]);
        matchesFilter =
          activeFilterOp === "gt" ? val > activeFilterNumeric : val < activeFilterNumeric;
      } else if (!isNumericColumn(activeFilterColumn) && activeFilterValue) {
        matchesFilter = String(a[activeFilterColumn]) === activeFilterValue;
      }
    }
    return matchesSearch && matchesFilter;
  });

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortDir === "asc" ? diff : -diff;
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / pageSize);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
    <div className="pb-1 skeleton-stagger h-full flex-1 flex flex-col min-h-0">
      <Table
        wrapperClassName="flex-1 flex flex-col min-h-0"
        toolbar={
          <div className="flex flex-col gap-2 @md/table:flex-row @md/table:items-center justify-between">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                aria-label="Search accounts"
                placeholder="Search accounts..."
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
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className={`h-9 flex items-center gap-1.5 rounded-md border px-3 text-sm cursor-pointer transition-colors ${activeFilterColumn ? "border-brand-dark text-brand-dark" : "border-input text-muted-foreground hover:text-foreground"}`}
              >
                <ListFilter size={14} />
                {activeFilterColumn
                  ? isNumericColumn(activeFilterColumn) &&
                    activeFilterOp &&
                    activeFilterNumeric !== null
                    ? `${FILTER_COLUMNS.find((c) => c.key === activeFilterColumn)!.label}: ${formatNumericLabel(activeFilterColumn, activeFilterOp, activeFilterNumeric)}`
                    : `${FILTER_COLUMNS.find((c) => c.key === activeFilterColumn)!.label}: ${formatFilterValue(activeFilterColumn, activeFilterValue!)}`
                  : "Filter"}
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 min-w-[220px] max-h-[300px] overflow-y-auto overscroll-contain rounded-lg border border-input bg-card shadow-lg">
                  {!filterColumn ? (
                    <div>
                      {FILTER_COLUMNS.map((col) => (
                        <button
                          key={col.key}
                          type="button"
                          onClick={() => {
                            setFilterColumn(col.key);
                            setFilterOp("gt");
                            const defaults: Record<string, number> = {
                              visits: 100,
                              conversions: 10,
                              conversion_rate: 5,
                            };
                            const defaultVal = defaults[col.key];
                            setFilterCustomInput(defaultVal != null ? String(defaultVal) : "");
                            if (isNumericColumn(col.key) && defaultVal != null) {
                              setActiveFilterColumn(col.key);
                              setActiveFilterOp("gt");
                              setActiveFilterNumeric(defaultVal);
                              setPage(1);
                            }
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                        >
                          {col.label}
                        </button>
                      ))}
                    </div>
                  ) : isNumericColumn(filterColumn) ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setFilterColumn(null)}
                        className="sticky top-0 w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted cursor-pointer border-b border-input bg-card z-10"
                      >
                        ← Back
                      </button>
                      <div className="px-3 py-2 flex flex-col gap-2">
                        <input
                          type="number"
                          value={filterCustomInput}
                          onChange={(e) => {
                            setFilterCustomInput(e.target.value);
                            const num = Number(e.target.value);
                            if (!isNaN(num) && e.target.value.trim()) {
                              setActiveFilterColumn(filterColumn);
                              setActiveFilterOp(filterOp);
                              setActiveFilterNumeric(num);
                              setPage(1);
                            }
                          }}
                          placeholder="Value"
                          className="h-8 w-full rounded-md border border-input px-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <select
                          aria-label="Filter comparison"
                          value={filterOp}
                          onChange={(e) => {
                            const op = e.target.value as NumericOp;
                            setFilterOp(op);
                            const num = Number(filterCustomInput);
                            if (!isNaN(num) && filterCustomInput.trim()) {
                              setActiveFilterColumn(filterColumn);
                              setActiveFilterOp(op);
                              setActiveFilterNumeric(num);
                              setPage(1);
                            }
                          }}
                          className="h-8 w-full rounded-md border border-input bg-background px-1.5 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="gt">Greater than</option>
                          <option value="lt">Less than</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setFilterColumn(null)}
                        className="sticky top-0 w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted cursor-pointer border-b border-input bg-card z-10"
                      >
                        ← Back
                      </button>
                      {getDistinctValues(accts, filterColumn).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setActiveFilterColumn(filterColumn);
                            setActiveFilterValue(val);
                            setActiveFilterOp(null);
                            setActiveFilterNumeric(null);
                            setPage(1);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer ${activeFilterColumn === filterColumn && activeFilterValue === val ? "font-semibold text-brand-dark" : ""}`}
                        >
                          {formatFilterValue(filterColumn, val)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeFilterColumn && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilterColumn(null);
                    setActiveFilterValue(null);
                    setActiveFilterOp(null);
                    setActiveFilterNumeric(null);
                    setFilterColumn(null);
                    setFilterOp("gt");
                    setFilterCustomInput("");
                    setPage(1);
                  }}
                  className="absolute -right-1 -top-1 h-4 w-4 flex items-center justify-center rounded-full bg-brand-dark text-white cursor-pointer"
                  aria-label="Clear filter"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          </div>
        }
        footer={
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={sorted.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        }
      >
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead>Account Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>
              <button
                type="button"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  handleSort("visits");
                }}
              >
                Visits
                <ArrowUpDown size={14} />
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  handleSort("conversions");
                }}
              >
                Responses
                <ArrowUpDown size={14} />
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  handleSort("conversion_rate");
                }}
              >
                Conv. Rate
                <ArrowUpDown size={14} />
              </button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Onboarding</TableHead>
            <TableHead className="text-center">Performance</TableHead>
            <TableHead className="text-center">Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((account, i) => (
            <TableRow
              key={`${account.name}-${String(i)}`}
              className="border-b border-background cursor-pointer"
              onClick={() => {
                router.push(`/accounts/${String(account.id)}`);
              }}
            >
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell className="font-medium">{account.website}</TableCell>
              <TableCell className="font-medium">
                {account.visits.toLocaleString()}
              </TableCell>
              <TableCell className="font-medium">
                {account.conversions.toLocaleString()}
              </TableCell>
              <TableCell className="font-medium">
                {Math.round(account.conversion_rate)}%
              </TableCell>
              <TableCell>
                <Badge
                  variant={account.status === "active" ? "success" : "error"}
                  className="px-2 text-sm"
                >
                  {account.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <StatusIcon
                    variant={healthToVariant(account.onboarding_health)}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <StatusIcon
                    variant={healthToVariant(account.performance_health)}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <StatusIcon
                    variant={healthToVariant(account.website_health)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
