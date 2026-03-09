"use client";

import { useState, useMemo } from "react";
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

const links: LawbrokrLink[] = Array.from({ length: 100 }, (_, i) => ({
  websiteUrl: "www.lawfirmname.com/homepage",
  lawbrokrUrl: "www.lawfirm.lawbrokr.com/practiceareas",
  status: (["Active", "Active", "Review", "Broken", "Active", "Active"] as LinkStatus[])[i % 6],
}));

function StatusBadge({ status }: { status: LinkStatus }) {
  const config = {
    Active: {
      icon: <Check size={12} />,
      className: "border-green-200 bg-green-50 text-green-700",
    },
    Review: {
      icon: <AlertCircle size={12} />,
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
    Broken: {
      icon: <X size={12} />,
      className: "border-red-200 bg-red-50 text-red-700",
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.icon}
      {status}
    </span>
  );
}

function StatusCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="flex-1 p-4">
      <CardContent className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {children}
      </CardContent>
    </Card>
  );
}

export function WebsiteTab() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(links.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedLinks = useMemo(
    () => links.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize],
  );

  return (
    <>
      {/* Top stat cards – row 1 */}
      <div className="grid grid-cols-2 gap-4 @xl:grid-cols-4">
        <StatusCard label="Website Status">
          <span className="inline-flex items-center gap-1.5 self-start rounded-md border px-2 py-0.5 text-xs font-medium border-green-200 bg-green-50 text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </StatusCard>

        <StatusCard label="Source Attribution">
          <span className="inline-flex items-center gap-1.5 self-start rounded-md border px-2 py-0.5 text-xs font-medium border-green-200 bg-green-50 text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Enabled
          </span>
        </StatusCard>

        <StatusCard label="Lawbrokr Link Status">
          <span className="inline-flex items-center gap-1.5 self-start rounded-md border px-2 py-0.5 text-xs font-medium border-red-200 bg-red-50 text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Down
          </span>
        </StatusCard>

        <StatusCard label="Active Integrations">
          <span className="inline-flex items-center gap-1.5 self-start rounded-md border border-foreground px-2 py-0.5 text-xs font-medium">
            Scorpion
          </span>
        </StatusCard>
      </div>

      {/* Top stat cards – row 2 */}
      <div className="grid grid-cols-2 gap-4 @xl:grid-cols-3">
        <StatusCard label="SSL Status">
          <span className="inline-flex items-center gap-1.5 self-start rounded-md border px-2 py-0.5 text-xs font-medium border-green-200 bg-green-50 text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Enabled
          </span>
        </StatusCard>

        <StatusCard label="Website Load Time">
          <span className="text-2xl font-bold text-yellow-600">8 seconds</span>
        </StatusCard>

        <StatusCard label="Live Lawbrokr Links">
          <span className="text-2xl font-bold">39</span>
          <span className="inline-flex items-center gap-1 text-sm text-red-500">
            <ArrowDown size={14} />
            10% <span className="text-muted-foreground">vs last month</span>
          </span>
        </StatusCard>
      </div>

      {/* Lawbrokr Links table */}
      <Card className="p-4">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Lawbrokr Links</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Website URL</th>
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Lawbrokr URL</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLinks.map((link, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 px-2 text-muted-foreground">{link.websiteUrl}</td>
                  <td className="py-3 px-2 text-muted-foreground">{link.lawbrokrUrl}</td>
                  <td className="py-3 px-2 text-right">
                    <StatusBadge status={link.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              Rows per page
              <select
                aria-label="Rows per page"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border rounded px-1 py-0.5 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={99}>99</option>
              </select>
              <span>
                <strong>
                  {links.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, links.length)}
                </strong>{" "}
                of <strong>{links.length}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 text-sm font-medium hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
