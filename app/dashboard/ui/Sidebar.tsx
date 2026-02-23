import Link from "next/link";
import { Home, User, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/dashboard", icon: Home },
  { id: "account", label: "Account", href: "/dashboard", icon: User },
  { id: "analytics", label: "Analytics", href: "/dashboard", icon: BarChart3 },
];

interface SidebarProps {
  open?: boolean;
}

export function Sidebar({ open = true }: SidebarProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden bg-card transition-all duration-300 ease-in-out ${open ? "w-[200px]" : "w-0"}`}
    >
      <nav className="min-w-[200px] flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
