"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

const navLabels: Record<string, string> = {
  home: "Home",
  accounts: "Accounts",
  analytics: "Analytics",
  logout: "Log out",
};

const MOBILE_BREAKPOINT = 480;
const TABLET_BREAKPOINT = 768;

interface NavItem {
  id: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
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

const BARE_ROUTES = ["/login"];

export function Nav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = (key: string) => navLabels[key] ?? key;
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const onToggle = () => setOpen((o) => !o);

  const isBare = BARE_ROUTES.some((r) => pathname.startsWith(r));

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const displayEmail = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((p: string) => p[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const mobileMql = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );
    const tabletMql = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`,
    );

    const apply = () => {
      const mobile = mobileMql.matches;
      const tablet = tabletMql.matches;
      setIsMobile(mobile);
      setIsTablet(tablet);
      setOpen(!mobile && !tablet);
    };

    apply();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag
    setMounted(true);
    const onMobileChange = () => apply();
    const onTabletChange = () => apply();
    mobileMql.addEventListener("change", onMobileChange);
    tabletMql.addEventListener("change", onTabletChange);
    return () => {
      mobileMql.removeEventListener("change", onMobileChange);
      tabletMql.removeEventListener("change", onTabletChange);
    };
  }, []);

  const collapsedContent = (
    <>
      <div className="h-8 w-8 rounded-full bg-status-neutral-bg text-muted-foreground flex items-center justify-center text-xs font-semibold">
        {initials}
      </div>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label={t("logout")}
        onClick={logout}
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
          if (item.disabled) {
            return (
              <span
                key={item.id}
                className="p-1.5 rounded-lg text-muted-foreground/40 cursor-not-allowed"
                aria-label={t(item.labelKey)}
                title={t(item.labelKey)}
              >
                <item.icon size={20} />
              </span>
            );
          }
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
            {initials}
          </div>
          <div className="flex flex-col items-center w-full text-center">
            <span className="text-base leading-7 text-foreground whitespace-nowrap">
              {displayName}
            </span>
            <span className="text-xs leading-6 text-muted-foreground whitespace-nowrap">
              {displayEmail}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 justify-center w-full bg-surface border border-border rounded-xl px-3 py-1.5 shadow-[0px_1px_0.5px_0px_rgba(37,13,83,0.02)] hover:bg-muted cursor-pointer"
          onClick={logout}
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
          if (item.disabled) {
            return (
              <span
                key={item.id}
                className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-base whitespace-nowrap text-muted-foreground/40 cursor-not-allowed"
              >
                <item.icon size={20} />
                {t(item.labelKey)}
              </span>
            );
          }
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if ((isMobile || isTablet) && open) onToggle();
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
        <div className="flex flex-col items-end">
          <Image
            src="/images/Logo.svg"
            alt="Logo"
            height="100"
            width="100"
            style={{ width: "auto", height: "auto" }}
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

  const isDesktop = !isMobile && !isTablet;

  if (isBare) return <>{children}</>;
  if (!mounted) return null;

  return (
    <div className="h-screen w-full overflow-hidden flex relative">
      {/* Backdrop — visible on tablet/mobile when expanded */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${(isTablet || isMobile) && open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onToggle}
        aria-hidden="true"
      />

      {/* Mobile: horizontal top bar */}
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-white shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)]">
          <div className="flex items-center justify-between px-4 py-3">
            <Image
              src="/images/Logo.svg"
              alt="Logo"
              height={24}
              width={80}
              loading="eager"
              style={{ height: "auto" }}
            />
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={onToggle}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile: dropdown menu */}
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? "max-h-[400px]" : "max-h-0"}`}
          >
            <nav className="flex flex-col gap-1 px-4 pb-4">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                if (item.disabled) {
                  return (
                    <span
                      key={item.id}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed"
                    >
                      <item.icon size={18} />
                      {t(item.labelKey)}
                    </span>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      if (open) onToggle();
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive ? "bg-surface font-bold text-brand-dark" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <item.icon size={18} />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">{displayName}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={t("logout")}
                  onClick={logout}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablet: collapsed icon strip — always in flow */}
      <div
        className={`shrink-0 h-full bg-white flex flex-col items-center py-5 px-2 gap-6 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] ${isTablet ? "" : "hidden"}`}
      >
        {collapsedContent}
      </div>

      {/* Tablet: expanded sidebar — fixed overlay */}
      <div
        className={`shrink-0 h-full bg-white flex p-5 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)] w-[200px] transition-transform duration-300 ease-in-out fixed left-0 top-0 z-50 ${!isTablet ? "hidden" : !open ? "-translate-x-full" : "translate-x-0"}`}
      >
        {expandedContent}
      </div>

      {/* Desktop: single container, width transitions between collapsed and expanded */}
      <div
        className={`shrink-0 h-full relative overflow-hidden transition-[width] duration-300 ease-in-out ${isDesktop ? (open ? "w-[200px]" : "w-12") : "hidden"}`}
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

      <div className="flex-1 min-w-0 p-4 pt-16 min-[480px]:pt-4 @md:p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-surface">
        {children}
      </div>
    </div>
  );
}
