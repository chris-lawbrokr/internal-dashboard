"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { SkeletonGauge, SkeletonTable, SkeletonChart } from "@/components/ui/Skeleton";
import { useSkeletonTransition } from "@/components/ui/SkeletonTransition";
import { Badge } from "@/components/ui/badge/Badge";
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
import { HealthGauge } from "./HealthGauge";

type Health = "good" | "fair" | "poor";

interface AccountDetail {
  name: string;
  username: string;
  website: string;
  employees: number;
  location: string;
  marketing_agency: string;
  marketing_spend: number | null;
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  status: "active" | "inactive";
  onboarding_health: Health;
  performance_health: Health;
  website_health: Health;
  practice_areas: string[] | null;
  integrations: string[] | null;
  tech_stack: string[] | null;
  features: string[] | null;
}

interface AccountUser {
  name: string;
  role: string;
  email: string;
  created_date: string;
}

interface AccountUsersResponse {
  data: AccountUser[];
}

const roleBadgeVariant: Record<
  string,
  "success" | "info" | "warning" | "error" | "support"
> = {
  admin: "success",
  internal: "error",
  agency: "warning",
  support: "support",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PAGE_SIZE = 5;

interface AccountOverviewProps {
  lawFirmId: string;
  onTabChange: (tab: string) => void;
}

export function AccountOverview({
  lawFirmId,
  onTabChange,
}: AccountOverviewProps) {
  const { user, getAccessToken } = useAuth();
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [users, setUsers] = useState<AccountUser[] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"role" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    api<AccountDetail>(`admin/account?law_firm_id=${lawFirmId}`, getAccessToken)
      .then((data) => {
        if (!cancelled) setAccount(data);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch account detail:", err);
      });

    api<AccountUsersResponse>(
      `admin/account/users?law_firm_id=${lawFirmId}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setUsers(data.data);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch account users:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [user, getAccessToken, lawFirmId]);

  const { showSkeleton, fading } = useSkeletonTransition(!account || !users);

  if (showSkeleton)
    return (
      <div className={`flex flex-col gap-4${fading ? " skeleton-fade-out" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonGauge />
          <SkeletonGauge />
          <SkeletonGauge />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonChart className="min-h-[400px]" />
          <SkeletonTable rows={5} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonChart className="min-h-[100px]" />
          <SkeletonChart className="min-h-[100px]" />
        </div>
      </div>
    );

  // Past this point, data is guaranteed loaded
  const acct = account!;
  const usrs = users!;

  // Filter users
  const filtered = usrs.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  // Sort users
  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        const diff = a[sortField].localeCompare(b[sortField]);
        return sortDir === "asc" ? diff : -diff;
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSort = (field: "role") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const detailItems: { label: string; value: string }[] = [
    { label: "Company Name", value: acct.name },
    {
      label: "Company Size",
      value:
        acct.employees != null ? `${acct.employees} employees` : "N/A",
    },
    { label: "Location", value: acct.location || "N/A" },
    { label: "Marketing Agency", value: acct.marketing_agency || "N/A" },
    { label: "Website", value: acct.website || "N/A" },
    {
      label: "Marketing Spend",
      value:
        acct.marketing_spend != null
          ? `$${acct.marketing_spend.toLocaleString()}`
          : "N/A",
    },
    { label: "Activation Date", value: formatDate(acct.activation_date) },
    {
      label: "Status",
      value: acct.status === "active" ? "Active" : "Inactive",
    },
    { label: "Username", value: acct.username },
    {
      label: "Integrations",
      value: acct.integrations?.length ? "Active" : "N/A",
    },
  ];

  const badgeSections: {
    title: string;
    items: string[] | null;
    variant: "neutral" | "error" | "info" | "success";
  }[] = [
    {
      title: "Practice Areas",
      items: acct.practice_areas,
      variant: "neutral",
    },
    { title: "Integrations", items: acct.integrations, variant: "error" },
    { title: "Tech Stack", items: acct.tech_stack, variant: "info" },
    { title: "Lawbrokr Features", items: acct.features, variant: "error" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Health Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 skeleton-stagger">
        <HealthGauge
          title="Onboarding Health"
          health={acct.onboarding_health}
          onViewMore={() => onTabChange("usage")}
        />
        <HealthGauge
          title="Performance Health"
          health={acct.performance_health}
          onViewMore={() => onTabChange("performance")}
        />
        <HealthGauge
          title="Website Health"
          health={acct.website_health}
          onViewMore={() => onTabChange("website")}
        />
      </div>

      {/* Account Details + Users Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 skeleton-stagger">
        {/* Account Details */}
        <div className="rounded-xl bg-card text-card-foreground shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.05)] h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 h-full px-6">
            <div className="flex flex-col">
              {detailItems.filter((_, i) => i % 2 === 0).map((item, i, arr) => (
                <div key={item.label} className={`flex flex-col justify-center flex-1 py-4 border-b border-border${i === arr.length - 1 ? " sm:border-b-0" : ""}`}>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5 break-all">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {detailItems.filter((_, i) => i % 2 === 1).map((item, i, arr) => (
                <div key={item.label} className={`flex flex-col justify-center flex-1 py-4${i < arr.length - 1 ? " border-b border-border" : ""}`}>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5 break-all">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <Table
          toolbar={
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                aria-label="Search users"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full sm:w-56 rounded-md border border-input pl-9 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <TableHead>Users</TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  User Role
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((u) => (
              <TableRow key={u.email} className="border-b border-background">
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={roleBadgeVariant[u.role] ?? "neutral"}
                    dot
                    className="px-2 py-1 text-sm capitalize"
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell className="text-sm">
                  {formatDate(u.created_date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Badge Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 skeleton-stagger">
        {badgeSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl bg-card text-card-foreground shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.05)] p-5"
          >
            <p className="text-sm text-muted-foreground mb-3">
              {section.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {section.items?.length ? (
                section.items.map((item) => (
                  <Badge
                    key={item}
                    variant={section.variant}
                    className="px-2.5 py-1 text-sm"
                  >
                    {item}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
