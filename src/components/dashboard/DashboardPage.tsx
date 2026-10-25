"use client";

import { useEffect, useRef, useState } from "react";

import {
  Mail,
  Package,
  PackageCheck,
  ShoppingBag,
  Tags,
  type LucideIcon,
} from "lucide-react";

import DashboardStatCard from "./DashboardStatCard";

import {
  getDashboardStats,
  initialDashboardStats,
  type DashboardStats,
} from "./dashboard.api";

import { useDashboardAnimation } from "./useDashboardAnimation";

interface DashboardItem {
  key: keyof DashboardStats;
  title: string;
  href: string;
  addHref?: string;
  icon: LucideIcon;
}

const dashboardItems: DashboardItem[] = [
  {
    key: "contactMessages",
    title: "پیام‌های دریافتی",
    href: "/contact-messages",
    icon: Mail,
  },
  {
    key: "categories",
    title: "دسته بندی‌ها",
    href: "/categories",
    addHref: "/categories/add",
    icon: Tags,
  },
  {
    key: "products",
    title: "محصولات",
    href: "/products",
    addHref: "/products/add",
    icon: Package,
  },
  {
    key: "newProducts",
    title: "محصولات جدید",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    key: "topSellerProducts",
    title: "محصولات پرفروش",
    href: "/products",
    icon: PackageCheck,
  },
];

const DashboardPage = () => {
  const dashboardRef = useRef<HTMLElement>(null);

  const [stats, setStats] = useState<DashboardStats>(initialDashboardStats);

  const [loading, setLoading] = useState(true);

  useDashboardAnimation(dashboardRef);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        if (active) {
          setStats(data);
        }
      } catch (error) {
        console.error("GET DASHBOARD STATS ERROR:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section ref={dashboardRef} dir="rtl" className="min-w-0">
      {/* Statistics Cards */}
      <div className="3xl:gap-4 grid min-w-0 grid-cols-3 gap-2.5 2xl:gap-3">
        {dashboardItems.map((item) => (
          <div key={item.key} className="dashboard-stat-item min-w-0">
            <DashboardStatCard
              title={item.title}
              count={stats[item.key]}
              href={item.href}
              addHref={item.addHref}
              icon={item.icon}
              loading={loading}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
