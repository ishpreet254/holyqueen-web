"use client";

import { useState } from "react";

const ITEMS = [
  {
    title: "KYC Requirements",
    body: "Members complete identity, address, and income documentation as per co-operative society and banking practice.",
  },
  {
    title: "TDS & Income Tax",
    body: "Interest income may be subject to applicable tax rules. Branch staff can help members understand documentation needs.",
  },
  {
    title: "Customer Protection",
    body: "Transparent passbook records, SMS alerts, audit reviews, and branch-level support help protect member confidence.",
  },
  {
    title: "Privacy & Terms",
    body: "Member details are handled for account servicing, compliance, support, and communication with responsible data care.",
  },
];

export default function Policies() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="policies section" id="policies">
      <div className="section-heading centered reveal">
        <span className="eyebrow">Policies &amp; Trust</span>
        <h2>Readable, transparent protections for every member.</h2>
      </div>
      <div className="accordion reveal">
        {ITEMS.map((item, index) => (
          <div key={item.title}>
            <button
              className={`accordion-item${
                activeIndex === index ? " active" : ""
              }`}
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current === index ? -1 : index))
              }
            >
              <span>{item.title}</span>
              <strong>+</strong>
            </button>
            <div
              className={`accordion-panel${
                activeIndex === index ? " open" : ""
              }`}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
