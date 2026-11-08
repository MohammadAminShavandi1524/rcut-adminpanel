import HeaderLayout from "@/components/Layout/HeaderLayout";

import EditCatalogForm from "@/components/catalogs/edit-catalog/EditCatalogForm";

interface PageProps {
  params: Promise<{
    catalog_id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { catalog_id } = await params;
  const catalogId = Number(catalog_id);

  if (!Number.isSafeInteger(catalogId) || catalogId <= 0) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderLayout
          title="ویرایش کاتالوگ"
          descrption="ویرایش اطلاعات کاتالوگ فروشگاه آرکات"
        />

        <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 items-center justify-center px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
          <p className="text-muted-foreground text-sm">
            شناسه کاتالوگ معتبر نیست.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title="ویرایش کاتالوگ"
        descrption="ویرایش اطلاعات کاتالوگ فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <EditCatalogForm catalogId={catalogId} />
      </div>
    </div>
  );
};

export default Page;