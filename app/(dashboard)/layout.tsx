import { Nav } from "@/components/ui/nav/Nav";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full overflow-hidden flex relative">
      <Nav />
      <div className="flex-1 min-w-0 p-4 pt-16 min-[480px]:pt-4 @md:p-6 overflow-y-auto overflow-x-hidden @container flex flex-col gap-6 bg-surface">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
