"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export const useContactMessagesSortAnimation = (
  rowsRef: RefObject<HTMLDivElement | null>,
  sort: "newest" | "oldest",
) => {
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const captureSortState = () => {
    flipStateRef.current = null;

    const rows = rowsRef.current?.querySelectorAll(".contact-message-row");

    if (rows?.length) {
      flipStateRef.current = Flip.getState(rows);
    }
  };

  useLayoutEffect(() => {
    const previousState = flipStateRef.current;

    if (!previousState) return;

    flipStateRef.current = null;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const animation = Flip.from(previousState, {
      duration: 0.55,
      ease: "power3.inOut",
      stagger: 0.025,
    });

    return () => {
      animation.kill();
    };
  }, [sort]);

  return { captureSortState };
};
