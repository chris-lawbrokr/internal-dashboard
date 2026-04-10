import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { Nav } from "@/components/ui/nav/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Lawbrokr Internal Dashboard",
  description: "Lawbrokr Internal Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased max-w-[1800px] mx-auto`}
      >
        <AuthProvider>
          <Nav>{children}</Nav>
        </AuthProvider>
      </body>
    </html>
  );
}
