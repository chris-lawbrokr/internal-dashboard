"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useState } from "react";
import { Sidebar } from "@/app/ui/Sidebar";
import { Header } from "@/app/ui/Header";

import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/datepicker";
import { GaugeChart } from "@/app/ui/GaugeChart";

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
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <h1 className="text-xl font-bold leading-[1.25]">
                  Law Firm Name
                </h1>
              </div>
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
            <GaugeChart
              title="Onboarding Health"
              label="Good"
              value={75}
              color="#7c3aed"
              href="#"
            />
            <GaugeChart
              title="Performance Health"
              label="Fair"
              value={50}
              color="#a855f7"
              href="#"
            />
            <GaugeChart
              title="Website Health"
              label="Poor"
              value={25}
              color="#d8b4fe"
              href="#"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
