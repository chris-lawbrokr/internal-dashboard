"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePickerWithPresets } from "@/components/ui/datepicker";
import { useDateRange } from "@/lib/useDateRange";

interface PageHeaderProps {
  title: string;
  back?: string;
  showDateRange?: boolean;
}

export function PageHeader({
  title,
  back,
  showDateRange = true,
}: PageHeaderProps) {
  const router = useRouter();
  const { setDateRange } = useDateRange();

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        justify-start
        lg:flex-row
        lg:items-start
        lg:justify-between
        p-4
        py-8
    "
    >
      <div
        className="
          flex
          flex-row
          gap-4
          items-center
          max-sm:flex-col
          max-sm:items-start
      "
      >
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
        <div className="max-lg:w-full [&>div]:max-lg:w-full [&>div>button:first-child]:max-lg:w-full">
          <DateRangePickerWithPresets
            defaultPreset="90d"
            onChange={(start, end) => setDateRange(start, end)}
          />
        </div>
      )}
    </div>
  );
}
