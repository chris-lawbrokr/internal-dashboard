"use client";

import { useState, useEffect } from "react";
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
import { Search, X, ArrowUpDown } from "lucide-react";
import { Badge, StatusIcon } from "@/components/ui/badge/Badge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useSkeletonTransition } from "@/components/ui/SkeletonTransition";

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

  const { showSkeleton, fading } = useSkeletonTransition(accounts === null);

  if (showSkeleton || accounts === null)
    return (
      <div className={`h-full flex-1 flex flex-col min-h-0${fading ? " skeleton-fade-out" : ""}`}>
        <SkeletonTable rows={10} className="flex-1" />
      </div>
    );

  const accts = accounts!;
  const filtered = accts.filter((a) => {
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
                  className="px-2 py-1 text-sm"
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
