"use client";

import { useState } from "react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#schemes", label: "Schemes" },
  { href: "#deposits", label: "Deposit Plans" },
  { href: "#calculator", label: "Interest Calculator" },
  { href: "#policies", label: "Policies" },
  { href: "#contact", label: "Contact" },
];

const MOBILE_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#schemes", label: "Schemes" },
  { href: "#deposits", label: "Deposit Plans" },
  { href: "#calculator", label: "Interest Calculator" },
  { href: "#why", label: "Why Choose Us" },
  { href: "#policies", label: "Policies" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="nav-shell">
        <a className="brand" href="#home" aria-label="Holy Queen home">
          <span className="mini-crest">HQ</span>
          <span>
            <strong>HOLY QUEEN</strong>
            <small>Credit Souhardha Co-operative Society</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="tel:+917411321690">
          Call Branch
        </a>
        <button
          className={`menu-toggle${open ? " active" : ""}`}
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
        </button>
      </header>

      <nav
        className={`mobile-menu${open ? " open" : ""}`}
        aria-label="Mobile navigation"
      >
        {MOBILE_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
}
