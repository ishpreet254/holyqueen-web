"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Holy Queen explained every detail clearly and helped me choose a plan with confidence.",
    name: "Savitha R.",
  },
  {
    quote:
      "The monthly pension plan gave my family a simple, predictable income path.",
    name: "Mahesh K.",
  },
  {
    quote:
      "Their branch team combines old-fashioned trust with modern communication.",
    name: "Nandini S.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const goTo = (nextIndex) => {
    setIndex(
      (nextIndex + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 6400);
    return () => clearInterval(timerRef.current);
  }, []);

  const current = TESTIMONIALS[index];

  return (
    <section className="testimonials section" id="testimonials">
      <div className="section-heading centered reveal">
        <span className="eyebrow">Customer Voices</span>
        <h2>Calm confidence from people investing for real milestones.</h2>
      </div>
      <div className="testimonial-card reveal">
        <p>{current.quote}</p>
        <strong>{current.name}</strong>
        <div className="testimonial-controls">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goTo(index - 1)}
          >
            Prev
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goTo(index + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
