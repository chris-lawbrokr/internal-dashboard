"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

// ── Helpers ──────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

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

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = SHORT_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
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

    // If dropdown overflows right edge, align to right
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
    { label, required, value, placeholder = "Select date", onClick, disabled },
    ref,
  ) => {
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
            {value ? formatDate(value) : placeholder}
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
  const totalDays = daysInMonth(year, month);
  const firstDay = startDayOfWeek(year, month);

  // Previous month filler days
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

  return (
    <div className="w-[252px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        {showNav === "left" || showNav === "both" ? (
          <button
            type="button"
            onClick={goPrev}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-7" />
        )}
        <span className="text-sm font-medium">
          {MONTHS[month]} {year}
        </span>
        {showNav === "right" || showNav === "both" ? (
          <button
            type="button"
            onClick={goNext}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-7" />
        )}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((wd) => (
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

  // Click outside
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

  function handleSelect(date: Date) {
    onChange?.(date);
    setOpen(false);
  }

  function handleClear() {
    onChange?.(null);
    setOpen(false);
  }

  function handleToday() {
    const t = today();
    onChange?.(t);
    setViewMonth(t.getMonth());
    setViewYear(t.getFullYear());
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <DatePickerInput
        label={label}
        required={required}
        value={value}
        placeholder={placeholder}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
      />
      {open && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 mt-1 rounded-lg border border-border bg-popover p-3 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
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
          <div className="flex gap-2 mt-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-[#C8C8C8] bg-[#FBFBFB] shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] hover:bg-[#F0F0F0] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-[#3B2559] text-white shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] hover:bg-[#4A3068] cursor-pointer"
            >
              Today
            </button>
          </div>
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
  labels = { start: "Start Date", end: "End Date" },
  required,
  startDate = null,
  endDate = null,
  onChange,
  disabled,
  startClassName,
  endClassName,
}: DateRangePickerProps) {
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

  // Right calendar is always one month ahead of left
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  // Click outside
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
    const t = today();
    onChange?.(t, t);
    setLeftMonth(t.getMonth());
    setLeftYear(t.getFullYear());
    setSelecting("start");
  }

  function goLeftNext() {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear(leftYear + 1);
    } else {
      setLeftMonth(leftMonth + 1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <DatePickerInput
            label={labels.start}
            required={required}
            value={startDate}
            placeholder="Select start date"
            onClick={() => {
              if (disabled) return;
              setSelecting("start");
              setOpen((o) => !o);
            }}
            disabled={disabled}
          />
        </div>
        <span className="h-9 flex items-center text-muted-foreground">—</span>
        <div className="flex-1">
          <DatePickerInput
            label={labels.end}
            required={required}
            value={endDate}
            placeholder="Select end date"
            onClick={() => {
              if (disabled) return;
              setSelecting("end");
              setOpen((o) => !o);
            }}
            disabled={disabled}
          />
        </div>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 mt-1 rounded-lg border border-border bg-popover p-4 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex gap-4">
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
              onMonthChange={() => goLeftNext()}
              showNav="right"
              startClassName={startClassName}
              endClassName={endClassName}
            />
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-[#C8C8C8] bg-[#FBFBFB] shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] hover:bg-[#F0F0F0] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-[#3B2559] text-white shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] hover:bg-[#4A3068] cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
DateRangePicker.displayName = "DateRangePicker";
