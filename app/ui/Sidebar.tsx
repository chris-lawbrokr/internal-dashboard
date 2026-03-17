"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BarChart3, LogOut, Bell, Settings, PanelLeftClose } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface NavItem {
  id: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "home", labelKey: "home", href: "/", icon: Home },
  { id: "account", labelKey: "accounts", href: "/account", icon: Users },
  { id: "analytics", labelKey: "analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="shrink-0 bg-white h-full flex p-5 shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.1)]">
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
              <span className="text-base leading-7 text-[#070043]">Penelope Anthony</span>
              <span className="text-xs leading-6 text-[#777]">name@company.com</span>
            </div>
          </div>
          {/* Logout button */}
          <button
            type="button"
            className="flex items-center gap-1.5 justify-center w-full bg-[#fbfbfb] border border-[#c8c8c8] rounded-xl px-3 py-1.5 shadow-[0px_1px_0.5px_0px_rgba(37,13,83,0.02)] hover:bg-muted cursor-pointer"
          >
            <LogOut size={14} className="text-[#777]" />
            <span className="text-xs font-medium text-[#777]">{t("logout")}</span>
          </button>
        </div>

        {/* Icons row */}
        <div className="flex items-center justify-center gap-4 border-t border-b border-[#c8c8c8] py-4 w-full">
          <button type="button" className="text-[#777] hover:text-[#070043] cursor-pointer" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button type="button" className="text-[#777] hover:text-[#070043] cursor-pointer" aria-label="Settings">
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
                className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-base transition-colors ${isActive ? "bg-[#fbfbfb] font-bold text-[#250d53]" : "text-[#777]"}`}
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
            <span className="text-sm font-semibold ml-1">lawbrokr.</span>
          </div>
          <button type="button" className="text-[#777] hover:text-[#070043] cursor-pointer" aria-label="Toggle sidebar">
            <PanelLeftClose size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
