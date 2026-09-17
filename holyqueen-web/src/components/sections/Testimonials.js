"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/policies";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let timer = 0;
    let visible = false;
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const refresh = () => {
      stop();
      if (!visible || document.hidden) return;
      timer = window.setInterval(() => {
        setIndex((current) => (current + 1) % testimonials.length);
      }, 6400);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        refresh();
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const current = testimonials[index];

  return (
    <section className="testimonials section" id="testimonials" ref={sectionRef}>
      <SectionHeading
        centered
        eyebrow="Member voices"
        title="Calm confidence from people saving for real goals."
      />
      <div className="testimonial-card reveal">
        <p>{current.quote}</p>
        <strong>{current.name}</strong>
        <div className="testimonial-controls">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() =>
              setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
            }
          >
            Prev
          </button>
          <div className="testimonial-dots" aria-hidden="true">
            {testimonials.map((item, i) => (
              <span key={item.name} className={i === index ? "on" : undefined} />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
