"use client";

import { useTranslations } from "next-intl";
import {
  ConversionRatesOverPeriodsChart,
  FunnelsTable,
} from "@/app/ui/PerformanceCharts";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from "@/app/ui/PieChart";
import { LineChart } from "@/app/ui/LineChart";

export function PerformanceTab() {
  const t = useTranslations("dashboard");

  return (
    <>
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

      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4">
        <ConversionRatesOverPeriodsChart />
        <FunnelsTable />
      </div>
    </>
  );
}
