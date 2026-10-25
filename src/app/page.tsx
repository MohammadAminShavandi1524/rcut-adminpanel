import HeaderLayout from "@/components/Layout/HeaderLayout";

import DashboardPage from "@/components/dashboard/DashboardPage";

const Page = () => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HeaderLayout
        title="داشبورد"
        descrption="نمای کلی وضعیت و اطلاعات پنل مدیریت آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5">
        <DashboardPage />
      </div>
    </div>
  );
};

export default Page;
