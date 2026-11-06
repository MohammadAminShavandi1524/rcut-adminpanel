import HeaderLayout from "@/components/Layout/HeaderLayout";

import AddBrandForm from "@/components/brands/add-brand/AddBrandForm";

const Page = () => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title="افزودن برند"
        descrption="ثبت برند جدید در فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <AddBrandForm />
      </div>
    </div>
  );
};

export default Page;
