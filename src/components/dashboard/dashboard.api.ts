import { getContactMessages } from "@/components/contactMessages/contact-messages.api";

import { getCategories } from "@/components/categories/categories.api";

import { getProducts } from "@/components/products/products.api";

import { getProductBrands } from "@/components/products/product-brands.api";

import { getCatalogs } from "@/components/catalogs/catalogs.api";

export interface DashboardStats {
  contactMessages: number | null;
  categories: number | null;
  brands: number | null;
  products: number | null;
  catalogs: number | null;
}

export const initialDashboardStats: DashboardStats = {
  contactMessages: null,
  categories: null,
  brands: null,
  products: null,
  catalogs: null,
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    messagesResult,
    categoriesResult,
    brandsResult,
    productsResult,
    catalogsResult,
  ] = await Promise.allSettled([
    getContactMessages(),
    getCategories(),
    getProductBrands(),
    getProducts(),
    getCatalogs(),
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

  if (brandsResult.status === "fulfilled") {
    if (Array.isArray(brandsResult.value)) {
      stats.brands = brandsResult.value.length;
    }
  } else {
    console.error("DASHBOARD BRANDS ERROR:", brandsResult.reason);
  }

  if (productsResult.status === "fulfilled") {
    if (Array.isArray(productsResult.value)) {
      stats.products = productsResult.value.length;
    }
  } else {
    console.error("DASHBOARD PRODUCTS ERROR:", productsResult.reason);
  }

  if (catalogsResult.status === "fulfilled") {
    if (Array.isArray(catalogsResult.value)) {
      stats.catalogs = catalogsResult.value.length;
    }
  } else {
    console.error("DASHBOARD CATALOGS ERROR:", catalogsResult.reason);
  }

  return stats;
}
