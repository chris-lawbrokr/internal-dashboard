import Image from "next/image";
import { Menu, LogOut, Bell } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="w-full p-4 bg-card border-b">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onMenuClick} className="cursor-pointer">
          <Menu size={24} />
        </button>
        <Image src="/images/Logo.svg" alt="Logo" height="30" width="117" />
        <div className="ml-auto flex items-center gap-4">
          <Bell size={20} className="cursor-pointer" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            JD
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
