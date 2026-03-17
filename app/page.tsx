"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Calendar as CalendarIcon, ChevronDown, CalendarCheck, Eraser, X, Clock } from "lucide-react";
import { Sidebar, SidebarOpenButton } from "@/app/ui/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { AccountsTable } from "@/app/ui/AccountsTable";
import { PieChart } from "@/app/ui/PieChart";
import { LineChart } from "@/app/ui/LineChart";
import { SparklineChart } from "@/app/ui/SparklineChart";
import { Calendar } from "@/components/ui/datepicker";

type Preset = "90d" | "30d" | "all" | "custom";

function subDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(false);
  const [preset, setPreset] = useState<Preset>("90d");
  const [startDate, setStartDate] = useState<Date | null>(subDays(90));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const dateRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!dateOpen) return;
    function handler(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dateOpen]);

  function applyPreset(p: Preset) {
    setPreset(p);
    if (p === "90d") {
      setStartDate(subDays(90));
      setEndDate(new Date());
    } else if (p === "30d") {
      setStartDate(subDays(30));
      setEndDate(new Date());
    } else if (p === "all") {
      setStartDate(null);
      setEndDate(null);
    }
    if (p !== "custom") setDateOpen(false);
  }

  function handleDateSelect(date: Date) {
    setPreset("custom");
    if (selecting === "start") {
      if (endDate && date.getTime() > endDate.getTime()) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setStartDate(date);
      }
      setSelecting("end");
    } else {
      if (startDate && date.getTime() < startDate.getTime()) {
        setStartDate(date);
        setSelecting("end");
      } else {
        setEndDate(date);
        setSelecting("start");
      }
    }
  }

  const presetLabel =
    preset === "90d"
      ? t("last90Days")
      : preset === "30d"
        ? "Last 30 Days"
        : preset === "all"
          ? "All Time"
          : startDate && endDate
            ? `${formatShort(startDate)} – ${formatShort(endDate)}`
            : "Custom";

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className="relative flex-1 min-w-0 flex flex-col bg-[#fbfbfb]">
        {!sidebarOpen && (
          <SidebarOpenButton onClick={() => setSidebarOpen(true)} />
        )}
        <div className="flex-1 min-h-0 p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6">
          {/* Welcome + Date Filter */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {t("welcome", { name: "Penelope" })}
            </h1>
            <div ref={dateRef} className="relative">
              <button
                type="button"
                onClick={() => setDateOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted cursor-pointer"
              >
                <CalendarIcon size={14} />
                {presetLabel}
                <ChevronDown size={14} />
              </button>
              {dateOpen && (
                <div className="absolute right-0 z-50 mt-2 rounded-lg border border-border bg-popover p-2 md:p-4 shadow-lg">
                  {/* Header: range display + actions */}
                  <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border">
                    <span className="flex-1 text-sm text-muted-foreground truncate">
                      {startDate ? formatShort(startDate) : "Start"}
                      {" — "}
                      {endDate ? formatShort(endDate) : "End"}
                    </span>
                    {/* Presets dropdown */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setPresetsOpen((o) => !o)}
                        className={`h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer ${presetsOpen ? "bg-muted" : ""}`}
                        aria-label="Presets"
                        title="Presets"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {presetsOpen && (
                        <div className="absolute right-0 top-full mt-1 z-50 rounded-md border border-border bg-popover shadow-md py-1 w-[120px]">
                          {(["30d", "90d", "all"] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                applyPreset(p);
                                setPresetsOpen(false);
                              }}
                              className={`w-full px-3 py-1.5 text-sm text-left cursor-pointer hover:bg-muted ${
                                preset === p ? "font-medium bg-muted" : ""
                              }`}
                            >
                              {p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "All Time"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const td = new Date();
                        setStartDate(td);
                        setEndDate(td);
                        setPreset("custom");
                        setViewMonth(td.getMonth());
                        setViewYear(td.getFullYear());
                      }}
                      className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
                      aria-label="Today"
                      title="Today"
                    >
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setPreset("custom");
                        setSelecting("start");
                      }}
                      className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
                      aria-label="Clear"
                      title="Clear"
                    >
                      <Eraser className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateOpen(false)}
                      className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
                      aria-label="Close"
                      title="Close"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>


                  {/* Dual calendars (desktop) */}
                  <div className="hidden md:flex gap-4">
                    <Calendar
                      month={viewMonth}
                      year={viewYear}
                      selectedStart={startDate}
                      selectedEnd={endDate}
                      onDateSelect={handleDateSelect}
                      onMonthChange={(m, y) => {
                        setViewMonth(m);
                        setViewYear(y);
                      }}
                      showNav="left"
                    />
                    <div className="w-px bg-border" />
                    <Calendar
                      month={viewMonth === 11 ? 0 : viewMonth + 1}
                      year={viewMonth === 11 ? viewYear + 1 : viewYear}
                      selectedStart={startDate}
                      selectedEnd={endDate}
                      onDateSelect={handleDateSelect}
                      onMonthChange={(m, y) => {
                        const newLeft = m === 0 ? 11 : m - 1;
                        const newLeftYear = m === 0 ? y - 1 : y;
                        setViewMonth(newLeft);
                        setViewYear(newLeftYear);
                      }}
                      showNav="right"
                    />
                  </div>

                  {/* Single calendar (mobile) */}
                  <div className="md:hidden">
                    <Calendar
                      month={viewMonth}
                      year={viewYear}
                      selectedStart={startDate}
                      selectedEnd={endDate}
                      onDateSelect={handleDateSelect}
                      onMonthChange={(m, y) => {
                        setViewMonth(m);
                        setViewYear(y);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="min-w-[320px] flex flex-col gap-4 @xl:flex-row">
            {/* Left: Stacked stat cards */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <Card className="flex-1 p-4 @container/stat">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {t("totalVisits")}
                    </p>
                    <p className="text-2xl font-bold">4,268</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                      {t("vsLastMonth")}
                    </p>
                  </div>
                  <div className="hidden @[200px]/stat:block">
                    <SparklineChart
                      data={[30, 40, 35, 50, 45, 55, 60]}
                      color="#bcbc95"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 p-4 @container/stat2">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {t("totalResponses")}
                    </p>
                    <p className="text-2xl font-bold">426</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                      {t("vsLastMonth")}
                    </p>
                  </div>
                  <div className="hidden @[200px]/stat2:block">
                    <SparklineChart
                      data={[20, 25, 22, 30, 28, 35, 40]}
                      color="#bcbc95"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle: Area chart */}
            <Card className="flex-[2] min-w-0 p-4 flex">
              <CardContent className="overflow-hidden flex flex-col justify-center flex-1">
                <LineChart />
              </CardContent>
            </Card>

            {/* Right: Conversion rate + donut */}
            <Card className="flex-1 min-w-0 p-4 @container/conv">
              <CardContent className="flex flex-col @[200px]/conv:flex-row @[200px]/conv:items-center @[200px]/conv:justify-between h-full gap-2">
                <div className="flex flex-col gap-1 items-start h-full">
                  <p className="text-sm text-muted-foreground">
                    {t("conversionRate")}
                  </p>
                  <p className="text-3xl font-bold text-[#070043]">10%</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-[#bcbc95]">&#8593; 10%</span>{" "}
                    {t("vsLastMonth")}
                  </p>
                </div>
                <div className="shrink-0 self-center">
                  <PieChart />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts Table */}
          <div className="min-w-[320px]">
            <AccountsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
