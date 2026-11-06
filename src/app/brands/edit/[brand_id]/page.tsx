import HeaderLayout from "@/components/Layout/HeaderLayout";

import EditBrandForm from "@/components/brands/edit-brand/EditBrandForm";

interface PageProps {
  params: Promise<{
    brand_id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { brand_id } = await params;
  const brandId = Number(brand_id);

  if (!Number.isSafeInteger(brandId) || brandId <= 0) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderLayout
          title="ویرایش برند"
          descrption="ویرایش اطلاعات برند فروشگاه آرکات"
        />

        <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 items-center justify-center px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
          <p className="text-muted-foreground text-sm">
            شناسه برند معتبر نیست.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title="ویرایش برند"
        descrption="ویرایش اطلاعات برند فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <EditBrandForm brandId={brandId} />
      </div>
    </div>
  );
};

export default Page;