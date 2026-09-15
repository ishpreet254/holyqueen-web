"use client";

import { useEffect } from "react";

export default function Interactions() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 680px)").matches;
    const intro = document.querySelector(".vault-intro");
    const introSound = document.querySelector(".vault-sound");
    const ambientAudio = document.querySelector("#ambient-audio");
    const heroSounds = document.querySelectorAll(".audio-toggle");
    const cleanupFns = [];

    const syncAudio = (active) => {
      [introSound, ...heroSounds].filter(Boolean).forEach((button) => {
        const isIntroButton = button === introSound;
        button.setAttribute("aria-pressed", String(active));
        button.textContent = active
          ? isIntroButton
            ? "Sound On"
            : "Ambient On"
          : isIntroButton
          ? "Sound Off"
          : "Ambient Off";
      });
    };

    const toggleAmbient = async (button) => {
      const active = button.getAttribute("aria-pressed") === "true";
      if (active) {
        ambientAudio?.pause();
        syncAudio(false);
        return;
      }

      try {
        if (ambientAudio) {
          ambientAudio.volume = Number(ambientAudio.dataset.volume || 0.12);
          await ambientAudio.play();
        }
        syncAudio(true);
      } catch {
        button.textContent = "Tap Again";
      }
    };

    [introSound, ...heroSounds].filter(Boolean).forEach((button) => {
      const handler = () => toggleAmbient(button);
      button.addEventListener("click", handler);
      cleanupFns.push(() => button.removeEventListener("click", handler));
    });

    const finishIntro = () => intro?.classList.add("done");
    intro?.classList.add("phase-logo", "phase-divider", "phase-text");
    const introTimers = reduceMotion
      ? [setTimeout(finishIntro, 120)]
      : [
          setTimeout(() => intro?.classList.add("phase-tagline"), 420),
          setTimeout(() => intro?.classList.add("scene-transition"), 980),
          setTimeout(finishIntro, 1500),
          setTimeout(finishIntro, 3200),
        ];
    cleanupFns.push(() => introTimers.forEach(clearTimeout));

    const progress = document.querySelector(".progress");
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
        if (progress) progress.style.transform = `scaleX(${percent / 100})`;
        scrollFrame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanupFns.push(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollFrame);
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
    document.querySelectorAll(".reveal").forEach((item) => {
      revealObserver.observe(item);
    });
    cleanupFns.push(() => revealObserver.disconnect());

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
            const progressValue = Math.min(1, (time - start) / duration);
            const eased = 1 - Math.pow(1 - progressValue, 3);
            const value = target * eased;
            el.textContent = decimal ? value.toFixed(1) : Math.round(value);
            if (progressValue < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll("[data-counter]")
      .forEach((item) => counterObserver.observe(item));
    cleanupFns.push(() => counterObserver.disconnect());

    const setupParticles = (canvas) => {
      if (!canvas || reduceMotion || isMobile) return () => {};

      const context = canvas.getContext("2d", { alpha: true });
      const particles = [];
      let animationId = 0;
      let lastFrame = 0;
      let running = false;
      let visible = false;
      let allowedToRun = false;
      let width = 0;
      let height = 0;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.15);
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const seed = () => {
        particles.length = 0;
        const count = Math.min(36, Math.floor(width / 34));
        for (let index = 0; index < count; index += 1) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.4 + 0.45,
            speed: Math.random() * 0.22 + 0.08,
            alpha: Math.random() * 0.38 + 0.18,
          });
        }
      };

      const draw = (time = 0) => {
        if (!running) return;
        if (time - lastFrame < 72) {
          animationId = requestAnimationFrame(draw);
          return;
        }

        lastFrame = time;
        context.clearRect(0, 0, width, height);
        particles.forEach((particle) => {
          particle.y -= particle.speed;
          if (particle.y < -10) {
            particle.y = height + 10;
            particle.x = Math.random() * width;
          }
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 230, 172, ${particle.alpha})`;
          context.fill();
        });
        animationId = requestAnimationFrame(draw);
      };

      const refresh = () => {
        const shouldRun = allowedToRun && visible && !document.hidden;
        if (shouldRun && !running) {
          running = true;
          lastFrame = 0;
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
      const onVisibilityChange = () => refresh();
      const onIntroDone = () => {
        allowedToRun = true;
        refresh();
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
      document.addEventListener("visibilitychange", onVisibilityChange);
      intro?.addEventListener("transitionend", onIntroDone, { once: true });
      observer.observe(canvas);

      return () => {
        running = false;
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        intro?.removeEventListener("transitionend", onIntroDone);
        observer.disconnect();
      };
    };

    cleanupFns.push(setupParticles(document.querySelector("#hero-canvas")));

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}
