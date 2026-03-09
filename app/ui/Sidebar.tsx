"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "account", label: "Account", href: "/account", icon: User },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
];

interface SidebarProps {
  open?: boolean;
}

export function Sidebar({ open = true }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`shrink-0 overflow-hidden bg-card transition-all duration-300 ease-in-out absolute md:relative z-10 h-full ${open ? "w-[200px]" : "w-0"}`}
    >
      <nav className="min-w-[200px] flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? "font-bold text-foreground" : "text-muted-foreground"}`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
