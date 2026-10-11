"use client";

import { useEffect, useState } from "react";

import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { getLenisInstance } from "@/lib/lenis-instance";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const showThreshold = window.innerHeight;

      setShowButton(window.scrollY > showThreshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    const lenis = getLenisInstance();

    if (lenis) {
      lenis.scrollTo(0, {
        immediate: true,
      });

      return;
    }

    window.scrollTo({
      top: 0,
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "border-border-secondary bg-background text-foreground",

        "fixed end-6 bottom-6 z-40",

        "flex size-12 cursor-pointer items-center justify-center rounded-xl border",

        "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",

        "transition-[opacity,transform,background-color,border-color,color] duration-500 ease-out",

        "hover:border-custom-primary hover:bg-custom-primary hover:text-white",

        showButton
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <ArrowUp className="size-4.5" strokeWidth={1.8} />
    </button>
  );
};

export default ScrollToTop;
