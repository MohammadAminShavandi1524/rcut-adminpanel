"use client";

import { useRef, type ElementType } from "react";

import { createPortal } from "react-dom";

import {
  CalendarDays,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import type { ContactMessage } from "./contact-messages.api";
import { formatContactDate } from "./contact-messages.utils";

import { useContactMessageModalAnimation } from "./useContactMessageModalAnimation";

interface ContactMessageDetailsModalProps {
  open: boolean;
  onClose: () => void;
  message: ContactMessage;
}

const ContactMessageDetailsModal = ({
  open,
  onClose,
  message,
}: ContactMessageDetailsModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useContactMessageModalAnimation(open, onClose, backdropRef, modalRef);

  if (!open) return null;

  return createPortal(
    <div
      dir="rtl"
      className="3xl:p-6 fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 lg:p-4 2xl:p-5"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-message-details-title"
        onClick={(event) => event.stopPropagation()}
        className="border-border bg-card 3xl:max-w-[680px] relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-[680px] flex-col overflow-hidden rounded-xl border shadow-2xl sm:max-h-[calc(100dvh-32px)] lg:max-w-[560px] xl:max-w-[600px] 2xl:max-w-[640px]"
      >
        {/* Header */}
        <div className="border-border 3xl:px-6 3xl:py-5 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5 sm:py-4 lg:px-5 lg:py-4">
          <h2
            id="contact-message-details-title"
            className="text-foreground 3xl:text-lg text-[15px] font-semibold lg:text-base"
          >
            جزئیات پیام
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground 3xl:size-9 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors lg:size-8.5"
          >
            <X className="3xl:size-[18px] size-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {/* Information */}
          <div className="border-border s:grid-cols-2 grid grid-cols-1 border-b">
            <DetailItem
              icon={UserRound}
              label="نام و نام خانوادگی"
              value={message.full_name}
              className="border-border s:border-e border-b"
            />

            <DetailItem
              icon={Phone}
              label="شماره همراه"
              value={message.phone_number}
              className="border-border border-b"
            />

            <DetailItem
              icon={Mail}
              label="ایمیل"
              value={message.email}
              className="border-border s:border-b-0 s:border-e border-b"
            />

            <DetailItem
              icon={CalendarDays}
              label="تاریخ ثبت"
              value={formatContactDate(message.created, "fa")}
            />
          </div>

          {/* Message */}
          <div className="3xl:px-6 3xl:py-5 px-4 py-4 sm:px-5 lg:px-5 lg:py-4.5">
            <div className="3xl:mb-4 3xl:gap-2.5 mb-3 flex items-center gap-2">
              <MessageSquareText
                className="text-custom-primary 3xl:size-[18px] size-4"
                strokeWidth={1.8}
              />

              <h3 className="text-foreground 3xl:text-sm text-[13px] font-semibold">
                متن پیام
              </h3>
            </div>

            <div className="border-border bg-secondary-bg 3xl:max-h-[220px] 3xl:px-5 3xl:py-4 max-h-[180px] overflow-x-hidden overflow-y-auto rounded-lg border px-3 py-3 sm:max-h-[200px] sm:px-4 lg:max-h-[200px]">
              <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-justify text-[12px] leading-6 [overflow-wrap:anywhere] whitespace-pre-wrap 2xl:text-[13px]">
                {message.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

interface DetailItemProps {
  icon: ElementType;
  label: string;
  value: string;
  className?: string;
}

const DetailItem = ({
  icon: Icon,
  label,
  value,
  className,
}: DetailItemProps) => {
  return (
    <div
      className={`3xl:px-7 3xl:py-5 min-w-0 px-4 py-3.5 sm:px-4 sm:py-4 lg:px-5 lg:py-4 ${className ?? ""}`}
    >
      <div className="text-muted-foreground 3xl:mb-2 3xl:text-xs mb-1.5 flex items-center gap-2 text-[11px] font-medium">
        <Icon className="3xl:size-[15px] size-3.5 shrink-0" strokeWidth={1.8} />

        <span>{label}</span>
      </div>

      <p className="text-foreground 3xl:text-sm text-[12px] font-medium [overflow-wrap:anywhere] 2xl:text-[13px]">
        {value || "-"}
      </p>
    </div>
  );
};

export default ContactMessageDetailsModal;
