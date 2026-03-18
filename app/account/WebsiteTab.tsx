"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
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

function StatusBadge({ status }: { status: LinkStatus }) {
  const t = useTranslations("website");
  const statusKeyMap: Record<LinkStatus, string> = {
    Active: "active",
    Review: "review",
    Broken: "broken",
  };

  const config = {
    Active: {
      icon: <Check size={12} />,
      className: "border-[#bcbc95] bg-[#ededc7] text-[#626444]",
    },
    Review: {
      icon: <AlertCircle size={12} />,
      className: "border-[#daad75] bg-[#fff2cf] text-[#A56737]",
    },
    Broken: {
      icon: <X size={12} />,
      className: "border-[#eaa289] bg-[#ffd9c5] text-[#b13c33]",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {t(statusKeyMap[status])}
    </span>
  );
}

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
  const tc = useTranslations("common");

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
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg border px-2 py-1 text-xs font-bold border-[#bcbc95] bg-[#ededc7] text-[#626444]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#626444]" />
            {t("live")}
          </span>
        </StatusCard>

        <StatusCard label={t("sourceAttribution")}>
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg border px-2 py-1 text-xs font-bold border-[#bcbc95] bg-[#ededc7] text-[#626444]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#626444]" />
            {t("enabled")}
          </span>
        </StatusCard>

        <StatusCard label={t("linkStatus")}>
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg border px-2 py-1 text-xs font-bold border-[#eaa289] bg-[#ffd9c5] text-[#b13c33]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b13c33]" />
            {t("down")}
          </span>
        </StatusCard>

        <StatusCard label={t("activeIntegrations")} className="row-span-2">
          <span className="inline-flex items-center bg-[#E1DFF6] gap-1.5 self-start rounded-md border border-[#A18DBE] px-2 py-1 text-xs font-bold">
            Scorpion
          </span>
        </StatusCard>

        <StatusCard label={t("sslStatus")}>
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg border px-2 py-1 text-xs font-bold border-[#bcbc95] bg-[#ededc7] text-[#626444]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#626444]" />
            {t("enabled")}
          </span>
        </StatusCard>

        <StatusCard label={t("websiteLoadTime")}>
          <span className="text-2xl font-bold">
            {t("seconds", { count: 8 })}
          </span>
        </StatusCard>

        <StatusCard label={t("liveLawbrokrLinks")}>
          <span className="text-2xl font-bold">39</span>
          <span className="inline-flex items-center gap-1 text-sm">
            <span className="text-[#b13c33]">
              <ArrowDown size={14} className="inline" /> 10%
            </span>{" "}
            <span className="text-muted-foreground">{t("vsLastMonth")}</span>
          </span>
        </StatusCard>
      </div>

      {/* Lawbrokr Links table */}
      <Card className="p-4">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{t("lawbrokrLinks")}</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pl-5 pr-10 font-medium text-muted-foreground">
                    {t("websiteUrl")}
                  </th>
                  <th className="text-left py-2 pl-5 pr-10 font-medium text-muted-foreground">
                    {t("lawbrokrUrl")}
                  </th>
                  <th className="text-right py-2 pl-5 pr-10 font-medium text-muted-foreground">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLinks.map((link, i) => (
                  <tr key={i} className="h-14 border-b last:border-0">
                    <td className="py-0 pl-5 pr-10 text-muted-foreground">
                      {link.websiteUrl}
                    </td>
                    <td className="py-0 pl-5 pr-10 text-muted-foreground">
                      {link.lawbrokrUrl}
                    </td>
                    <td className="py-0 pl-5 pr-10 text-right">
                      <StatusBadge status={link.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {links.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, links.length)} {tc("of")}{" "}
              {links.length}
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
    </>
  );
}
