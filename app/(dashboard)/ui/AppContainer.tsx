"use client";

import { Sidebar } from "@/app/(dashboard)/ui/Sidebar";

export function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 min-w-0 p-4 @md:p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-surface">
        {children}
      </div>
    </div>
  );
}
