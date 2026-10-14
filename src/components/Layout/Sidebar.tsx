"use client";

import { useRef } from "react";

import {
  BriefcaseBusiness,
  CircleHelp,
  ClipboardList,
  ClipboardPlus,
  FilePlus2,
  FolderPlus,
  Handshake,
  LayoutDashboard,
  Mail,
  Package,
  PackagePlus,
  Plus,
  Table2,
  Tags,
  Wrench,
} from "lucide-react";

import { usePathname } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollArea } from "@/components/ui/scroll-area";

import SidebarItem from "./SidebarItem";
import SideBarItemHeader from "./SideBarItemHeader";

gsap.registerPlugin(useGSAP);

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sidebarRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        sidebarRef.current,
        {
          opacity: 0,
          x: -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
        },
      );

      timeline.fromTo(
        ".sidebar-brand",
        {
          opacity: 0,
          y: -8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.25",
      );

      timeline.fromTo(
        ".sidebar-section",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
        },
        "-=0.2",
      );
    },
    {
      scope: sidebarRef,
    },
  );

  if (pathname === "/login") {
    return null;
  }

  return (
    <aside
      ref={sidebarRef}
      dir="rtl"
      className="border-border-secondary bg-background flex h-screen w-[285px] shrink-0 flex-col border-l pb-4"
    >
      {/* Header */}
      <div className="sidebar-brand shrink-0 px-4">
        <div className="border-border-secondary flex min-h-[78px] items-center border-b px-2">
          <div className="flex min-w-0 flex-col">
            <div className="text-foreground truncate text-[20px] font-semibold">
              آرکات
            </div>

            <div className="text-muted-foreground mt-0 truncate text-[16px]">
              پنل مدیریت
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea
        data-lenis-prevent
        dir="rtl"
        className="min-h-0 flex-1"
        scrollBarClassName="me-1"
      >
        <nav className="flex flex-col gap-y-3 px-4 pt-3">
          {/* Overview */}
          <div className="sidebar-section">
            <SideBarItemHeader label="نمای کلی" />

            <SidebarItem
              href="/"
              title="داشبورد"
              icon={LayoutDashboard}
              active={pathname === "/"}
            />
          </div>

          {/* Requests */}
          <div className="sidebar-section">
            <SideBarItemHeader label="درخواست‌ها" />

            <SidebarItem
              href="/contact-messages"
              title="پیام‌های دریافتی"
              icon={Mail}
              active={pathname.startsWith("/contact-messages")}
            />
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
