import "./globals.css";
import "../Webfonts/fontiran.css";

import type { Metadata } from "next";

import AppToaster from "@/components/AppToaster";
import ScrollToTop from "@/components/ScrollToTop";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

import { CustomToastProvider } from "@/components/ui/custom-toast";

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

        <div className="text-foreground bg-background relative min-h-screen">
          <main className="headerPadding">
            <CustomToastProvider>{children}</CustomToastProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
