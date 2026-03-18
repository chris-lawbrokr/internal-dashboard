"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

interface TableToolbarProps {
  title?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  wrapperClassName?: string;
}

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & TableToolbarProps
>(
  (
    {
      className,
      title,
      searchPlaceholder,
      searchValue,
      onSearchChange,
      page,
      pageSize,
      totalItems,
      totalPages,
      onPageChange,
      toolbar,
      footer,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations("table");
    return (
      <div className={cn("relative w-full min-w-0 rounded-xl bg-card text-card-foreground shadow-[0_1px_2px_0_rgba(29,41,61,0.05)]", wrapperClassName)}>
        {toolbar != null
          ? <div className="p-4 pb-0">{toolbar}</div>
          : (title || onSearchChange) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 pb-0 overflow-x-auto">
                {title && (
                  <h3 className="text-base font-semibold px-2">{title}</h3>
                )}
                {onSearchChange && (
                  <div className="relative ml-auto">
                    <Search
                      size={16}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      aria-label={searchPlaceholder}
                      placeholder={searchPlaceholder}
                      value={searchValue ?? ""}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="h-8 w-48 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                )}
              </div>
            )}
        <div className="overflow-auto p-4">
          <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
          />
        </div>
        {footer != null
          ? <div className="px-4 pb-4">{footer}</div>
          : onPageChange &&
            totalPages != null &&
            page != null &&
            totalPages > 1 &&
            totalItems != null &&
            pageSize != null && (
              <div className="px-4 pb-4">
                <TablePagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                />
              </div>
            )}
      </div>
    );
  },
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b transition-colors hover:bg-muted/50", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-3 text-left align-middle font-medium text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-3 align-middle", className)} {...props} />
));
TableCell.displayName = "TableCell";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  info?: React.ReactNode;
}

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  info,
}: TablePaginationProps) {
  const t = useTranslations("table");
  const tc = useTranslations("common");
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
      {info ?? (
        <span className="text-muted-foreground">
          {t("showing")}{" "}
          <span className="font-bold">
            {start}-{end}
          </span>{" "}
          {t("of")} <span className="font-bold">{totalItems}</span>
        </span>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex-1 sm:flex-none flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {tc("back")}
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex-1 sm:flex-none flex items-center justify-center rounded-md border border-[#3b2559] px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {tc("next")}
        </button>
      </div>
    </div>
  );
}

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";
