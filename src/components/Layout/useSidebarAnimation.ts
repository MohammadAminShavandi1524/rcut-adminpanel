"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useSidebarAnimation = (
  sidebarRef: RefObject<HTMLElement | null>,
) => {
  useGSAP(
    () => {
      if (!sidebarRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        sidebarRef.current,
        {
          opacity: 0,
          x: -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          clearProps: "opacity,transform",
        },
      );

      timeline.fromTo(
        ".sidebar-brand",
        {
          opacity: 0,
          y: -8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          clearProps: "opacity,transform",
        },
        "-=0.25",
      );

      timeline.fromTo(
        ".sidebar-section",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          clearProps: "opacity,transform",
        },
        "-=0.2",
      );
    },
    {
      scope: sidebarRef,
    },
  );
};
