import HeaderLayout from "@/components/Layout/HeaderLayout";

const page = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title="داشبورد"
        descrption="نمای کلی وضعیت و اطلاعات پنل مدیریت آرکات"
      />
    </div>
  );
};

export default page;
