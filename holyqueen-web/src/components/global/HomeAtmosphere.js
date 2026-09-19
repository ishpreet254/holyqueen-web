"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/* Home-route only. The particle canvas runs only in the dark theme, on
   pointer-fine viewports, and pauses whenever it scrolls out of view or the
   tab is hidden.

   The full-screen logo intro (once per session) covered the page for ~2s on a
   first visit, and until hydration on every load. It is off by default so
   content is there immediately; set INTRO_ENABLED to true to bring it back. */
const INTRO_ENABLED = false;

export default function HomeAtmosphere() {
  const introRef = useRef(null);

  useEffect(() => {
    const intro = introRef.current;
    if (!INTRO_ENABLED || !intro) return undefined;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem("hq-intro") === "done";
      window.sessionStorage.setItem("hq-intro", "done");
    } catch {
      seen = false;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Seen it this session, or the visitor asked for less motion: skip it. */
    if (seen || reduceMotion) {
      intro.classList.add("done");
      return undefined;
    }

    intro.classList.add("phase-logo", "phase-divider", "phase-text");
    const timers = [
      setTimeout(() => intro.classList.add("phase-tagline"), 420),
      setTimeout(() => intro.classList.add("scene-transition"), 900),
      setTimeout(() => intro.classList.add("done"), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const canvas = document.querySelector("#hero-canvas");
    if (!canvas) return undefined;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (!fine || reduceMotion || !isDark) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    const particles = [];
    let animationId = 0;
    let last = 0;
    let running = false;
    let visible = false;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      const count = Math.min(34, Math.floor(width / 40));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.4 + 0.45,
          speed: Math.random() * 0.22 + 0.08,
          alpha: Math.random() * 0.36 + 0.16,
        });
      }
    };

    const draw = (time = 0) => {
      if (!running) return;
      if (time - last < 72) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      last = time;
      context.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 230, 172, ${p.alpha})`;
        context.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    const refresh = () => {
      const shouldRun = visible && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        last = 0;
        animationId = requestAnimationFrame(draw);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(animationId);
      }
    };

    const onResize = () => {
      resize();
      seed();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        refresh();
      },
      { threshold: 0 }
    );

    resize();
    seed();
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", refresh);
      observer.disconnect();
    };
  }, []);

  if (!INTRO_ENABLED) return null;

  return (
    <div className="vault-intro" ref={introRef} aria-hidden="true">
      <div className="vault-logo-reveal">
        <p className="intro-kicker">Mysuru · Est. {site.established}</p>
        <Image
          className="brand-logo-large"
          src="/logo/holy-queen-logo.png"
          alt=""
          width={568}
          height={439}
          priority
        />
        <h1>{site.legalName}</h1>
        <strong>{site.tagline}</strong>
      </div>
      <div className="intro-divider"></div>
      <div className="vault-transition"></div>
    </div>
  );
}
