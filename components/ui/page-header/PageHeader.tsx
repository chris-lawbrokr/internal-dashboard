"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/datepicker";
import { useDateRange } from "@/lib/useDateRange";

interface PageHeaderProps {
  title: string;
  /** Pass a route string to show a back button, e.g. back="/" or back="/accounts" */
  back?: string;
  showDateRange?: boolean;
}

export function PageHeader({
  title,
  back,
  showDateRange = true,
}: PageHeaderProps) {
  const router = useRouter();
  const { startDate, endDate, setDateRange } = useDateRange();

  return (
    <div className="flex gap-4 items-center justify-between py-4">
      <div className="flex gap-4 items-center">
        {back && (
          <div>
            <Button
              variant="outline"
              onClick={() => router.push(back)}
              aria-label="Go back"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        )}
        <h1 className="text-4xl font-bold leading-9 -tracking-tight text-brand-dark">
          {title}
        </h1>
      </div>
      {showDateRange && (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={setDateRange}
        />
      )}
    </div>
  );
}
