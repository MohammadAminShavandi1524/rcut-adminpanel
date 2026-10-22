import { notFound } from "next/navigation";

import CategoryForm from "@/components/categories/CategoryForm";

interface PageProps {
  params: Promise<{ category_id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category_id } = await params;

  const id = Number(category_id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <CategoryForm mode="create" categoryId={id} />;
}
