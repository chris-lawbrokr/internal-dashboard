"use client";

import { useState } from "react";
import { Sidebar } from "./ui/Sidebar";
import { Header } from "./ui/Header";

import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/datepicker";
import { UsersTable } from "./ui/UsersTable";
import { PieChart } from "./ui/PieChart";
import { LineChart } from "./ui/LineChart";

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
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <Card className="flex-1 p-4">
                <CardContent className="flex flex-col gap-2">
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    Total Visits
                  </p>
                  <p className="font-sans font-normal text-2xl leading-8 tracking-normal">
                    4,268
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    10% increase last month
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1 p-4">
                <CardContent className="flex flex-col gap-2">
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    Total Responses
                  </p>
                  <p className="font-sans font-normal text-2xl leading-8 tracking-normal">
                    426
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    10% increase last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="flex-1 min-w-0 p-4 flex">
              <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
                <LineChart />
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-0 p-4">
              <CardContent className="flex h-full gap-4">
                <div className="w-1/3 min-w-0 flex flex-col gap-2">
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    Conversion Rate
                  </p>
                  <p className="font-sans font-normal text-4xl leading-8 tracking-normal">
                    10%
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    10% increase
                    <br />
                    last month
                  </p>
                </div>
                <div className="w-2/3 min-w-0 overflow-hidden">
                  <PieChart />
                </div>
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
