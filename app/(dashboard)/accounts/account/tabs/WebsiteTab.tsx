"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";
import { Badge } from "@/components/ui/badge/Badge";
import {
  Check,
  AlertCircle,
  X,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

interface WebsiteData {
  status: string;
  source_attribution: string;
  link_status: string;
  ssl_status: string;
  load_time: number;
  live_links: number;
  live_links_change: number;
  integrations: string[] | null;
}

interface WebsiteLink {
  website_url: string;
  lawbrokr_url: string | null;
  status: string;
}

type LinkStatus = "active" | "review" | "broken";

const statusConfig: Record<LinkStatus, { variant: "success" | "caution" | "error"; icon: ReactNode; labelKey: string }> = {
  active: { variant: "success", icon: <Check size={12} />, labelKey: "active" },
  review: { variant: "caution", icon: <AlertCircle size={12} />, labelKey: "review" },
  broken: { variant: "error", icon: <X size={12} />, labelKey: "broken" },
};

function StatusCard({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`flex-1 p-4${className ? ` ${className}` : ""}`}>
      <CardContent className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {children}
      </CardContent>
    </Card>
  );
}

interface WebsiteTabProps {
  lawFirmId?: string | null;
}

export function WebsiteTab({ lawFirmId }: WebsiteTabProps) {
  const [page, setPage] = useState(1);
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [links, setLinks] = useState<WebsiteLink[]>([]);
  const pageSize = 10;
  const t = useTranslations("website");

  useEffect(() => {
    if (!lawFirmId) return;

    fetch(`/api/account/website?law_firm_id=${lawFirmId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setWebsite)
      .catch((e) => console.error("Failed to fetch website data:", e));

    fetch(`/api/account/website/links?law_firm_id=${lawFirmId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setLinks(data.data ?? []))
      .catch((e) => console.error("Failed to fetch website links:", e));
  }, [lawFirmId]);

  const totalPages = Math.max(1, Math.ceil(links.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedLinks = useMemo(
    () => links.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, links],
  );

  const isLive = website?.status === "live";
  const isLinkUp = website?.link_status === "up";
  const isSslEnabled = website?.ssl_status === "enabled";
  const isAttrEnabled = website?.source_attribution === "enabled";
  const linksChange = website?.live_links_change ?? 0;
  const linksChangePositive = linksChange >= 0;

  return (
    <>
      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-4">
        <StatusCard label={t("websiteStatus")}>
          <Badge
            variant={isLive ? "success" : "error"}
            dot
            className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold"
          >
            {isLive ? t("live") : t("down")}
          </Badge>
        </StatusCard>

        <StatusCard label={t("sourceAttribution")}>
          <Badge
            variant={isAttrEnabled ? "success" : "error"}
            dot
            className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold"
          >
            {isAttrEnabled ? t("enabled") : t("disabled")}
          </Badge>
        </StatusCard>

        <StatusCard label={t("linkStatus")}>
          <Badge
            variant={isLinkUp ? "success" : "error"}
            dot
            className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold"
          >
            {isLinkUp ? t("live") : t("down")}
          </Badge>
        </StatusCard>

        <StatusCard label={t("activeIntegrations")} className="row-span-2">
          {(website?.integrations ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {website!.integrations!.map((int) => (
                <Badge key={int} variant="neutral" className="gap-1.5 self-start px-2 py-1 font-bold border-border-purple">
                  {int}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">N/A</span>
          )}
        </StatusCard>

        <StatusCard label={t("sslStatus")}>
          <Badge
            variant={isSslEnabled ? "success" : "error"}
            dot
            className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold"
          >
            {isSslEnabled ? t("enabled") : t("disabled")}
          </Badge>
        </StatusCard>

        <StatusCard label={t("websiteLoadTime")}>
          <span className="text-2xl font-bold">
            {t("seconds", { count: website?.load_time ?? 0 })}
          </span>
        </StatusCard>

        <StatusCard label={t("liveLawbrokrLinks")}>
          <span className="text-2xl font-bold">{website?.live_links ?? 0}</span>
          <span className="inline-flex items-center gap-1 text-sm">
            <span className={linksChangePositive ? "text-status-success-border" : "text-status-error-text"}>
              {linksChangePositive ? (
                <ArrowUp size={14} className="inline" />
              ) : (
                <ArrowDown size={14} className="inline" />
              )}{" "}
              {Math.round(Math.abs(linksChange))}%
            </span>{" "}
            <span className="text-muted-foreground">{t("vsLastMonth")}</span>
          </span>
        </StatusCard>
      </div>

      {/* Lawbrokr Links table */}
      <Table
        toolbar={
          <h2 className="text-lg font-semibold">{t("lawbrokrLinks")}</h2>
        }
        footer={
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={links.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        }
      >
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 pl-5 pr-10">
              {t("websiteUrl")}
            </TableHead>
            <TableHead className="py-2 pl-5 pr-10">
              {t("lawbrokrUrl")}
            </TableHead>
            <TableHead className="text-right py-2 pl-5 pr-10">
              {t("status")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLinks.map((link, i) => {
            const status = (link.status as LinkStatus) || "broken";
            const config = statusConfig[status] ?? statusConfig.broken;
            return (
              <TableRow key={i} className="h-14">
                <TableCell className="py-0 pl-5 pr-10 text-muted-foreground">
                  {link.website_url}
                </TableCell>
                <TableCell className="py-0 pl-5 pr-10 text-muted-foreground">
                  {link.lawbrokr_url ?? "—"}
                </TableCell>
                <TableCell className="py-0 pl-5 pr-10 text-right">
                  <Badge variant={config.variant} icon={config.icon}>
                    {t(config.labelKey)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
