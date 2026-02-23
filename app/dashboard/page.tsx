"use client";

import { useState } from "react";
import { Sidebar } from "./ui/Sidebar";
import { Header } from "./ui/Header";

import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />

      <div className="h-full flex relative">
        <Sidebar open={sidebarOpen} />

        {/* Parent becomes the container */}
        <div className="w-full p-4 overflow-auto @container">
          {/* Children respond to the container width */}
          <div className="min-w-[320px] flex flex-col gap-4 @md:flex-row">
            <Card className="flex-1 p-4">
              <CardContent>CARD 1</CardContent>
            </Card>

            <Card className="flex-1 p-4">
              <CardContent>CARD 2</CardContent>
            </Card>

            <Card className="flex-1 p-4">
              <CardContent>CARD 3</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
