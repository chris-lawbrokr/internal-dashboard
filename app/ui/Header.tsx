import Image from "next/image";
import { LogOut, Bell } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function Header({ onMenuClick, sidebarOpen = true }: HeaderProps) {
  return (
    <div className="w-full p-4 bg-card border-b shrink-0 overflow-x-auto">
      <div className="flex items-center gap-4 whitespace-nowrap">
        <button type="button" aria-label="Toggle sidebar" onClick={onMenuClick} className="relative cursor-pointer h-6 w-6 flex flex-col items-center justify-center">
          <span
            className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${sidebarOpen ? "rotate-45" : "-translate-y-1.5"}`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${sidebarOpen ? "opacity-0 scale-x-0" : "opacity-100"}`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${sidebarOpen ? "-rotate-45" : "translate-y-1.5"}`}
          />
        </button>
        <Image src="/images/Logo.svg" alt="Logo" height="30" width="117" />
        <div className="ml-auto flex items-center gap-4">
          <Bell size={20} className="cursor-pointer" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            LB
          </span>
          <a
            href="/logout"
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
