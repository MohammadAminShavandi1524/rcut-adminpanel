"use client";

import { useRef } from "react";

import { FolderPlus, LayoutDashboard, Mail, Tags } from "lucide-react";

import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";

import SidebarItem from "./SidebarItem";
import SideBarItemHeader from "./SideBarItemHeader";

import { useSidebarAnimation } from "./useSidebarAnimation";

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarRef = useRef<HTMLElement>(null);

  useSidebarAnimation(sidebarRef);

  if (pathname === "/login") {
    return null;
  }

  return (
    <aside
      ref={sidebarRef}
      dir="rtl"
      className="border-border-secondary bg-background 3xl:w-[285px] flex h-screen w-[240px] shrink-0 flex-col border-l pb-4 xl:w-[255px] 2xl:w-[270px]"
    >
      {/* Header */}
      <div className="sidebar-brand 3xl:px-4 shrink-0 px-3 xl:px-3.5">
        <div className="border-border-secondary 3xl:min-h-[78px] flex min-h-[68px] items-center border-b px-2 xl:min-h-[72px] 2xl:min-h-[76px]">
          <div className="flex min-w-0 flex-col">
            <div className="text-foreground 3xl:text-[20px] truncate text-[17px] font-semibold xl:text-[18px] 2xl:text-[19px]">
              آرکات
            </div>

            <div className="text-muted-foreground 3xl:text-[16px] mt-0 truncate text-[13px] xl:text-[14px] 2xl:text-[15px]">
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
        <nav className="3xl:px-4 flex flex-col gap-y-2.5 px-3 pt-3 xl:gap-y-3 xl:px-3.5">
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

          {/* Categories */}
          <div className="sidebar-section">
            <SideBarItemHeader label="مدیریت دسته‌بندی‌ها" />

            <SidebarItem
              href="/categories"
              title="لیست دسته‌بندی‌ها"
              icon={Tags}
              active={
                pathname === "/categories" ||
                /^\/categories\/\d+(?:\/.*)?$/.test(pathname)
              }
            />

            <SidebarItem
              href="/categories/add"
              title="افزودن دسته‌بندی"
              icon={FolderPlus}
              active={pathname === "/categories/add"}
            />
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
