"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

export interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1 border-b border-border mx-4 overflow-y-scroll",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors cursor-pointer -mb-px",
            activeTab === tab.id
              ? "border-b-2 border-brand-dark text-brand-dark"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Hook that syncs active tab with the `?tab=` search param.
 * Falls back to the first tab if no param is present.
 */
export function useTabSearchParam(tabs: Tab[]): [string, (id: string) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultTab = tabs[0]?.id ?? "";
  const paramValue = searchParams.get("tab");
  const activeTab = tabs.find((t) => t.id === paramValue)?.id ?? defaultTab;

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === defaultTab) {
      params.delete("tab");
    } else {
      params.set("tab", id);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return [activeTab, setTab];
}
