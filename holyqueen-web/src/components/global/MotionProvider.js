"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Runs on every route. Cheap by design: one rAF-throttled scroll handler
   drives the progress bar, the counter animation and the section reveal —
   the reveal used to run on its own IntersectionObserver, but on some
   browsers (mobile momentum scrolling especially) that callback can lag
   noticeably behind the actual scroll position, so a section already on
   screen would render empty until the *next* scroll event nudged the
   observer to fire. Checking bounding boxes inside the same rAF tick as
   everything else removes that gap. */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const cleanup = [];

    const progress = document.querySelector(".progress");
    let revealTargets = Array.from(
      document.querySelectorAll(".reveal:not(.visible)")
    );

    const revealDue = () => {
      if (!revealTargets.length) return;
      const vh = window.innerHeight;
      revealTargets = revealTargets.filter((el) => {
        const rect = el.getBoundingClientRect();
        const due = rect.top < vh * 1.15 && rect.bottom > -200;
        if (due) el.classList.add("visible");
        return !due;
      });
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const percent = max > 0 ? window.scrollY / max : 0;
        if (progress) progress.style.transform = `scaleX(${percent})`;
        revealDue();
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    revealDue();
    cleanup.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    });

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
