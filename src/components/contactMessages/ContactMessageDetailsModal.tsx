"use client";

import { useEffect, useRef, type ElementType } from "react";

import { createPortal } from "react-dom";

import {
  CalendarDays,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import gsap from "gsap";

import type { ContactMessage } from "./contact-messages.api";

import { formatContactDate } from "./contact-messages.utils";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduceMotion && backdropRef.current && modalRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
      );

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 16, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        },
      );
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      ref={containerRef}
      className="3xl:p-6 fixed inset-0 z-[9999] flex items-center justify-center p-6 xl:p-4 2xl:p-5"
      onClick={onClose}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-message-details-title"
        onClick={(event) => event.stopPropagation()}
        className="border-border bg-card 3xl:max-w-[680px] relative z-10 w-full max-w-[680px] overflow-hidden rounded-xl border shadow-2xl xl:max-w-[600px] 2xl:max-w-[640px]"
      >
        {/* Header */}
        <div className="border-border flex items-center justify-between gap-5 border-b px-6 py-5">
          <h2
            id="contact-message-details-title"
            className="text-foreground text-lg font-semibold"
          >
            جزئیات پیام
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Information */}
        <div className="border-border grid grid-cols-2 border-b">
          <DetailItem
            icon={UserRound}
            label="نام و نام خانوادگی"
            value={message.full_name}
            className="border-border border-e border-b"
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
            className="border-border border-e"
          />

          <DetailItem
            icon={CalendarDays}
            label="تاریخ ثبت"
            value={formatContactDate(message.created, "fa")}
          />
        </div>

        {/* Message */}
        <div className="px-6 py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <MessageSquareText
              size={18}
              strokeWidth={1.8}
              className="text-custom-primary"
            />

            <h3 className="text-foreground text-sm font-semibold">متن پیام</h3>
          </div>

          <div className="border-border bg-secondary-bg max-h-[220px] overflow-x-hidden overflow-y-auto rounded-lg border px-5 py-4">
            <p className="text-foreground text-sm leading-7 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
              {message.message}
            </p>
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
    <div className={`3xl:px-7 3xl:py-5 min-w-0 px-6 py-5 ${className ?? ""}`}>
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium">
        <Icon size={15} strokeWidth={1.8} />
        <span>{label}</span>
      </div>

      <p className="text-foreground text-sm font-medium [overflow-wrap:anywhere] break-words">
        {value || "-"}
      </p>
    </div>
  );
};

export default ContactMessageDetailsModal;
