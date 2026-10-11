"use client";

import { useEffect, type ReactNode } from "react";

import Lenis from "lenis";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { setLenisInstance } from "@/lib/lenis-instance";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 0.75,
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1,

      prevent: (node) => {
        return (
          node instanceof HTMLElement &&
          (node.hasAttribute("data-lenis-prevent") ||
            node.hasAttribute("data-lenis-prevent-wheel"))
        );
      },
    });

    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);

      lenis.destroy();

      setLenisInstance(null);
    };
  }, []);

  return children;
}