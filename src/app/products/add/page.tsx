import HeaderLayout from "@/components/Layout/HeaderLayout";

import AddProductForm from "@/components/products/add-product/AddProductForm";

const Page = () => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title="افزودن محصول"
        descrption="ثبت محصول جدید در فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <AddProductForm />
      </div>
    </div>
  );
};

export default Page;