"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { GaugeChart } from "@/app/ui/GaugeChart";
import {
  Search,
  Filter,
  Lock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ROLE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Admin: { bg: "#e1dff6", text: "#250d53", border: "#c4c0e8" },
  Internal: { bg: "#fff2cf", text: "#946a22", border: "#daad75" },
  Agency: { bg: "#D8E6F4", text: "#637C93", border: "#93A8BA" },
  Support: { bg: "#ffe2de", text: "#ab626f", border: "#eaa289" },
};

const ROLE_ICONS: Record<string, React.ComponentType<{ size: number }>> = {
  Admin: Lock,
  Internal: Eye,
  Agency: Eye,
  Support: Eye,
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
  const style = ROLE_STYLES[role] || ROLE_STYLES.Admin;
  const Icon = ROLE_ICONS[role] || Eye;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      <Icon size={12} />
      {role}
    </span>
  );
}

function TagBadge({
  label,
  bg,
  text,
  border,
}: {
  label: string;
  bg: string;
  text: string;
  border: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      {label}
    </span>
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
  const startItem =
    filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredUsers.length);

  return (
    <>
      {/* Health Gauges */}
      <div className="min-w-[320px] flex flex-col gap-4 @xl:flex-row">
        <GaugeChart
          title={t("onboardingHealth")}
          label={t("good")}
          value={75}
          color="#D3D3AD"
          href="#"
        />
        <GaugeChart
          title={t("performanceHealth")}
          label={t("fair")}
          value={50}
          color="#ECC58E"
          href="#"
        />
        <GaugeChart
          title={t("websiteHealth")}
          label={t("poor")}
          value={25}
          color="#E2816B"
          href="#"
        />
      </div>

      {/* Company Info + Users Table */}
      <div className="flex flex-col gap-4 @[1100px]:flex-row">
        {/* Company Info */}
        <Card className="flex-1 min-w-0 @[1100px]:basis-1/2 p-6">
          <CardContent className="h-full">
            <div className="grid grid-cols-2 h-full">
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
                  className="flex flex-col gap-1 py-4 px-4 border-b border-[#e8e8e8] last:border-b-0 [&:nth-last-child(2)]:border-b-0"
                >
                  <p className="text-sm font-bold text-[#070043]">
                    {item.label}
                  </p>
                  <p className="text-sm text-[#777]">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="flex-1 min-w-0 @[1100px]:basis-1/2 p-4">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
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
                  className="h-9 w-48 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md border border-[#3b2559] px-3 h-9 text-sm hover:bg-muted cursor-pointer"
              >
                <Filter size={14} />
                {tc("filter")}
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c8c8c8]">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                      {tc("users")}
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                      {tc("userRole")}
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                      {tc("email")}
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                      {t("dateAdded")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, i) => (
                    <tr
                      key={`${user.name}-${i}`}
                      className="border-b border-[#f2f2f2] last:border-0"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#e1dff6] text-[#777] flex items-center justify-center text-xs font-medium shrink-0">
                            PH
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-3 px-2 text-[#777]">{user.email}</td>
                      <td className="py-3 px-2 font-medium">
                        {user.dateAdded}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {startItem}-{endItem} {tc("of")} {filteredUsers.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft size={14} /> {tc("previous")}
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 rounded-md border border-[#3b2559] px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {tc("next")} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags Section */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#777]">
              {t("practiceAreas")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <TagBadge
                label="Practice area"
                bg="#d8e6f4"
                text="#637c93"
                border="#b0cde4"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#777]">
              {t("integrations")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <TagBadge
                label="Integration"
                bg="#ededc7"
                text="#626444"
                border="#bcbc95"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#777]">
              {t("techStack")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <TagBadge
                label="Tech platform"
                bg="#e1dff6"
                text="#250d53"
                border="#c4c0e8"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#777]">
              {t("lawbrokrFeatures")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <TagBadge
                label="Feature"
                bg="#e1dff6"
                text="#250d53"
                border="#c4c0e8"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
