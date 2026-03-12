"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eraser,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

// ── Helpers ──────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function startDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = date.getTime();
  return t > start.getTime() && t < end.getTime();
}

function today(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ── useDropdownAlign ────────────────────────────────────────────────

function useDropdownAlign(
  containerRef: React.RefObject<HTMLElement | null>,
  dropdownRef: React.RefObject<HTMLElement | null>,
  open: boolean,
) {
  const [align, setAlign] = React.useState<"left" | "right">("left");

  React.useEffect(() => {
    if (!open || !containerRef.current || !dropdownRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const dropdown = dropdownRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (container.left + dropdown.width > viewportWidth - 8) {
      setAlign("right");
    } else {
      setAlign("left");
    }
  }, [open, containerRef, dropdownRef]);

  return align;
}

// ── DatePickerInput ─────────────────────────────────────────────────

export interface DatePickerInputProps {
  label?: string;
  required?: boolean;
  tooltip?: string;
  value?: Date | null;
  placeholder?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const DatePickerInput = React.forwardRef<
  HTMLButtonElement,
  DatePickerInputProps
>(
  (
    { label, required, value, placeholder, onClick, disabled },
    ref,
  ) => {
    const t = useTranslations("datepicker");
    const resolvedPlaceholder = placeholder ?? t("selectDate");

    function formatDate(date: Date): string {
      const shortMonths: string[] = t.raw("shortMonths");
      const day = date.getDate();
      const month = shortMonths[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-left flex items-center gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
            !disabled && "cursor-pointer",
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">
            {value ? formatDate(value) : resolvedPlaceholder}
          </span>
        </button>
      </div>
    );
  },
);
DatePickerInput.displayName = "DatePickerInput";

// ── Calendar ────────────────────────────────────────────────────────

export interface CalendarProps {
  month: number;
  year: number;
  selectedStart?: Date | null;
  selectedEnd?: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (month: number, year: number) => void;
  showNav?: "left" | "right" | "both" | "none";
  startClassName?: string;
  endClassName?: string;
}

export function Calendar({
  month,
  year,
  selectedStart = null,
  selectedEnd = null,
  onDateSelect,
  onMonthChange,
  showNav = "both",
  startClassName = "bg-primary text-primary-foreground hover:bg-primary/90",
  endClassName = "bg-primary text-primary-foreground hover:bg-primary/90",
}: CalendarProps) {
  const t = useTranslations("datepicker");
  const months: string[] = t.raw("months");
  const weekdays: string[] = t.raw("weekdays");

  const totalDays = daysInMonth(year, month);
  const firstDay = startDayOfWeek(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevDays = daysInMonth(prevYear, prevMonth);

  const cells: Array<{
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  }> = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevDays - i,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
    });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, month, year, isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      day: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
    });
  }

  function goPrev() {
    if (month === 0) onMonthChange(11, year - 1);
    else onMonthChange(month - 1, year);
  }

  function goNext() {
    if (month === 11) onMonthChange(0, year + 1);
    else onMonthChange(month + 1, year);
  }

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const [monthDropdownOpen, setMonthDropdownOpen] = React.useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = React.useState(false);
  const monthDropdownRef = React.useRef<HTMLDivElement>(null);
  const yearDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!monthDropdownOpen && !yearDropdownOpen) return;
    function handler(e: MouseEvent) {
      if (
        monthDropdownOpen &&
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(e.target as Node)
      ) {
        setMonthDropdownOpen(false);
      }
      if (
        yearDropdownOpen &&
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(e.target as Node)
      ) {
        setYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [monthDropdownOpen, yearDropdownOpen]);

  return (
    <div className="w-[252px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        {showNav === "left" || showNav === "both" ? (
          <button
            type="button"
            onClick={goPrev}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
            aria-label={t("previousMonth")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-7" />
        )}
        <div className="flex items-center gap-1">
          {/* Month dropdown */}
          <div ref={monthDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMonthDropdownOpen((o) => !o);
                setYearDropdownOpen(false);
              }}
              className="flex items-center gap-0.5 text-sm font-medium rounded px-1.5 py-0.5 hover:bg-muted cursor-pointer"
            >
              {months[month]}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {monthDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 rounded-md border border-border bg-popover shadow-md py-1 max-h-[200px] overflow-y-auto w-[120px]">
                {months.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onMonthChange(i, year);
                      setMonthDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-sm text-left hover:bg-muted cursor-pointer",
                      i === month && "bg-muted font-medium",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Year dropdown */}
          <div ref={yearDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setYearDropdownOpen((o) => !o);
                setMonthDropdownOpen(false);
              }}
              className="flex items-center gap-0.5 text-sm font-medium rounded px-1.5 py-0.5 hover:bg-muted cursor-pointer"
            >
              {year}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {yearDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 rounded-md border border-border bg-popover shadow-md py-1 max-h-[200px] overflow-y-auto w-[80px]">
                {yearRange.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      onMonthChange(month, y);
                      setYearDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-sm text-left hover:bg-muted cursor-pointer",
                      y === year && "bg-muted font-medium",
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {showNav === "right" || showNav === "both" ? (
          <button
            type="button"
            onClick={goNext}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
            aria-label={t("nextMonth")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-7" />
        )}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {weekdays.map((wd) => (
          <div
            key={wd}
            className="h-8 flex items-center justify-center text-xs text-muted-foreground font-medium"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const cellDate = new Date(cell.year, cell.month, cell.day);
          const isStart = selectedStart
            ? isSameDay(cellDate, selectedStart)
            : false;
          const isEnd = selectedEnd ? isSameDay(cellDate, selectedEnd) : false;
          const isSelected = isStart || isEnd;
          const inRange = isInRange(cellDate, selectedStart, selectedEnd);
          const isToday = isSameDay(cellDate, today());

          return (
            <button
              key={i}
              type="button"
              onClick={() => onDateSelect(cellDate)}
              className={cn(
                "h-9 w-full mx-auto flex items-center justify-center text-sm cursor-pointer",
                !cell.isCurrentMonth && "text-muted-foreground/40",
                cell.isCurrentMonth &&
                  !isSelected &&
                  !inRange &&
                  "hover:bg-muted",
                isStart && startClassName,
                isEnd && !isStart && endClassName,
                isStart && isEnd && "rounded-xl",
                isStart && !isEnd && !selectedEnd && "rounded-xl",
                isStart && !isEnd && selectedEnd && "rounded-l",
                isEnd && !isStart && "rounded-r",
                inRange && !isSelected && "bg-primary/10",
                isToday && !isSelected && "",
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

// ── DatePicker (single date) ────────────────────────────────────────

export interface DatePickerProps {
  label?: string;
  required?: boolean;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  label,
  required,
  value = null,
  onChange,
  placeholder,
  disabled,
}: DatePickerProps) {
  const t = useTranslations("datepicker");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const align = useDropdownAlign(containerRef, dropdownRef, open);
  const [viewMonth, setViewMonth] = React.useState(
    value ? value.getMonth() : new Date().getMonth(),
  );
  const [viewYear, setViewYear] = React.useState(
    value ? value.getFullYear() : new Date().getFullYear(),
  );

  React.useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function formatDate(date: Date): string {
    const shortMonths: string[] = t.raw("shortMonths");
    const day = date.getDate();
    const month = shortMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function handleSelect(date: Date) {
    onChange?.(date);
    setOpen(false);
  }

  function handleClear() {
    onChange?.(null);
    setOpen(false);
  }

  function handleToday() {
    const td = today();
    onChange?.(td);
    setViewMonth(td.getMonth());
    setViewYear(td.getFullYear());
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !disabled && "cursor-pointer",
        )}
        aria-label={open ? t("closeDatePicker") : t("openDatePicker")}
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 mt-2 rounded-lg border border-border bg-popover p-3 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border">
            <span className="flex-1 text-sm text-muted-foreground truncate">
              {value ? formatDate(value) : t("noDateSelected")}
            </span>
            <button
              type="button"
              onClick={handleToday}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
              aria-label={t("today")}
              title={t("today")}
            >
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
              aria-label={t("clear")}
              title={t("clear")}
            >
              <Eraser className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
              aria-label={t("closeDatePicker")}
              title={t("closeDatePicker")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <Calendar
            month={viewMonth}
            year={viewYear}
            selectedStart={value}
            onDateSelect={handleSelect}
            onMonthChange={(m, y) => {
              setViewMonth(m);
              setViewYear(y);
            }}
          />
        </div>
      )}
    </div>
  );
}
DatePicker.displayName = "DatePicker";

// ── DateRangePicker ─────────────────────────────────────────────────

export interface DateRangePickerProps {
  labels?: { start?: string; end?: string };
  required?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (start: Date | null, end: Date | null) => void;
  disabled?: boolean;
  startClassName?: string;
  endClassName?: string;
}

export function DateRangePicker({
  labels,
  required,
  startDate = null,
  endDate = null,
  onChange,
  disabled,
  startClassName,
  endClassName,
}: DateRangePickerProps) {
  const t = useTranslations("datepicker");
  const resolvedLabels = {
    start: labels?.start ?? t("start"),
    end: labels?.end ?? t("end"),
  };

  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const align = useDropdownAlign(containerRef, dropdownRef, open);
  const [selecting, setSelecting] = React.useState<"start" | "end">("start");

  const now = new Date();
  const [leftMonth, setLeftMonth] = React.useState(
    startDate ? startDate.getMonth() : now.getMonth(),
  );
  const [leftYear, setLeftYear] = React.useState(
    startDate ? startDate.getFullYear() : now.getFullYear(),
  );

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  React.useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function formatDate(date: Date): string {
    const shortMonths: string[] = t.raw("shortMonths");
    const day = date.getDate();
    const month = shortMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function handleDateSelect(date: Date) {
    if (selecting === "start") {
      if (endDate && date.getTime() > endDate.getTime()) {
        onChange?.(date, null);
      } else {
        onChange?.(date, endDate);
      }
      setSelecting("end");
    } else {
      if (startDate && date.getTime() < startDate.getTime()) {
        onChange?.(date, endDate);
        setSelecting("end");
      } else {
        onChange?.(startDate, date);
        setSelecting("start");
      }
    }
  }

  function handleClear() {
    onChange?.(null, null);
    setSelecting("start");
  }

  function handleToday() {
    const td = today();
    onChange?.(td, td);
    setLeftMonth(td.getMonth());
    setLeftYear(td.getFullYear());
    setSelecting("start");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setOpen((o) => !o);
        }}
        disabled={disabled}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !disabled && "cursor-pointer",
        )}
        aria-label={open ? t("closeDatePicker") : t("openDatePicker")}
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 mt-2 rounded-lg border border-border bg-popover p-4 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border">
            <span className="flex-1 text-sm text-muted-foreground truncate">
              {startDate ? formatDate(startDate) : t("start")}{" — "}{endDate ? formatDate(endDate) : t("end")}
            </span>
            <button
              type="button"
              onClick={handleToday}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("today")}
              title={t("today")}
            >
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("clear")}
              title={t("clear")}
            >
              <Eraser className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("closeDatePicker")}
              title={t("closeDatePicker")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="hidden md:flex gap-4">
            <Calendar
              month={leftMonth}
              year={leftYear}
              selectedStart={startDate}
              selectedEnd={endDate}
              onDateSelect={handleDateSelect}
              onMonthChange={(m, y) => {
                setLeftMonth(m);
                setLeftYear(y);
              }}
              showNav="left"
              startClassName={startClassName}
              endClassName={endClassName}
            />
            <div className="w-px bg-border" />
            <Calendar
              month={rightMonth}
              year={rightYear}
              selectedStart={startDate}
              selectedEnd={endDate}
              onDateSelect={handleDateSelect}
              onMonthChange={(m, y) => {
                // Right is always left + 1 month, so derive left from the right selection
                const newLeftMonth = m === 0 ? 11 : m - 1;
                const newLeftYear = m === 0 ? y - 1 : y;
                setLeftMonth(newLeftMonth);
                setLeftYear(newLeftYear);
              }}
              showNav="right"
              startClassName={startClassName}
              endClassName={endClassName}
            />
          </div>
          <div className="md:hidden">
            <Calendar
              month={leftMonth}
              year={leftYear}
              selectedStart={startDate}
              selectedEnd={endDate}
              onDateSelect={handleDateSelect}
              onMonthChange={(m, y) => {
                setLeftMonth(m);
                setLeftYear(y);
              }}
              showNav="both"
              startClassName={startClassName}
              endClassName={endClassName}
            />
          </div>
        </div>
      )}
    </div>
  );
}
DateRangePicker.displayName = "DateRangePicker";
