"use client";

import { useState } from "react";
import { Sidebar } from "./ui/Sidebar";
import { Header } from "./ui/Header";

import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/datepicker";
import { UsersTable } from "./ui/UsersTable";
import { PieChart } from "./ui/PieChart";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col border-x">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />

      <div className="flex-1 min-h-0 flex relative">
        <Sidebar open={sidebarOpen} />

        <div className="w-full p-4 overflow-auto @container flex flex-col gap-4">
          <Card className="p-4">
            <CardContent className="flex gap-4 justify-between items-center">
              <h1 className="text-xl font-bold leading-[1.25]">
                Law Firm Name
              </h1>
              <div>
                <DateRangePicker
                  labels={{ start: "Start Date", end: "End Date" }}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(s, e) => {
                    setStartDate(s);
                    setEndDate(e);
                  }}
                />
              </div>
            </CardContent>
          </Card>
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
              <CardContent className="flex">
                <div className="flex flex-col gap-2">
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    Conversion Rate
                  </p>
                  <p className="font-sans font-normal text-2xl leading-8 tracking-normal">
                    10%
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    10% increase
                    <br />
                    last month
                  </p>
                </div>
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
