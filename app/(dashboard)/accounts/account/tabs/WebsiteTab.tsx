"use client";

import { useState, useMemo, type ReactNode } from "react";
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
} from "lucide-react";

type LinkStatus = "Active" | "Review" | "Broken";

interface LawbrokrLink {
  websiteUrl: string;
  lawbrokrUrl: string;
  status: LinkStatus;
}

const websitePaths = [
  "/home/landingpage/pagename",
  "/home/landingpage/pagename",
  "/home/landingpage/pagename",
  "/home/landingpage/pagename",
  "/home/landingpage/pagename",
  "/home/landingpage/pagename",
];

const lawbrokrPaths = [
  "/practiceareas/personalinjury",
  "/practiceareas/personalinjury/slipandfall",
  "/practiceareas/personalinjury/dogbite",
  "/practiceareas/personalinjury/carcrash",
  "/practiceareas",
  "/practiceareas/personalinjury/workplaceaccident",
];

const links: LawbrokrLink[] = Array.from({ length: 100 }, (_, i) => ({
  websiteUrl: `www.lawfirmname.com${websitePaths[i % websitePaths.length]}`,
  lawbrokrUrl: `www.lawfirm.lawbrokr.com${lawbrokrPaths[i % lawbrokrPaths.length]}`,
  status: (
    ["Active", "Active", "Review", "Broken", "Active", "Active"] as LinkStatus[]
  )[i % 6],
}));

const statusConfig: Record<LinkStatus, { variant: "success" | "caution" | "error"; icon: ReactNode; labelKey: string }> = {
  Active: { variant: "success", icon: <Check size={12} />, labelKey: "active" },
  Review: { variant: "caution", icon: <AlertCircle size={12} />, labelKey: "review" },
  Broken: { variant: "error", icon: <X size={12} />, labelKey: "broken" },
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

export function WebsiteTab() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const t = useTranslations("website");

  const totalPages = Math.max(1, Math.ceil(links.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedLinks = useMemo(
    () => links.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize],
  );

  return (
    <>
      {/* Top stat cards – row 1 */}
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-4">
        <StatusCard label={t("websiteStatus")}>
          <Badge variant="success" dot className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold">{t("live")}</Badge>
        </StatusCard>

        <StatusCard label={t("sourceAttribution")}>
          <Badge variant="success" dot className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold">{t("enabled")}</Badge>
        </StatusCard>

        <StatusCard label={t("linkStatus")}>
          <Badge variant="error" dot className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold">{t("down")}</Badge>
        </StatusCard>

        <StatusCard label={t("activeIntegrations")} className="row-span-2">
          <Badge variant="neutral" className="gap-1.5 self-start px-2 py-1 font-bold border-border-purple">Scorpion</Badge>
        </StatusCard>

        <StatusCard label={t("sslStatus")}>
          <Badge variant="success" dot className="gap-1.5 self-start rounded-lg px-2 py-1 font-bold">{t("enabled")}</Badge>
        </StatusCard>

        <StatusCard label={t("websiteLoadTime")}>
          <span className="text-2xl font-bold">
            {t("seconds", { count: 8 })}
          </span>
        </StatusCard>

        <StatusCard label={t("liveLawbrokrLinks")}>
          <span className="text-2xl font-bold">39</span>
          <span className="inline-flex items-center gap-1 text-sm">
            <span className="text-status-error-text">
              <ArrowDown size={14} className="inline" /> 10%
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
          {paginatedLinks.map((link, i) => (
            <TableRow key={i} className="h-14">
              <TableCell className="py-0 pl-5 pr-10 text-muted-foreground">
                {link.websiteUrl}
              </TableCell>
              <TableCell className="py-0 pl-5 pr-10 text-muted-foreground">
                {link.lawbrokrUrl}
              </TableCell>
              <TableCell className="py-0 pl-5 pr-10 text-right">
                <Badge variant={statusConfig[link.status].variant} icon={statusConfig[link.status].icon}>{t(statusConfig[link.status].labelKey)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
