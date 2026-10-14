"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { Trash2 } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomHoldButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteContactMessage,
  type ContactMessage,
} from "./contact-messages.api";

import { formatContactDate, toPersianDigits } from "./contact-messages.utils";

import ContactMessageDetailsModal from "./ContactMessageDetailsModal";

gsap.registerPlugin(useGSAP);

interface ContactMessageRowProps {
  message: ContactMessage;
  setMessages: Dispatch<SetStateAction<ContactMessage[]>>;
  animationIndex?: number;
}

const ContactMessageRow = ({
  message,
  setMessages,
  animationIndex = 0,
}: ContactMessageRowProps) => {
  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);
  const deleteInProgress = useRef(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleDelete = async () => {
    if (deleteInProgress.current) {
      return;
    }

    deleteInProgress.current = true;

    try {
      await deleteContactMessage(String(message.id));

      setMessages((previous) =>
        previous.filter((item) => item.id !== message.id),
      );

      toast.success("پیام با موفقیت حذف شد.");
    } catch (error) {
      console.error("DELETE CONTACT MESSAGE ERROR:", error);

      toast.error("حذف پیام با خطا مواجه شد.");
    } finally {
      deleteInProgress.current = false;
    }
  };

  useGSAP(
    () => {
      if (!rowRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: Math.min(animationIndex, 8) * 0.055,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );

  return (
    <>
      <article
        dir="rtl"
        ref={rowRef}
        onClick={() => setDetailsOpen(true)}
        className="contact-message-row group/message border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative cursor-pointer rounded-lg border transition-[background-color,border-color] duration-300"
      >
        <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/message:scale-y-100" />

        <div className="3xl:min-h-[76px] 3xl:grid-cols-[60px_1.25fr_1.15fr_1.45fr_2fr_135px_110px] 3xl:gap-4 3xl:px-5 3xl:py-3 grid min-h-[76px] grid-cols-[60px_1.25fr_1.15fr_1.45fr_2fr_135px_110px] items-center gap-4 px-5 py-3 xl:min-h-[66px] xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1.55fr_110px_86px] xl:gap-2.5 xl:px-3 xl:py-2.5 2xl:min-h-[71px] 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.75fr_120px_96px] 2xl:gap-3 2xl:px-4">
          {/* ID */}
          <div className="text-muted-foreground text-sm xl:text-[12px] 2xl:text-[13px]">
            {toPersianDigits(message.id)}
          </div>

          {/* Full Name */}
          <div className="min-w-0">
            <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
              {message.full_name}
            </p>
          </div>

          {/* Phone */}
          <div className="text-muted-foreground 3xl:text-sm min-w-0 truncate text-sm xl:text-[12px] 2xl:text-[13px]">
            {message.phone_number}
          </div>

          {/* Email */}
          <div className="min-w-0" onClick={(event) => event.stopPropagation()}>
            <a
              href={`mailto:${message.email}`}
              className="text-muted-foreground hover:text-custom-primary 3xl:text-sm block truncate text-sm transition-colors duration-300 xl:text-[12px] 2xl:text-[13px]"
            >
              {message.email}
            </a>
          </div>

          {/* Message */}
          <div className="3xl:pe-3 min-w-0 pe-3 xl:pe-1 2xl:pe-2">
            <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-sm leading-6 xl:text-[12px] xl:leading-5 2xl:text-[13px]">
              {message.message}
            </p>
          </div>

          {/* Date */}
          <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
            {formatContactDate(message.created, "fa")}
          </div>

          {/* Actions */}
          <div
            className="flex justify-center"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <CustomHoldButton
              type="button"
              intent="destructive"
              variant="soft"
              duration={800}
              onComplete={handleDelete}
              leftSection={
                <Trash2 className="3xl:size-[17px] size-4" strokeWidth={1.8} />
              }
              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
            >
              حذف
            </CustomHoldButton>
          </div>
        </div>
      </article>

      <ContactMessageDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        message={message}
      />
    </>
  );
};

export default ContactMessageRow;