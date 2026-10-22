"use client";

import { useRef } from "react";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { CustomButton } from "../ui/custom-button";

import { useHeaderLayoutAnimation } from "./useHeaderLayoutAnimation";

interface HeaderLayoutProps {
  title: string;
  descrption: string;
  className?: string;
}

export const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

const HeaderLayout = ({ title, descrption, className }: HeaderLayoutProps) => {
  const router = useRouter();

  const headerRef = useRef<HTMLDivElement>(null);

  useHeaderLayoutAnimation(headerRef);

  const handleLogout = async () => {
    try {
      await logout();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      ref={headerRef}
      dir="rtl"
      className={cn(
        "border-b-border-secondary flex shrink-0 items-center justify-between border-b",
        "px-4 py-4",
        "lg:px-4 lg:py-4",
        "xl:px-5 xl:py-5",
        "2xl:px-6 2xl:py-6",
        "3xl:px-8 3xl:py-6",
        className,
      )}
    >
      {/* Page Info */}
      <div className="3xl:pe-6 min-w-0 pe-3 lg:pe-4">
        <h1 className="header-title 3xl:text-[26px] mb-2 text-[19px] font-semibold lg:text-[20px] xl:text-[22px] 2xl:text-[24px]">
          {title}
        </h1>

        <p className="header-description text-muted-foreground 3xl:text-lg text-sm lg:text-[14px] xl:text-base 2xl:text-[17px]">
          {descrption}
        </p>
      </div>

      {/* Controls */}
      <div className="3xl:pe-4 flex shrink-0 items-center gap-x-1.5 pe-0 2xl:gap-x-2">
        <div className="header-control">
          <CustomButton
            intent="primary"
            variant="solid"
            size="lg"
            leftSection={
              <LogOut className="3xl:size-5 size-4.5 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            }
            onClick={handleLogout}
            className="group 3xl:h-13 3xl:px-5 3xl:text-[15px] h-10 px-3 text-[12px] xl:h-11 xl:px-4 xl:text-sm 2xl:h-12"
          >
            خروج
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
