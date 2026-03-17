"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  BarChart3,
  LogOut,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const MOBILE_BREAKPOINT = 768;

interface NavItem {
  id: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "home", labelKey: "home", href: "/", icon: Home },
  { id: "account", labelKey: "accounts", href: "/account", icon: Users },
  {
    id: "analytics",
    labelKey: "analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export function Sidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    if (mql.matches && open) onToggle();
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) onToggle();
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Backdrop on mobile when open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      <div
        className={`shrink-0 h-full overflow-hidden transition-[width] duration-300 ease-in-out fixed md:relative z-50 md:z-auto ${open ? "w-full md:w-[200px]" : "w-0"}`}
      >
        <div
          className={`h-full w-[200px] bg-white flex p-5 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col h-full w-[160px] gap-7">
          {/* User Profile + Logout */}
          <div className="flex flex-col gap-5 items-start w-full">
            <div className="flex flex-col gap-2 items-center w-full">
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-[#e1dff6] text-[#777] flex items-center justify-center text-sm font-semibold">
                PA
              </div>
              {/* Name & email */}
              <div className="flex flex-col items-center w-full text-center">
                <span className="text-base leading-7 text-[#070043] whitespace-nowrap">
                  Penelope Anthony
                </span>
                <span className="text-xs leading-6 text-[#777] whitespace-nowrap">
                  name@company.com
                </span>
              </div>
            </div>
            {/* Logout button */}
            <button
              type="button"
              className="flex items-center gap-1.5 justify-center w-full bg-[#fbfbfb] border border-[#c8c8c8] rounded-xl px-3 py-1.5 shadow-[0px_1px_0.5px_0px_rgba(37,13,83,0.02)] hover:bg-muted cursor-pointer"
            >
              <LogOut size={14} className="text-[#777]" />
              <span className="text-xs font-medium text-[#777] whitespace-nowrap">
                {t("logout")}
              </span>
            </button>
          </div>

          {/* Icons row */}
          <div className="flex items-center justify-center gap-4 border-t border-b border-[#c8c8c8] py-4 w-full">
            <button
              type="button"
              className="text-[#777] hover:text-[#070043] cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <button
              type="button"
              className="text-[#777] hover:text-[#070043] cursor-pointer"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-base transition-colors whitespace-nowrap ${isActive ? "bg-[#fbfbfb] font-bold text-[#250d53]" : "text-[#777]"}`}
                >
                  <item.icon size={20} />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* Bottom logo + sidebar toggle */}
          <div className="flex items-center justify-between w-full mt-auto">
            <div className="flex items-center">
              <div className="h-6 w-6 rounded bg-[#3b2559] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">lb</span>
              </div>
              <span className="text-sm font-semibold ml-1 whitespace-nowrap">
                lawbrokr.
              </span>
            </div>
            <button
              type="button"
              className="text-[#777] hover:text-[#070043] cursor-pointer"
              aria-label="Close sidebar"
              onClick={onToggle}
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SidebarOpenButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-3 left-3 z-10 h-10 w-10 min-w-10 min-h-10 rounded-full bg-white text-[#3b2559] border-2 border-[#3b2559] shadow-[0px_4px_12px_0px_rgba(59,37,89,0.3)] flex items-center justify-center hover:bg-[#f2f2f2] transition-colors cursor-pointer"
      aria-label="Open sidebar"
    >
      <PanelLeftOpen size={22} />
    </button>
  );
}
