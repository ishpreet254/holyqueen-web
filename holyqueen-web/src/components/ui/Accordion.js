"use client";

import { useState } from "react";

export default function Accordion({ items }) {
  const [active, setActive] = useState(0);

  return (
    <div className="accordion reveal">
      {items.map((item, index) => (
        <div key={item.title}>
          <button
            className={`accordion-item${active === index ? " active" : ""}`}
            type="button"
            aria-expanded={active === index}
            onClick={() =>
              setActive((current) => (current === index ? -1 : index))
            }
          >
            <span>{item.title}</span>
            <strong aria-hidden="true">{active === index ? "−" : "+"}</strong>
          </button>
          <div
            className={`accordion-panel${active === index ? " open" : ""}`}
            role="region"
          >
            {item.body}
          </div>
        </div>
      ))}
    </div>
  );
}
