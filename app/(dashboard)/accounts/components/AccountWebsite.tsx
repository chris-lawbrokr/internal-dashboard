"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { SkeletonStatusCard, SkeletonValueCard, SkeletonTable } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge/Badge";
import type { BadgeVariant } from "@/components/ui/badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table/Table";

interface WebsiteStatus {
  status: "live" | "down";
  source_attribution: "enabled" | "disabled";
  link_status: "up" | "down";
  ssl_status: "enabled" | "disabled";
  load_time: number;
  live_links: number;
  live_links_prev: number;
  live_links_change: number;
  integrations: string[] | null;
}

interface WebsiteLink {
  website_url: string;
  lawbrokr_url: string | null;
  status: "active" | "review" | "broken";
}

interface WebsiteLinksResponse {
  data: WebsiteLink[];
}

interface AccountWebsiteProps {
  lawFirmId: string;
}

const PAGE_SIZE = 6;

const linkStatusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  active: { label: "Active", variant: "success" },
  review: { label: "Review", variant: "warning" },
  broken: { label: "Broken", variant: "error" },
} as const;

function getLinkStatus(status: string): { label: string; variant: BadgeVariant } {
  return linkStatusConfig[status] ?? { label: "Active", variant: "success" };
}

export function AccountWebsite({ lawFirmId }: AccountWebsiteProps) {
  const { user, getAccessToken } = useAuth();
  const [status, setStatus] = useState<WebsiteStatus | null>(null);
  const [links, setLinks] = useState<WebsiteLinksResponse | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    api<WebsiteStatus>(
      `admin/account/website?law_firm_id=${lawFirmId}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {});

    api<WebsiteLinksResponse>(
      `admin/account/website/links?law_firm_id=${lawFirmId}`,
      getAccessToken,
    )
      .then((data) => {
        if (!cancelled) setLinks(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user, getAccessToken, lawFirmId]);

  if (!status)
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonStatusCard />
          <SkeletonStatusCard />
          <SkeletonStatusCard />
          <SkeletonStatusCard />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonStatusCard />
          <SkeletonValueCard />
          <SkeletonValueCard />
        </div>
        <SkeletonTable rows={6} />
      </div>
    );

  const totalPages = links ? Math.ceil(links.data.length / PAGE_SIZE) : 0;
  const currentPage = Math.min(page, totalPages || 1);
  const paginatedLinks = links
    ? links.data.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      )
    : [];

  const isPositive = status.live_links_change >= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Status cards - top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Website Status</p>
          <Badge
            variant={status.status === "live" ? "success" : "error"}
            dot
            className="px-2 py-1 text-sm w-fit capitalize"
          >
            {status.status === "live" ? "Live" : "Down"}
          </Badge>
        </Card>
        <Card className="p-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Source Attribution</p>
          <Badge
            variant={status.source_attribution === "enabled" ? "success" : "error"}
            dot
            className="px-2 py-1 text-sm w-fit capitalize"
          >
            {status.source_attribution === "enabled" ? "Enabled" : "Disabled"}
          </Badge>
        </Card>
        <Card className="p-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Lawbrokr Link Status</p>
          <Badge
            variant={status.link_status === "up" ? "success" : "error"}
            dot
            className="px-2 py-1 text-sm w-fit capitalize"
          >
            {status.link_status === "up" ? "Up" : "Down"}
          </Badge>
        </Card>
        <Card className="p-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Active Integrations</p>
          <div className="flex flex-wrap gap-1.5">
            {status.integrations?.length ? (
              status.integrations.map((name) => (
                <Badge
                  key={name}
                  variant="neutral"
                  className="px-2 py-1 text-sm"
                >
                  {name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>
        </Card>
      </div>

      {/* Status cards - bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">SSL Status</p>
          <Badge
            variant={status.ssl_status === "enabled" ? "success" : "error"}
            dot
            className="px-2 py-1 text-sm w-fit capitalize"
          >
            {status.ssl_status === "enabled" ? "Enabled" : "Disabled"}
          </Badge>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Website Load Time</p>
          <p className="text-2xl font-bold">{status.load_time} seconds</p>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Live Lawbrokr Links</p>
          <p className="text-2xl font-bold">{status.live_links}</p>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                isPositive
                  ? "text-status-success-border"
                  : "text-status-error-border"
              }
            >
              {isPositive ? "↑" : "↓"} {Math.abs(Math.round(status.live_links_change))}%
            </span>{" "}
            vs last month
          </p>
        </Card>
      </div>

      {/* Links table */}
      <Table
        title="Lawbrokr Links"
        footer={
          links && links.data.length > PAGE_SIZE ? (
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={links.data.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          ) : undefined
        }
      >
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead>Website URL</TableHead>
            <TableHead>Lawbrokr URL</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLinks.map((link, i) => {
            const cfg = getLinkStatus(link.status);
            return (
              <TableRow key={i} className="border-b border-background">
                <TableCell className="text-sm">{link.website_url}</TableCell>
                <TableCell className="text-sm">
                  {link.lawbrokr_url ?? "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={cfg.variant} dot className="px-2 py-1 text-sm">
                    {cfg.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
