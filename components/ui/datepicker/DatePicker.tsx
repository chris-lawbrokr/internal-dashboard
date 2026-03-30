"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
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
>(({ label, required, value, placeholder, onClick, disabled }, ref) => {
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
});
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
  startClassName?: string | undefined;
  endClassName?: string | undefined;
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
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
  minDate = null,
  maxDate = null,
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

  const canGoPrev = !minDate || year > minDate.getFullYear() || (year === minDate.getFullYear() && month > minDate.getMonth());
  const canGoNext = !maxDate || year < maxDate.getFullYear() || (year === maxDate.getFullYear() && month < maxDate.getMonth());

  function goPrev() {
    if (!canGoPrev) return;
    if (month === 0) onMonthChange(11, year - 1);
    else onMonthChange(month - 1, year);
  }

  function goNext() {
    if (!canGoNext) return;
    if (month === 11) onMonthChange(0, year + 1);
    else onMonthChange(month + 1, year);
  }

  const minYear = minDate ? minDate.getFullYear() : new Date().getFullYear() - 10;
  const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10;
  const yearRange = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

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
            disabled={!canGoPrev}
            className={cn("h-7 w-7 flex items-center justify-center rounded", canGoPrev ? "hover:bg-muted cursor-pointer" : "opacity-30 cursor-not-allowed")}
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
                {months.map((m, i) => {
                  const disabled = (minDate && year === minDate.getFullYear() && i < minDate.getMonth()) || (maxDate && year === maxDate.getFullYear() && i > maxDate.getMonth());
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!!disabled}
                      onClick={() => {
                        onMonthChange(i, year);
                        setMonthDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-sm text-left",
                        disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-muted cursor-pointer",
                        i === month && "bg-muted font-medium",
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
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
            disabled={!canGoNext}
            className={cn("h-7 w-7 flex items-center justify-center rounded", canGoNext ? "hover:bg-muted cursor-pointer" : "opacity-30 cursor-not-allowed")}
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
            className="h-8 min-w-9 flex items-center justify-center text-xs text-muted-foreground font-medium"
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
          const isDisabled = (minDate && cellDate.getTime() < minDate.getTime()) || (maxDate && cellDate.getTime() > maxDate.getTime());

          return (
            <button
              key={i}
              type="button"
              disabled={!!isDisabled}
              onClick={() => onDateSelect(cellDate)}
              className={cn(
                "h-9 min-w-9 w-full mx-auto flex items-center justify-center text-sm",
                isDisabled && "opacity-30 cursor-not-allowed",
                !isDisabled && "cursor-pointer",
                !cell.isCurrentMonth && !isDisabled && "text-muted-foreground/40",
                cell.isCurrentMonth &&
                  !isSelected &&
                  !inRange &&
                  !isDisabled &&
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
  label: _label,
  required: _required,
  value = null,
  onChange,
  placeholder: _placeholder,
  disabled,
}: DatePickerProps) {
  void _label;
  void _required;
  void _placeholder;
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
            "absolute z-50 mt-2 rounded-lg border border-border bg-popover p-2 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center mb-2 pb-2 border-b border-border">
            <span className="hidden md:block flex-1 text-sm text-muted-foreground truncate">
              {value ? formatDate(value) : t("noDateSelected")}
            </span>
            <span className="flex-1 md:hidden" />
            <button
              type="button"
              onClick={handleToday}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("today")}
              title={t("today")}
            >
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("clear")}
              title={t("clear")}
            >
              <Eraser className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
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
          <div className="md:hidden mt-2 pt-2 border-t border-border text-sm text-center text-muted-foreground">
            {value ? formatDate(value) : t("noDateSelected")}
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
  startClassName?: string | undefined;
  endClassName?: string | undefined;
}

export function DateRangePicker({
  labels: _labels,
  required: _required,
  startDate = null,
  endDate = null,
  onChange,
  disabled,
  startClassName,
  endClassName,
}: DateRangePickerProps) {
  const t = useTranslations("datepicker");
  void _labels;
  void _required;

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
            "absolute z-50 mt-2 rounded-lg border border-border bg-popover p-2 md:p-4 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center mb-2 pb-2 border-b border-border">
            <span className="hidden md:block flex-1 text-sm text-muted-foreground truncate">
              {startDate ? formatDate(startDate) : t("start")}
              {" — "}
              {endDate ? formatDate(endDate) : t("end")}
            </span>
            <span className="flex-1 md:hidden" />
            <button
              type="button"
              onClick={handleToday}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("today")}
              title={t("today")}
            >
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("clear")}
              title={t("clear")}
            >
              <Eraser className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
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
          <div className="md:hidden mt-2 pt-2 border-t border-border text-sm text-center text-muted-foreground">
            {startDate ? formatDate(startDate) : t("start")}
            {" — "}
            {endDate ? formatDate(endDate) : t("end")}
          </div>
        </div>
      )}
    </div>
  );
}
DateRangePicker.displayName = "DateRangePicker";

// ── DateRangePickerWithPresets ──────────────────────────────────────

// type Preset = "90d" | "30d" | "all" | "custom";

function subDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface DateRangePickerWithPresetsProps {
  defaultPreset?: "30d" | "90d" | "all";
  presets?: Array<{ key: string; label: string; days: number | null }>;
  onChange?: (start: Date | null, end: Date | null, preset: string) => void;
  disabled?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
}

export function DateRangePickerWithPresets({
  defaultPreset = "90d",
  presets = [
    { key: "30d", label: "30 Days", days: 30 },
    { key: "90d", label: "90 Days", days: 90 },
    { key: "all", label: "All Time", days: null },
  ],
  onChange,
  disabled,
  minDate = null,
  maxDate = null,
}: DateRangePickerWithPresetsProps) {
  const t = useTranslations("datepicker");

  const allStart = minDate ?? subDays(365);
  const allEnd = maxDate ?? today();
  const defaultStart =
    defaultPreset === "all" ? allStart : subDays(defaultPreset === "30d" ? 30 : 90);
  const defaultEnd = defaultPreset === "all" ? allEnd : today();

  const [open, setOpen] = React.useState(false);
  const [preset, setPreset] = React.useState<string>(defaultPreset);
  const [startDate, setStartDate] = React.useState<Date | null>(defaultStart);
  const [endDate, setEndDate] = React.useState<Date | null>(defaultEnd);
  const [selecting, setSelecting] = React.useState<"start" | "end">("start");
  const [presetsOpen, setPresetsOpen] = React.useState(false);
  const [viewMonth, setViewMonth] = React.useState(new Date().getMonth());
  const [viewYear, setViewYear] = React.useState(new Date().getFullYear());
  const containerRef = React.useRef<HTMLDivElement>(null);

  function handleClose() {
    if (!startDate || !endDate) {
      const fallback = presets.find((p) => p.key === "90d") ?? presets[0];
      if (fallback) {
        applyPreset(fallback);
        return;
      }
    }
    setOpen(false);
    setPresetsOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, startDate, endDate]);

  function applyPreset(p: { key: string; days: number | null }) {
    setPreset(p.key);
    const newStart = p.days != null ? subDays(p.days) : allStart;
    const newEnd = p.days != null ? today() : allEnd;
    setStartDate(newStart);
    setEndDate(newEnd);
    onChange?.(newStart, newEnd, p.key);
    setOpen(false);
    setPresetsOpen(false);
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
        onChange?.(startDate, date, "custom");
      }
    }
  }

  function handleClear() {
    setStartDate(null);
    setEndDate(null);
    setPreset("custom");
    setSelecting("start");
    onChange?.(null, null, "custom");
  }

  function handleToday() {
    const td = today();
    setStartDate(td);
    setEndDate(td);
    setPreset("custom");
    setViewMonth(td.getMonth());
    setViewYear(td.getFullYear());
    onChange?.(td, td, "custom");
  }

  const activePreset = presets.find((p) => p.key === preset);
  const label = activePreset
    ? activePreset.label
    : startDate && endDate
      ? `${formatShort(startDate)} – ${formatShort(endDate)}`
      : t("selectDate");

  const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && (open ? handleClose() : setOpen(true))}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !disabled && "cursor-pointer",
        )}
      >
        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 ml-auto" />
      </button>

      {open && (
        <div className="absolute right-0 w-[268px] md:w-auto z-50 mt-2 rounded-lg border border-border bg-popover p-2 md:p-4 shadow-lg">
          {/* Header: range display + action icons */}
          <div className="flex items-center mb-2 pb-2 border-b border-border">
            <span className="flex-1 min-w-0 text-sm text-muted-foreground truncate">
              {startDate ? formatShort(startDate) : t("start")}
              {" — "}
              {endDate ? formatShort(endDate) : t("end")}
            </span>
            {/* Presets dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setPresetsOpen((o) => !o)}
                className={cn(
                  "h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer",
                  presetsOpen && "bg-muted",
                )}
                aria-label="Presets"
                title="Presets"
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
              </button>
              {presetsOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 rounded-md border border-border bg-popover shadow-md py-1 w-[120px]">
                  {presets.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={cn(
                        "w-full px-3 py-1.5 text-sm text-left cursor-pointer hover:bg-muted",
                        preset === p.key && "font-medium bg-muted",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleToday}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("today")}
              title={t("today")}
            >
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("clear")}
              title={t("clear")}
            >
              <Eraser className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="h-7 w-7 min-h-7 min-w-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0"
              aria-label={t("closeDatePicker")}
              title={t("closeDatePicker")}
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
              minDate={minDate}
              maxDate={maxDate}
            />
            <div className="w-px bg-border" />
            <Calendar
              month={rightMonth}
              year={rightYear}
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
              minDate={minDate}
              maxDate={maxDate}
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
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
DateRangePickerWithPresets.displayName = "DateRangePickerWithPresets";
