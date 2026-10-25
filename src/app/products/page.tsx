import HeaderLayout from "@/components/Layout/HeaderLayout";

import ProductsTable from "@/components/products/ProductsTable";

const Page = () => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title="مدیریت محصولات"
        descrption="مشاهده، ویرایش و حذف محصولات فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <ProductsTable />
      </div>
    </div>
  );
};

export default Page;
