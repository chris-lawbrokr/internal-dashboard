"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
          ? toolbar
          : (title || onSearchChange) && (
              <div className="flex items-center justify-between gap-4 p-4 pb-0">
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
          ? footer
          : onPageChange &&
            totalPages != null &&
            page != null &&
            totalPages > 1 && (
              <div className="flex items-center px-4 pb-4">
                {totalItems != null && pageSize != null && (
                  <span className="text-sm px-2">
                    {t("showing")}{" "}
                    <span className="font-bold">
                      {(page - 1) * pageSize + 1}-
                      {Math.min(page * pageSize, totalItems)}
                    </span>{" "}
                    {t("of")}{" "}
                    <span className="font-bold">{totalItems}</span>
                  </span>
                )}
                <div className="flex items-center ml-auto border rounded-xl">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="h-8 w-8 flex items-center justify-center text-sm text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-r"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {(() => {
                    const maxVisible = 10;
                    let start = Math.max(
                      1,
                      page - Math.floor(maxVisible / 2),
                    );
                    const end = Math.min(
                      totalPages,
                      start + maxVisible - 1,
                    );
                    start = Math.max(1, end - maxVisible + 1);
                    return Array.from(
                      { length: end - start + 1 },
                      (_, i) => start + i,
                    );
                  })().map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={cn(
                        "h-8 w-8 flex items-center justify-center text-sm cursor-pointer border-r",
                        p === page
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-sm text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
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
