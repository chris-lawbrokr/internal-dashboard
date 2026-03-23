"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
  { id: "accounts", labelKey: "accounts", href: "/accounts", icon: Users },
  {
    id: "analytics",
    labelKey: "analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  // Start with server-safe defaults (desktop, open) to avoid hydration mismatch.
  // The useEffect below corrects to the actual viewport on first client render.
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const onToggle = () => setOpen((o) => !o);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const apply = (mobile: boolean) => {
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    apply(mql.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const collapsedContent = (
    <>
      <div className="h-8 w-8 rounded-full bg-status-neutral-bg text-muted-foreground flex items-center justify-center text-xs font-semibold">
        PA
      </div>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label={t("logout")}
      >
        <LogOut size={18} />
      </button>
      <div className="flex flex-col items-center gap-4 border-t border-b border-border py-4 w-full">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
      </div>
      <nav className="flex flex-col items-center gap-4 flex-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`p-1.5 rounded-lg transition-colors ${isActive ? "text-brand-dark" : "text-muted-foreground hover:text-foreground"}`}
              aria-label={t(item.labelKey)}
              title={t(item.labelKey)}
            >
              <item.icon size={20} />
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-pointer mt-auto"
        aria-label="Open sidebar"
        onClick={onToggle}
      >
        <PanelLeftOpen size={20} />
      </button>
    </>
  );

  const expandedContent = (
    <div className="flex flex-col h-full w-[160px] gap-7">
      <div className="flex flex-col gap-5 items-start w-full">
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="h-8 w-8 rounded-full bg-status-neutral-bg text-muted-foreground flex items-center justify-center text-sm font-semibold">
            PA
          </div>
          <div className="flex flex-col items-center w-full text-center">
            <span className="text-base leading-7 text-foreground whitespace-nowrap">
              Penelope Anthony
            </span>
            <span className="text-xs leading-6 text-muted-foreground whitespace-nowrap">
              name@company.com
            </span>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 justify-center w-full bg-surface border border-border rounded-xl px-3 py-1.5 shadow-[0px_1px_0.5px_0px_rgba(37,13,83,0.02)] hover:bg-muted cursor-pointer"
        >
          <LogOut size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {t("logout")}
          </span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-b border-border py-4 w-full">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

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
              onClick={() => {
                if (isMobile && open) onToggle();
              }}
              className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-base transition-colors whitespace-nowrap ${isActive ? "bg-surface font-bold text-brand-dark" : "text-muted-foreground"}`}
            >
              <item.icon size={20} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between w-full mt-auto">
        <div className="flex items-center flex flex-col flex-end">
          <Image
            src="/images/Logo.svg"
            alt="Logo"
            height="100"
            width="100"
            className="flex-2"
          />
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Close sidebar"
          onClick={onToggle}
        >
          <PanelLeftClose size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop — only visible on mobile when open */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isMobile && open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onToggle}
        aria-hidden="true"
      />

      {/* Mobile: collapsed icon strip — always in flow */}
      <div
        className={`shrink-0 h-full bg-white flex flex-col items-center py-5 px-2 gap-6 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] ${isMobile ? "" : "hidden"}`}
      >
        {collapsedContent}
      </div>

      {/* Mobile: expanded sidebar — fixed overlay */}
      <div
        className={`shrink-0 h-full bg-white flex p-5 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] w-[200px] transition-transform duration-300 ease-in-out fixed left-0 top-0 z-50 ${!isMobile ? "hidden" : !open ? "-translate-x-full" : "translate-x-0"}`}
      >
        {expandedContent}
      </div>

      {/* Desktop: single container, width transitions between collapsed and expanded */}
      <div
        className={`shrink-0 h-full relative overflow-hidden transition-[width] duration-300 ease-in-out ${isMobile ? "hidden" : open ? "w-[200px]" : "w-12"}`}
      >
        {/* Collapsed view */}
        <div
          className={`absolute inset-0 bg-white flex flex-col items-center py-5 px-2 gap-6 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] transition-opacity duration-200 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {collapsedContent}
        </div>

        {/* Expanded view */}
        <div
          className={`w-[200px] h-full bg-white flex p-5 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {expandedContent}
        </div>
      </div>
    </>
  );
}
