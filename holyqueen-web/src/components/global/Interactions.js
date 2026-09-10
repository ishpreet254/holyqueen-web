"use client";

import { useEffect } from "react";

export default function Interactions() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const intro = document.querySelector(".vault-intro");
    const introCanvas = document.querySelector("#intro-canvas");
    const introSound = document.querySelector(".vault-sound");
    const ambientAudio = document.querySelector("#ambient-audio");
    const heroSounds = document.querySelectorAll(".audio-toggle");

    const cleanupFns = [];

    // ─── Sync all audio toggle buttons (intro + hero) ───────────────────
    function syncAudio(active) {
      const allButtons = [introSound, ...heroSounds].filter(Boolean);
      allButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(active));
        btn.textContent = active
          ? btn === introSound
            ? "Sound On"
            : "Ambient On"
          : btn === introSound
          ? "Sound Off"
          : "Ambient Off";
      });
    }

    async function toggleAmbient(button) {
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
    }

    if (introSound) {
      const handler = () => toggleAmbient(introSound);
      introSound.addEventListener("click", handler);
      cleanupFns.push(() => introSound.removeEventListener("click", handler));
    }

    heroSounds.forEach((btn) => {
      const handler = () => toggleAmbient(btn);
      btn.addEventListener("click", handler);
      cleanupFns.push(() => btn.removeEventListener("click", handler));
    });

    // ─── Intro particle canvas ───────────────────────────────────────────
    let introRid = 0;
    if (!reduceMotion && introCanvas) {
      const ctx = introCanvas.getContext("2d");
      let W = 0,
        H = 0,
        pts = [];

      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        W = introCanvas.offsetWidth;
        H = introCanvas.offsetHeight;
        introCanvas.width = W * dpr;
        introCanvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function seedParticles() {
        pts = [];
        const count = Math.min(90, Math.floor(W / 14));
        for (let i = 0; i < count; i++) {
          pts.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.6 + 0.4,
            spd: Math.random() * 0.28 + 0.08,
            alpha: Math.random() * 0.55 + 0.15,
            flicker: Math.random() * Math.PI * 2,
          });
        }
      }

      let last = 0;
      function drawParticles(t) {
        if (t - last < 38) {
          introRid = requestAnimationFrame(drawParticles);
          return;
        }
        last = t;
        ctx.clearRect(0, 0, W, H);
        const tick = t * 0.001;
        pts.forEach((p) => {
          p.y -= p.spd;
          p.x += Math.sin(p.y * 0.012 + p.flicker) * 0.3;
          if (p.y < -8) {
            p.y = H + 8;
            p.x = Math.random() * W;
          }
          const alpha = p.alpha * (0.7 + 0.3 * Math.sin(tick * 1.4 + p.flicker));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(246,201,103,${alpha})`;
          ctx.fill();
        });
        introRid = requestAnimationFrame(drawParticles);
      }

      const onResize = () => {
        resizeCanvas();
        seedParticles();
      };
      window.addEventListener("resize", onResize, { passive: true });
      cleanupFns.push(() =>
        window.removeEventListener("resize", onResize)
      );
      resizeCanvas();
      seedParticles();
      introRid = requestAnimationFrame(drawParticles);

      const onTransitionEnd = () => {
        cancelAnimationFrame(introRid);
        introCanvas.width = 1;
        introCanvas.height = 1;
      };
      intro?.addEventListener("transitionend", onTransitionEnd, {
        once: true,
      });
      cleanupFns.push(() =>
        intro?.removeEventListener("transitionend", onTransitionEnd)
      );
    }

    // ─── Orchestrate intro phases ────────────────────────────────────────
    function finishIntro() {
      intro?.classList.add("done");
    }

    const introTimers = [
      setTimeout(() => intro?.classList.add("phase-logo"), 600),
      setTimeout(() => intro?.classList.add("phase-divider"), 1800),
      setTimeout(() => intro?.classList.add("phase-text"), 2500),
      setTimeout(() => intro?.classList.add("phase-tagline"), 3400),
      setTimeout(() => intro?.classList.add("scene-transition"), 5200),
      setTimeout(finishIntro, 6600),
      setTimeout(finishIntro, 13000), // fallback
    ];
    cleanupFns.push(() => introTimers.forEach(clearTimeout));

    // ─── Scroll progress bar ─────────────────────────────────────────────
    const progress = document.querySelector(".progress");
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.width = `${(window.scrollY / max) * 100}%`;
        scrollFrame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanupFns.push(() => window.removeEventListener("scroll", onScroll));

    // ─── Cursor glow ──────────────────────────────────────────────────────
    const cursorGlow = document.querySelector(".cursor-glow");
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    let pointerFrame = 0;
    let pointerX = -999;
    let pointerY = -999;

    if (hasFinePointer && cursorGlow) {
      const onPointerMove = (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
          cursorGlow.style.transform = `translate3d(${pointerX - 288}px, ${
            pointerY - 288
          }px, 0)`;
          pointerFrame = 0;
        });
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      cleanupFns.push(() =>
        window.removeEventListener("pointermove", onPointerMove)
      );
    } else if (cursorGlow) {
      cursorGlow.style.display = "none";
    }

    // ─── Reveal-on-scroll ─────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    document.querySelectorAll(".reveal").forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 80}ms`;
      revealObserver.observe(item);
    });
    cleanupFns.push(() => revealObserver.disconnect());

    // ─── Animated counters ──────────────────────────────────────────────
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.counter);
          const decimal = String(target).includes(".");
          let current = 0;
          const steps = 52;
          const tick = () => {
            current += target / steps;
            if (current >= target) current = target;
            el.textContent = decimal ? current.toFixed(1) : Math.round(current);
            if (current < target) requestAnimationFrame(tick);
          };
          tick();
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll("[data-counter]")
      .forEach((item) => counterObserver.observe(item));
    cleanupFns.push(() => counterObserver.disconnect());

    // ─── Tilt cards ───────────────────────────────────────────────────────
    const tiltHandlers = [];
    document.querySelectorAll(".tilt").forEach((card) => {
      const onMove = (event) => {
        if (reduceMotion) return;
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
        card.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      tiltHandlers.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    });
    cleanupFns.push(() => tiltHandlers.forEach((fn) => fn()));

    // ─── Magnetic buttons ───────────────────────────────────────────────
    const magneticHandlers = [];
    document.querySelectorAll(".magnetic").forEach((button) => {
      const onMove = (event) => {
        if (reduceMotion) return;
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        button.style.transform = `translate(${x}px, ${y}px)`;
      };
      const onLeave = () => {
        button.style.transform = "";
      };
      button.addEventListener("pointermove", onMove);
      button.addEventListener("pointerleave", onLeave);
      magneticHandlers.push(() => {
        button.removeEventListener("pointermove", onMove);
        button.removeEventListener("pointerleave", onLeave);
      });
    });
    cleanupFns.push(() => magneticHandlers.forEach((fn) => fn()));

    // ─── Hero canvas particles ────────────────────────────────────────────
    function setupParticles(canvas, options) {
      if (!canvas) return () => {};
      const context = canvas.getContext("2d");
      const particles = [];
      const mediaQuery = window.matchMedia("(max-width: 680px)");
      let animationId = 0;
      let lastFrame = 0;
      let stopped = false;
      let width = 0;
      let height = 0;

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, options.dpr || 1.35);
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function seed() {
        particles.length = 0;
        const cap = mediaQuery.matches ? options.mobileCount : options.count;
        const count = Math.floor(Math.min(cap, width / options.density));
        for (let index = 0; index < count; index++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * options.size + 0.5,
            speed: Math.random() * options.speed + 0.15,
            alpha: Math.random() * 0.6 + 0.2,
          });
        }
      }

      function draw(time = 0) {
        if (stopped || document.hidden) {
          animationId = requestAnimationFrame(draw);
          return;
        }
        if (time - lastFrame < options.frameMs) {
          animationId = requestAnimationFrame(draw);
          return;
        }
        lastFrame = time;
        context.clearRect(0, 0, width, height);
        particles.forEach((particle) => {
          particle.y -= particle.speed;
          particle.x += Math.sin((particle.y + particle.size) * 0.01) * 0.35;
          if (particle.y < -10) {
            particle.y = height + 10;
            particle.x = Math.random() * width;
          }
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(${options.color}, ${particle.alpha})`;
          context.fill();
        });
        animationId = requestAnimationFrame(draw);
      }

      resize();
      seed();
      const onResize = () => {
        resize();
        seed();
      };
      window.addEventListener("resize", onResize);
      if (!reduceMotion) {
        animationId = requestAnimationFrame(draw);
      }

      let onIntroEnd;
      if (options.stopAfterIntro && intro) {
        onIntroEnd = () => {
          stopped = true;
          cancelAnimationFrame(animationId);
          canvas.width = 1;
          canvas.height = 1;
        };
        intro.addEventListener("transitionend", onIntroEnd, { once: true });
      }

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animationId);
        if (onIntroEnd) intro?.removeEventListener("transitionend", onIntroEnd);
      };
    }

    const stopHeroParticles = setupParticles(
      document.querySelector("#hero-canvas"),
      {
        color: "255, 230, 172",
        speed: 0.32,
        size: 1.7,
        count: 78,
        mobileCount: 34,
        density: 15,
        frameMs: 42,
      }
    );
    cleanupFns.push(stopHeroParticles);

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}
