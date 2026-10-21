"use client";

import { useEffect, type RefObject } from "react";

import gsap from "gsap";

export const useContactMessageModalAnimation = (
  open: boolean,
  onClose: () => void,
  backdropRef: RefObject<HTMLDivElement | null>,
  modalRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    if (!open) return;

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

    const animations: gsap.core.Tween[] = [];

    if (!reduceMotion && backdropRef.current && modalRef.current) {
      animations.push(
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          },
        ),
      );

      animations.push(
        gsap.fromTo(
          modalRef.current,
          {
            opacity: 0,
            y: 16,
            scale: 0.985,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          },
        ),
      );
    }

    return () => {
      animations.forEach((animation) => animation.kill());

      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, backdropRef, modalRef]);
};