import { AppContainer } from "@/app/(dashboard)/ui/AppContainer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppContainer>{children}</AppContainer>;
}
