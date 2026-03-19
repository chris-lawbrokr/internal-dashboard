"use client";

import { Card, CardContent } from "@/components/ui/card";

export function WebsiteStatsCard() {
  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold">flowbite.com</span>
            <p className="text-[11px] text-muted-foreground">31 Nov - 31 Dec</p>
          </div>
          <button className="text-xs text-muted-foreground border rounded px-2 py-1 hover:bg-muted cursor-pointer">
            Export
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button className="text-[11px] font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded cursor-pointer">
            Organic
          </button>
          <button className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded hover:bg-muted cursor-pointer">
            Paid
          </button>
        </div>
      </CardContent>

      <div className="flex flex-col gap-3 mt-4 flex-1">
        <div className="border rounded-lg p-3">
          <p className="text-[11px] text-muted-foreground">Users</p>
          <p className="text-xl font-bold">232.7k</p>
          <p className="text-[11px] text-emerald-600">↑ 2% vs last month</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-[11px] text-muted-foreground">Customers</p>
          <p className="text-xl font-bold">238</p>
          <p className="text-[11px] text-red-500">↓ 4.56% vs last month</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-[11px] text-muted-foreground">Revenue</p>
          <p className="text-xl font-bold">$4268</p>
          <p className="text-[11px] text-emerald-600">↑ 2% vs last month</p>
        </div>
      </div>

      <div className="flex items-center justify-center mt-2 pt-2 border-t">
        <a href="#" className="text-xs text-indigo-600 font-medium hover:underline">
          View report
        </a>
      </div>
    </Card>
  );
}
