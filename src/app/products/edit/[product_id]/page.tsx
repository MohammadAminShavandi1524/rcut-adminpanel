import HeaderLayout from "@/components/Layout/HeaderLayout";

import EditProductForm from "@/components/products/edit-product/EditProductForm";

interface PageProps {
  params: Promise<{
    product_id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { product_id } = await params;

  const productId = Number(product_id);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderLayout
          title="ویرایش محصول"
          descrption="ویرایش اطلاعات محصول فروشگاه آرکات"
        />

        <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 items-center justify-center px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
          <p className="text-muted-foreground text-sm">
            شناسه محصول معتبر نیست.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title="ویرایش محصول"
        descrption="ویرایش اطلاعات محصول فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <EditProductForm productId={productId} />
      </div>
    </div>
  );
};

export default Page;
