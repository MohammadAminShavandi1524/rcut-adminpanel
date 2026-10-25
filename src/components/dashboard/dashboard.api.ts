import { getContactMessages } from "@/components/contactMessages/contact-messages.api";

import { getCategories } from "@/components/categories/categories.api";

import { getProducts } from "@/components/products/products.api";

export interface DashboardStats {
  contactMessages: number | null;
  categories: number | null;
  products: number | null;
  newProducts: number | null;
  topSellerProducts: number | null;
}

export const initialDashboardStats: DashboardStats = {
  contactMessages: null,
  categories: null,
  products: null,
  newProducts: null,
  topSellerProducts: null,
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [messagesResult, categoriesResult, productsResult] =
    await Promise.allSettled([
      getContactMessages(),
      getCategories(),
      getProducts(),
    ]);

  const stats: DashboardStats = {
    ...initialDashboardStats,
  };

  if (messagesResult.status === "fulfilled") {
    if (Array.isArray(messagesResult.value)) {
      stats.contactMessages = messagesResult.value.length;
    }
  } else {
    console.error("DASHBOARD CONTACT MESSAGES ERROR:", messagesResult.reason);
  }

  if (categoriesResult.status === "fulfilled") {
    if (Array.isArray(categoriesResult.value)) {
      stats.categories = categoriesResult.value.length;
    }
  } else {
    console.error("DASHBOARD CATEGORIES ERROR:", categoriesResult.reason);
  }

  if (productsResult.status === "fulfilled") {
    const products = productsResult.value;

    if (Array.isArray(products)) {
      stats.products = products.length;

      stats.newProducts = products.filter(
        (product) => product.new === true,
      ).length;

      stats.topSellerProducts = products.filter(
        (product) => product.top_seller === true,
      ).length;
    }
  } else {
    console.error("DASHBOARD PRODUCTS ERROR:", productsResult.reason);
  }

  return stats;
}
