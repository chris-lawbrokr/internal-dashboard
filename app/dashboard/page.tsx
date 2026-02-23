"use client";

import { useState } from "react";
import { Sidebar } from "./ui/Sidebar";
import { Header } from "./ui/Header";

import { Card, CardContent } from "@/components/ui/card";
import { UsersTable } from "./ui/UsersTable";
import { PieChart } from "./ui/PieChart";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />

      <div className="flex-1 min-h-0 flex relative">
        <Sidebar open={sidebarOpen} />

        <div className="w-full p-4 overflow-auto @container flex flex-col gap-4">
          <div className="min-w-[320px] flex flex-col gap-4 @xl:flex-row">
            <div className="flex-1 flex flex-col gap-4">
              <Card className="flex-1 p-4">
                <CardContent>Total Visits</CardContent>
              </Card>
              <Card className="flex-1 p-4">
                <CardContent>Total Responses</CardContent>
              </Card>
            </div>

            <Card className="flex-1 p-4">
              <CardContent>Responses</CardContent>
            </Card>

            <Card className="flex-1 p-4">
              <CardContent>
                <PieChart />
              </CardContent>
            </Card>
          </div>

          <div className="min-w-[320px]">
            <UsersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
