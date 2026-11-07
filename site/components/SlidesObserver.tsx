"use client";

import { useEffect } from "react";

// Помечает слайд, который сейчас на экране: от этого прорисовывается символ города и ставится штемпель.
export function SlidesObserver({ selector }: { selector: string }) {
  useEffect(() => {
    const slides = document.querySelectorAll<HTMLElement>(selector);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.setAttribute("data-active", "true");
        }
      },
      { threshold: 0.55 },
    );
    slides.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
  return null;
}
