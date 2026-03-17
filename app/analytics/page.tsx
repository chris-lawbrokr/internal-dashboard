"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/ui/Sidebar";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/datepicker";
import { UsersTable } from "@/app/ui/UsersTable";
import { PieChart } from "@/app/ui/PieChart";
import { LineChart } from "@/app/ui/LineChart";

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const ta = useTranslations("account");

  return (
    <div className="h-screen w-full overflow-hidden flex border-x">
      <Sidebar />

        <div className="w-full p-4 overflow-auto @container flex flex-col gap-4">
          <Card className="p-4">
            <CardContent className="flex gap-4 justify-between items-center">
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {ta("back")}
                </Link>
                <h1 className="text-xl font-bold leading-[1.25]">
                  Law Firm Name
                </h1>
              </div>
              <div>
                <DateRangePicker
                  labels={{ start: tc("startDate"), end: tc("endDate") }}
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
                    {t("totalVisits")}
                  </p>
                  <p className="font-sans font-normal text-2xl leading-8 tracking-normal">
                    4,268
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    {t("increaseLastMonth", { percent: "10" })}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1 p-4">
                <CardContent className="flex flex-col gap-2">
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    {t("totalResponses")}
                  </p>
                  <p className="font-sans font-normal text-2xl leading-8 tracking-normal">
                    426
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    {t("increaseLastMonth", { percent: "10" })}
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
                    {t("conversionRate")}
                  </p>
                  <p className="font-sans font-normal text-4xl leading-8 tracking-normal">
                    10%
                  </p>
                  <p className="font-sans font-normal text-sm leading-[1.25] tracking-normal">
                    {t("increase", { percent: "10" })}
                    <br />
                    {t("lastMonth")}
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
  );
}
