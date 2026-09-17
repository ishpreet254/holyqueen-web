"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Runs on every route. Cheap by design: one rAF-throttled scroll handler and
   two IntersectionObservers that unobserve as soon as they fire. */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const cleanup = [];

    const progress = document.querySelector(".progress");
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const percent = max > 0 ? window.scrollY / max : 0;
        if (progress) progress.style.transform = `scaleX(${percent})`;
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanup.push(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    document
      .querySelectorAll(".reveal:not(.visible)")
      .forEach((el) => revealObserver.observe(el));
    cleanup.push(() => revealObserver.disconnect());

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.counter);
          const decimal = String(el.dataset.counter).includes(".");
          const duration = reduceMotion ? 1 : 720;
          const start = performance.now();
          const tick = (time) => {
            const t = Math.min(1, (time - start) / duration);
            const value = target * (1 - Math.pow(1 - t, 3));
            el.textContent = decimal ? value.toFixed(1) : Math.round(value);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll("[data-counter]")
      .forEach((el) => counterObserver.observe(el));
    cleanup.push(() => counterObserver.disconnect());

    return () => cleanup.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
