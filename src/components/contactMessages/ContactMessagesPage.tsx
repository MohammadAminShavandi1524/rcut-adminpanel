"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowDownUp, Search } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomToast } from "@/components/ui/custom-toast";

import HeaderLayout from "@/components/Layout/HeaderLayout";

import {
  getContactMessages,
  type ContactMessage,
} from "./contact-messages.api";

import ContactMessageRow from "./ContactMessageRow";

import { useContactMessagesSortAnimation } from "./useContactMessagesSortAnimation";

type SortType = "newest" | "oldest";

const ContactMessagesPage = () => {
  const toast = useCustomToast();

  const rowsRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortType>("newest");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const { captureSortState } = useContactMessagesSortAnimation(rowsRef, sort);

  useEffect(() => {
    let isActive = true;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getContactMessages();

        if (isActive) {
          setMessages(data);
        }
      } catch (error) {
        console.error("GET CONTACT MESSAGES ERROR:", error);

        if (isActive) {
          setLoadError(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchMessages();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...messages]
      .filter((message) => {
        if (!normalizedSearch) return true;

        return [
          message.full_name,
          message.phone_number,
          message.email,
          message.message,
          String(message.id),
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );
      })
      .sort((a, b) => {
        const firstDate = new Date(a.created).getTime();
        const secondDate = new Date(b.created).getTime();

        const safeFirstDate = Number.isNaN(firstDate) ? 0 : firstDate;

        const safeSecondDate = Number.isNaN(secondDate) ? 0 : secondDate;

        return sort === "newest"
          ? safeSecondDate - safeFirstDate
          : safeFirstDate - safeSecondDate;
      });
  }, [messages, search, sort]);

  const handleSort = () => {
    captureSortState();

    setSort((previous) => (previous === "newest" ? "oldest" : "newest"));
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setLoadError(false);

      const data = await getContactMessages();

      setMessages(data);
    } catch (error) {
      console.error("RETRY GET CONTACT MESSAGES ERROR:", error);

      setLoadError(true);
      toast.error("دریافت پیام‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  const gridClass =
    "grid grid-cols-[42px_1.1fr_0.95fr_1.2fr_1.35fr_105px_86px] items-center gap-2 xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1.55fr_110px_86px] xl:gap-2.5 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.75fr_120px_96px] 2xl:gap-3 3xl:grid-cols-[60px_1.25fr_1.15fr_1.45fr_2fr_135px_110px] 3xl:gap-4";

  return (
    <div dir="rtl" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HeaderLayout
        title="پیام‌های دریافتی"
        descrption="مدیریت پیام‌های ارسال‌شده از طریق فرم تماس سایت"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col px-3 py-3 xl:px-5 xl:py-5 2xl:px-6">
        <section className="contact-messages-panel border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
          {/* Toolbar */}
          <div className="border-border 3xl:gap-5 3xl:p-5 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-3 lg:gap-3 xl:p-4 2xl:gap-4 2xl:p-4.5">
            {/* Search */}
            <div className="contact-messages-search 3xl:max-w-[520px] relative min-w-0 flex-1 lg:max-w-[350px] xl:max-w-[400px] 2xl:max-w-[460px]">
              <Search
                strokeWidth={1.8}
                className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی نام، شماره، ایمیل یا پیام..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-10 w-full rounded-lg border ps-10 pe-3 text-[12px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:text-[14px] 2xl:h-11.5"
              />
            </div>

            {/* Sort */}
            <div className="contact-messages-sort shrink-0">
              <button
                type="button"
                onClick={handleSort}
                className="border-border bg-background text-foreground hover:border-border-secondary hover:bg-secondary-bg 3xl:h-12 3xl:px-5 3xl:text-[15px] flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium transition-colors duration-300 lg:gap-2 lg:px-3 lg:text-[12px] xl:h-11 xl:px-4 xl:text-[14px] 2xl:h-11.5"
              >
                <ArrowDownUp
                  strokeWidth={1.8}
                  className="3xl:size-[18px] size-3.5 xl:size-4"
                />

                <span>
                  {sort === "newest"
                    ? "جدیدترین پیام‌ها"
                    : "قدیمی‌ترین پیام‌ها"}
                </span>
              </button>
            </div>
          </div>

          {/* Horizontal Table Scroll */}
          <div
            dir="rtl"
            className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden"
          >
            <div className="3xl:min-w-[1200px] flex h-full min-h-0 min-w-[1050px] flex-col xl:min-w-[1000px] 2xl:min-w-[1100px]">
              {/* Table Header */}
              <div className="contact-messages-table-header border-border bg-card-secondary 3xl:ps-9 3xl:pe-11 shrink-0 border-b ps-6 pe-6 xl:ps-6 xl:pe-8 2xl:ps-7 2xl:pe-9">
                <div
                  className={`text-muted-foreground 3xl:h-13 3xl:text-sm h-11 text-[11px] font-semibold xl:text-[12px] 2xl:h-12 2xl:text-[13px] ${gridClass}`}
                >
                  <div>شناسه</div>
                  <div>نام و نام خانوادگی</div>
                  <div>شماره همراه</div>
                  <div>ایمیل</div>
                  <div>متن پیام</div>
                  <div>تاریخ ثبت</div>
                  <div className="text-center">عملیات</div>
                </div>
              </div>

              {/* Table Content */}
              {loading ? (
                <div className="flex min-h-0 flex-1 items-center justify-center gap-3">
                  <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

                  <span className="text-muted-foreground text-sm">
                    در حال دریافت پیام‌ها...
                  </span>
                </div>
              ) : loadError ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    در دریافت اطلاعات مشکلی پیش آمده است.
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="bg-custom-primary cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    تلاش مجدد
                  </button>
                </div>
              ) : filteredMessages.length > 0 ? (
                <ScrollArea
                  dir="rtl"
                  className="min-h-0 flex-1"
                  scrollBarClassName="me-1.75"
                >
                  <div
                    ref={rowsRef}
                    className="3xl:space-y-2.5 3xl:p-4 3xl:pe-6 space-y-2 p-3 pe-5 xl:space-y-2 xl:p-3 xl:pe-4.5 2xl:p-3.5 2xl:pe-5"
                  >
                    {filteredMessages.map((message, index) => (
                      <ContactMessageRow
                        key={message.id}
                        message={message}
                        setMessages={setMessages}
                        animationIndex={index}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                  <h3 className="text-foreground text-base font-semibold">
                    {search ? "پیامی پیدا نشد" : "هنوز پیامی ثبت نشده است"}
                  </h3>

                  <p className="text-muted-foreground mt-2 text-justify text-sm leading-6">
                    {search
                      ? "عبارت جست‌وجو را تغییر بده و دوباره امتحان کن."
                      : "پیام‌های ارسال‌شده از طریق فرم تماس در این قسمت نمایش داده می‌شوند."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactMessagesPage;
