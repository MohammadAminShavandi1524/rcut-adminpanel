import "./globals.css";
import "../Webfonts/fontiran.css";

import type { Metadata } from "next";

import AppToaster from "@/components/AppToaster";
import ScrollToTop from "@/components/ScrollToTop";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

import { CustomToastProvider } from "@/components/ui/custom-toast";
import Sidebar from "@/components/Layout/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "RCUT",
    template: "%s | RCUT",
  },
  description: "RCUT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-IRANYekanX">
        <AppToaster />

        <div className="bg-background text-foreground flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex flex-1 flex-col overflow-hidden">
            <CustomToastProvider>{children}</CustomToastProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
