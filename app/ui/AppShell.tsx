"use client";

import { useState } from "react";
import { Sidebar } from "@/app/ui/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />
      <div className="flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-[#fbfbfb]">
        {children}
      </div>
    </div>
  );
}
