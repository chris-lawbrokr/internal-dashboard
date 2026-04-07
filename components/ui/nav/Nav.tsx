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

const SHADOW =
  "shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)]";

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Accounts", href: "/accounts", icon: Users },
  // { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const BARE_ROUTES = ["/login"];

function IconBtn({
  icon: Icon,
  label,
  size = 20,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground cursor-pointer"
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={size} />
    </button>
  );
}

function NavLinks({
  pathname,
  iconOnly,
  size = 20,
  onNavigate,
}: {
  pathname: string;
  iconOnly?: boolean;
  size?: number;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            className={
              iconOnly
                ? `p-1.5 rounded-lg transition-colors ${active ? "text-brand-dark" : "text-muted-foreground hover:text-foreground"}`
                : `flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-base transition-colors whitespace-nowrap ${active ? "bg-surface font-bold text-brand-dark" : "text-muted-foreground hover:text-foreground"}`
            }
            aria-label={item.label}
            title={iconOnly ? item.label : undefined}
          >
            <item.icon size={size} />
            {!iconOnly && item.label}
          </Link>
        );
      })}
    </>
  );
}

export function Nav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const isBare = BARE_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    const mobileMql = window.matchMedia("(max-width: 479px)");
    const tabletMql = window.matchMedia(
      "(min-width: 480px) and (max-width: 767px)",
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
    mobileMql.addEventListener("change", apply);
    tabletMql.addEventListener("change", apply);
    return () => {
      mobileMql.removeEventListener("change", apply);
      tabletMql.removeEventListener("change", apply);
    };
  }, []);

  if (isBare) return <>{children}</>;
  if (!mounted) return null;

  const displayName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const displayEmail = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((p: string) => p[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const closeMobile = () => {
    if ((isMobile || isTablet) && open) toggle();
  };

  const isDesktop = !isMobile && !isTablet;

  const avatar = (size: "sm" | "base") => (
    <div
      className={`${size === "sm" ? "h-8 w-8 text-xs" : "h-8 w-8 text-sm"} rounded-full bg-status-neutral-bg text-muted-foreground flex items-center justify-center font-semibold`}
    >
      {initials}
    </div>
  );

  const actionIcons = (size: number) => (
    <>
      <IconBtn icon={Settings} label="Settings" size={size} />
      <IconBtn icon={Bell} label="Notifications" size={size} />
    </>
  );

  const collapsed = (
    <>
      {avatar("sm")}
      <IconBtn icon={LogOut} label="Log out" size={18} onClick={logout} />
      <div className="flex flex-col items-center gap-4 border-t border-b border-border py-4 w-full">
        {actionIcons(20)}
      </div>
      <nav className="flex flex-col items-center gap-4 flex-1">
        <NavLinks pathname={pathname} iconOnly />
      </nav>
      <IconBtn icon={PanelLeftOpen} label="Open sidebar" onClick={toggle} />
    </>
  );

  const expanded = (
    <div className="flex flex-col h-full w-[160px] gap-7">
      <div className="flex flex-col gap-5 items-start w-full">
        <div className="flex flex-col gap-2 items-center w-full">
          {avatar("base")}
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
            Log out
          </span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-b border-border py-4 w-full">
        {actionIcons(20)}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLinks pathname={pathname} onNavigate={closeMobile} />
      </nav>

      <div className="flex items-center justify-between w-full mt-auto">
        <Image
          src="/images/Logo.svg"
          alt="Logo"
          height={100}
          width={100}
          style={{ width: "auto", height: "auto" }}
        />
        <IconBtn icon={PanelLeftClose} label="Close sidebar" onClick={toggle} />
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden flex relative">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${(isTablet || isMobile) && open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggle}
        aria-hidden="true"
      />

      {/* Mobile top bar */}
      {isMobile && (
        <div
          className={`absolute top-0 left-0 right-0 z-50 bg-white ${SHADOW}`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <Image
              src="/images/Logo.svg"
              alt="Logo"
              height={24}
              width={80}
              loading="eager"
              style={{ height: "auto" }}
            />
            <IconBtn
              icon={open ? X : Menu}
              label={open ? "Close menu" : "Open menu"}
              size={24}
              onClick={toggle}
            />
          </div>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? "max-h-[400px]" : "max-h-0"}`}
          >
            <nav className="flex flex-col gap-1 px-4 pb-4">
              <NavLinks pathname={pathname} size={18} onNavigate={toggle} />
            </nav>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-sm text-foreground">{displayName}</span>
              <div className="flex items-center gap-3">
                {actionIcons(18)}
                <IconBtn
                  icon={LogOut}
                  label="Log out"
                  size={18}
                  onClick={logout}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablet: collapsed strip */}
      <div
        className={`shrink-0 h-full bg-white flex flex-col items-center py-5 px-2 gap-6 ${SHADOW} ${isTablet ? "" : "hidden"}`}
      >
        {collapsed}
      </div>

      {/* Tablet: expanded overlay */}
      <div
        className={`shrink-0 h-full bg-white flex p-5 ${SHADOW} w-[200px] transition-transform duration-300 ease-in-out fixed left-0 top-0 z-50 ${!isTablet ? "hidden" : !open ? "-translate-x-full" : "translate-x-0"}`}
      >
        {expanded}
      </div>

      {/* Desktop: collapsible sidebar */}
      <div
        className={`shrink-0 h-full relative overflow-hidden transition-[width] duration-300 ease-in-out ${isDesktop ? (open ? "w-[200px]" : "w-12") : "hidden"}`}
      >
        <div
          className={`absolute inset-0 bg-white flex flex-col items-center py-5 px-2 gap-6 ${SHADOW} transition-opacity duration-200 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {collapsed}
        </div>
        <div
          className={`w-[200px] h-full bg-white flex p-5 ${SHADOW} transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {expanded}
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-surface">
        <div className="px-4 pb-4 @md:px-6 @md:pb-6 @container flex flex-col gap-6 min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
