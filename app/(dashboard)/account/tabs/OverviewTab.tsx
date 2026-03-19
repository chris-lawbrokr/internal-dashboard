"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { GaugeChart } from "@/app/(dashboard)/ui/charts/GaugeChart";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import { Badge, type BadgeVariant } from "@/components/ui/badge/Badge";
import { Search, Filter, Lock, Eye } from "lucide-react";

const ROLE_CONFIG: Record<string, { variant: BadgeVariant; icon: React.ComponentType<{ size: number }> }> = {
  Admin: { variant: "neutral", icon: Lock },
  Internal: { variant: "warning", icon: Eye },
  Agency: { variant: "info", icon: Eye },
  Support: { variant: "support", icon: Eye },
};

const users = [
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Admin",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Internal",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "livingston@example.com",
    role: "Agency",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Agency",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Support",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Admin",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "livingston@example.com",
    role: "Agency",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Internal",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Support",
    dateAdded: "Feb. 1, 2026",
  },
  {
    name: "Full Name",
    email: "name@example.com",
    role: "Admin",
    dateAdded: "Feb. 1, 2026",
  },
];

const PAGE_SIZE = 5;

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.Admin;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} icon={<Icon size={12} />}>
      {role}
    </Badge>
  );
}

export function OverviewTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const t = useTranslations("account");
  const tc = useTranslations("common");

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  return (
    <>
      {/* Health Gauges */}
      <div className="flex flex-col gap-4 @xl:flex-row">
        <GaugeChart
          title={t("onboardingHealth")}
          label={t("good")}
          value={75}
          color="var(--color-chart-sage)"
          href="#"
        />
        <GaugeChart
          title={t("performanceHealth")}
          label={t("fair")}
          value={50}
          color="var(--color-chart-gold-light)"
          href="#"
        />
        <GaugeChart
          title={t("websiteHealth")}
          label={t("poor")}
          value={25}
          color="var(--color-chart-coral)"
          href="#"
        />
      </div>

      {/* Company Info + Users Table */}
      <div className="flex flex-col gap-4 @[1100px]:flex-row">
        {/* Company Info */}
        <Card className="flex-1 min-w-0 @[1100px]:basis-1/2 p-4 md:p-8">
          <CardContent className="h-full">
            <div className="grid grid-cols-1 @lg:grid-cols-2 h-full">
              {[
                { label: `${t("companyName")}:`, value: "Law Firm Name" },
                { label: `${t("companySize")}:`, value: "25 employees" },
                { label: `${t("location")}:`, value: "Los Angeles, CA, USA" },
                { label: `${t("marketingAgency")}:`, value: "N/A" },
                { label: `${t("website")}:`, value: "www.lawfirmname.com" },
                { label: `${t("marketingSpend")}:`, value: "N/A" },
                { label: `${t("activationDate")}:`, value: "Feb. 1, 2026" },
                { label: `${tc("status")}:`, value: "Active" },
                { label: `${t("username")}:`, value: "lawfirmname" },
                { label: `${t("integrations")}:`, value: "Active" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 py-4 px-4 border-b border-border-light last:border-b-0 @lg:[&:nth-last-child(2)]:border-b-0"
                >
                  <p className="text-sm font-bold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <div className="flex-1 min-w-0 @[1100px]:basis-1/2">
          <Table
            toolbar={
              <div className="flex flex-col @md/table:flex-row @md/table:items-center justify-between gap-4">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder={tc("search")}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="h-9 w-full @md/table:w-48 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-md border border-primary px-3 h-9 text-sm hover:bg-muted cursor-pointer"
                >
                  <Filter size={14} />
                  {tc("filter")}
                </button>
              </div>
            }
            footer={
              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filteredUsers.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            }
          >
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="py-2 px-2">{tc("users")}</TableHead>
                <TableHead className="py-2 px-2">{tc("userRole")}</TableHead>
                <TableHead className="py-2 px-2">{tc("email")}</TableHead>
                <TableHead className="py-2 px-2">{t("dateAdded")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, i) => (
                <TableRow
                  key={`${user.name}-${i}`}
                  className="border-b border-background last:border-0"
                >
                  <TableCell className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-status-neutral-bg text-muted-foreground flex items-center justify-center text-xs font-medium shrink-0">
                        PH
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-2">
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="py-3 px-2 text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3 px-2 font-medium">
                    {user.dateAdded}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tags Section */}
      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-muted-foreground">
              {t("practiceAreas")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info" className="px-2.5 py-1">Practice area</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-muted-foreground">
              {t("integrations")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" className="px-2.5 py-1">Integration</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-muted-foreground">
              {t("techStack")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral" className="px-2.5 py-1">Tech platform</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-muted-foreground">
              {t("lawbrokrFeatures")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral" className="px-2.5 py-1">Feature</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
