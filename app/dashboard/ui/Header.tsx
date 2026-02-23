import Image from "next/image";
import { Menu } from "lucide-react";

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
      </div>
    </div>
  );
}
