"use client";

import { useTranslations } from "next-intl";

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function Header({ onMenuClick, sidebarOpen = true }: HeaderProps) {
  const t = useTranslations("nav");

  return (
    <div className="w-full px-4 py-2 bg-[#3b2559] text-white/80 text-sm shrink-0 flex items-center gap-4">
      <button
        type="button"
        aria-label={t("toggleSidebar")}
        onClick={onMenuClick}
        className="relative cursor-pointer h-6 w-6 flex flex-col items-center justify-center md:hidden"
      >
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
      <span>{t("dashboardTitle")}</span>
    </div>
  );
}
