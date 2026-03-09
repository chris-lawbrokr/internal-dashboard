"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GaugeChart } from "@/app/ui/GaugeChart";
import {
  Search,
  Filter,
  Lock,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const users = [
  { name: "Joseph McFall", email: "name@example.com", role: "Admin", roleIcon: "lock", type: "PRO" },
  { name: "Micheal Gough", email: "name@example.com", role: "Viewer", roleIcon: "eye", type: "PRO" },
  { name: "Leslie Livingston", email: "livingston@example.com", role: "Editor", roleIcon: "pencil", type: "Lite" },
  { name: "Lana byrd", email: "name@example.com", role: "Editor", roleIcon: "pencil", type: "PRO" },
  { name: "Bonnie Green", email: "name@example.com", role: "Viewer", roleIcon: "eye", type: "Free" },
  { name: "Leslie Livingston", email: "livingston@example.com", role: "Editor", roleIcon: "pencil", type: "Lite" },
  { name: "Lana byrd", email: "name@example.com", role: "Editor", roleIcon: "pencil", type: "PRO" },
  { name: "Bonnie Green", email: "name@example.com", role: "Viewer", roleIcon: "eye", type: "Free" },
];

export function OverviewTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.type.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <div className="min-w-[320px] flex flex-col gap-4 @xl:flex-row">
        <GaugeChart title="Onboarding Health" label="Good" value={75} color="#7c3aed" href="#" />
        <GaugeChart title="Performance Health" label="Fair" value={50} color="#a855f7" href="#" />
        <GaugeChart title="Website Health" label="Poor" value={25} color="#d8b4fe" href="#" />
      </div>

      <div className="flex flex-col gap-4 @xl:flex-row">
        {/* Company Info Card */}
        <Card className="flex-1 p-6">
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-bold">Company Name:</p>
                <p className="text-muted-foreground">In-Person</p>
              </div>
              <div>
                <p className="font-bold">Duration:</p>
                <p className="text-muted-foreground">1 Week</p>
              </div>
              <div>
                <p className="font-bold">Restrictions:</p>
                <p className="text-muted-foreground">None</p>
              </div>
              <div>
                <p className="font-bold">Location:</p>
                <p className="text-muted-foreground">123 Congress Hall, King St</p>
              </div>
              <div>
                <p className="font-bold">Holding capacity:</p>
                <p className="text-muted-foreground">25,000</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-bold">Company Size:</p>
                <p className="text-muted-foreground">In-Person</p>
              </div>
              <div>
                <p className="font-bold">Duration:</p>
                <p className="text-muted-foreground">1 Week</p>
              </div>
              <div>
                <p className="font-bold">Restrictions:</p>
                <p className="text-muted-foreground">None</p>
              </div>
              <div>
                <p className="font-bold">Location:</p>
                <p className="text-muted-foreground">123 Congress Hall, King St</p>
              </div>
              <div>
                <p className="font-bold">Holding capacity:</p>
                <p className="text-muted-foreground">25,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table Card */}
        <Card className="flex-1 p-4">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-9 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button type="button" className="flex items-center gap-1.5 rounded-md border border-input px-3 h-9 text-sm text-muted-foreground hover:bg-muted">
                <Filter size={14} />
                Filter
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Users</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">User Role</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Type</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, i) => (
                  <tr key={`${user.name}-${i}`} className="border-b last:border-0">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                          PH
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">name@flowbite.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium">
                        {user.roleIcon === "lock" && <Lock size={12} />}
                        {user.roleIcon === "eye" && <Eye size={12} />}
                        {user.roleIcon === "pencil" && <Pencil size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-2 font-medium">{user.type}</td>
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
                    {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, filteredUsers.length)}
                  </strong>{" "}
                  of <strong>{filteredUsers.length}</strong>
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
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Card className="flex-1 p-4">
            <CardContent className="flex flex-col gap-4">Practice Areas</CardContent>
          </Card>
          <Card className="flex-1 p-4">
            <CardContent className="flex flex-col gap-4">Integrations</CardContent>
          </Card>
        </div>
        <div className="flex gap-4">
          <Card className="flex-1 p-4">
            <CardContent className="flex flex-col gap-4">Tech Stack</CardContent>
          </Card>
          <Card className="flex-1 p-4">
            <CardContent className="flex flex-col gap-4">Lawbrokr Features</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
