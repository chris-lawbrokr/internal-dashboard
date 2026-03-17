"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, BarChart3, LogOut, Bell, Settings, QrCode } from "lucide-react";
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
  { id: "account", labelKey: "accounts", href: "/account", icon: User },
  { id: "analytics", labelKey: "analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="shrink-0 bg-card border-r h-full flex flex-col w-[200px]">
      <div className="min-w-[200px] flex flex-col h-full">
        {/* User Profile */}
        <div className="flex flex-col items-center gap-1 pt-6 pb-4 px-4">
          <div className="h-12 w-12 rounded-full bg-[#e1dff6] text-[#070043] flex items-center justify-center text-sm font-semibold">
            PA
          </div>
          <span className="text-sm font-semibold mt-1">Penelope Anthony</span>
          <span className="text-xs text-muted-foreground">name@company.com</span>
          <button
            type="button"
            className="mt-2 flex items-center gap-2 text-sm border rounded-md px-4 py-1.5 hover:bg-muted cursor-pointer"
          >
            <LogOut size={14} />
            {t("logout")}
          </button>
        </div>

        {/* Icons row */}
        <div className="flex items-center justify-center gap-4 px-4 pb-4 border-b">
          <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Settings">
            <Settings size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? "font-bold text-[#070043]" : "text-muted-foreground"}`}
              >
                <item.icon size={16} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Bottom logo */}
        <div className="flex items-center gap-2 px-4 pb-6 mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded bg-[#3b2559] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">lb</span>
            </div>
            <span className="text-sm font-semibold">lawbrokr.</span>
          </div>
          <button type="button" className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer" aria-label="QR Code">
            <QrCode size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
