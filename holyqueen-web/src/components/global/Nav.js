"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, utilityLinks } from "@/content/nav";
import { site } from "@/content/site";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState(-1);
  const [drawerTop, setDrawerTop] = useState(84);
  const [condensed, setCondensed] = useState(false);
  const headerRef = useRef(null);
  const drawerRef = useRef(null);
  const closeTimer = useRef(0);
  /* Index of a dropdown the visitor opened by clicking its arrow. A pinned
     panel stays open when the pointer leaves; hover panels do not. */
  const pinned = useRef(-1);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setCondensed(window.scrollY > 24);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* Lock page scroll behind the menu only where it covers the page (phones and
     tablets). On desktop it is a small dropdown, so the page stays scrollable
     and there is no scrollbar-width jump. */
  useEffect(() => {
    const lock = drawer && window.matchMedia("(max-width: 980px)").matches;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  /* Keep the menu attached to the bottom edge of the header while it is open —
     the header is sticky on desktop and moves with the utility bar. */
  useEffect(() => {
    if (!drawer) return undefined;
    const measure = () => {
      const box = headerRef.current?.getBoundingClientRect();
      if (box) setDrawerTop(Math.round(box.bottom + 8));
    };
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [drawer]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      pinned.current = -1;
      setOpenIndex(-1);
      setDrawer(false);
    };
    const onPointerDown = (event) => {
      const inside =
        headerRef.current?.contains(event.target) ||
        drawerRef.current?.contains(event.target);
      if (inside) return;
      pinned.current = -1;
      setOpenIndex(-1);
      setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const closePanels = () => {
    window.clearTimeout(closeTimer.current);
    pinned.current = -1;
    setOpenIndex(-1);
  };

  const closeAll = () => {
    closePanels();
    setDrawer(false);
    setDrawerGroup(-1);
  };

  /* Hover / focus: open straight away, no intent delay. */
  const openPanel = (index) => {
    window.clearTimeout(closeTimer.current);
    if (pinned.current !== index) pinned.current = -1;
    setOpenIndex(index);
  };

  /* Leaving closes after a very short grace period so the pointer can cross
     the gap between the label and its panel. Pinned panels stay put. */
  const schedulePanelClose = (index) => {
    if (pinned.current === index) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenIndex(-1), 90);
  };

  /* Clicking the arrow shows the panel without leaving the page. First click
     pins it open; a second click closes it. */
  const toggleFromArrow = (index) => {
    window.clearTimeout(closeTimer.current);
    if (openIndex === index && pinned.current === index) {
      closePanels();
      return;
    }
    pinned.current = index;
    setOpenIndex(index);
  };

  const toggleDrawer = () => {
    const box = headerRef.current?.getBoundingClientRect();
    if (box) setDrawerTop(Math.round(box.bottom + 8));
    closePanels();
    setDrawer((prev) => !prev);
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="utility-bar">
        <div className="utility-inner">
          <nav aria-label="Secondary navigation">
            {utilityLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="utility-actions">
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={`nav-shell${condensed ? " condensed" : ""}`}
      >
        <Link className="brand" href="/" aria-label={`${site.shortName} home`}>
          <Image
            className="brand-mark"
            src="/logo/holy-queen-logo.png"
            alt=""
            width={568}
            height={439}
            sizes="52px"
            priority
          />
          <span>
            <strong>HOLY QUEEN</strong>
            <small>Credit Souhardha Co-operative Society</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item, index) => {
            const hasPanel = Boolean(item.columns);
            const isOpen = openIndex === index;
            return (
              <div
                key={item.label}
                className={`nav-item${hasPanel ? " has-panel" : ""}${
                  isOpen ? " open" : ""
                }`}
                onMouseEnter={() => hasPanel && openPanel(index)}
                onMouseLeave={() => hasPanel && schedulePanelClose(index)}
                onBlur={(event) => {
                  if (
                    hasPanel &&
                    pinned.current !== index &&
                    !event.currentTarget.contains(event.relatedTarget)
                  ) {
                    setOpenIndex((current) => (current === index ? -1 : current));
                  }
                }}
              >
                <Link
                  href={item.href}
                  className={isActive(item.href) ? "active" : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onFocus={() => hasPanel && openPanel(index)}
                  onClick={closePanels}
                >
                  {item.label}
                </Link>

                {hasPanel && (
                  <button
                    type="button"
                    className="nav-caret-btn"
                    aria-label={`${isOpen ? "Hide" : "Show"} ${item.label} menu`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => toggleFromArrow(index)}
                  >
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                      <path
                        d="M2.5 4.5 6 8l3.5-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {hasPanel && (
                  <div className="mega-panel">
                    <div className="mega-columns">
                      {item.columns.map((column) => (
                        <div key={column.heading}>
                          <h3>{column.heading}</h3>
                          <ul>
                            {column.links.map((link) => (
                              <li key={link.href + link.label}>
                                <Link href={link.href} onClick={closePanels}>
                                  <span>{link.label}</span>
                                  {link.badge && (
                                    <em className="rate-badge">{link.badge}</em>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {item.footerLink && (
                      <Link
                        className="mega-footer"
                        href={item.footerLink.href}
                        onClick={closePanels}
                      >
                        {item.footerLink.label} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          className={`menu-toggle${drawer ? " active" : ""}`}
          type="button"
          aria-label={drawer ? "Close menu" : "Open menu"}
          aria-expanded={drawer}
          aria-controls="mobile-menu"
          onClick={toggleDrawer}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <nav
        id="mobile-menu"
        ref={drawerRef}
        className={`mobile-menu${drawer ? " open" : ""}`}
        style={{ "--drawer-top": `${drawerTop}px` }}
        aria-label="Site menu"
      >
        <div className="mobile-scroll">
          {nav.map((item, index) =>
            item.columns ? (
              <div className="mobile-group" key={item.label}>
                <button
                  type="button"
                  className={drawerGroup === index ? "open" : undefined}
                  aria-expanded={drawerGroup === index}
                  onClick={() =>
                    setDrawerGroup((current) =>
                      current === index ? -1 : index
                    )
                  }
                >
                  {item.label}
                  <span aria-hidden="true">
                    {drawerGroup === index ? "−" : "+"}
                  </span>
                </button>
                {drawerGroup === index && (
                  <div className="mobile-sub">
                    {item.columns.map((column) => (
                      <div key={column.heading}>
                        <h4>{column.heading}</h4>
                        {column.links.map((link) => (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            onClick={closeAll}
                          >
                            {link.label}
                            {link.badge && <em>{link.badge}</em>}
                          </Link>
                        ))}
                      </div>
                    ))}
                    {item.footerLink && (
                      <Link
                        className="mobile-more"
                        href={item.footerLink.href}
                        onClick={closeAll}
                      >
                        {item.footerLink.label} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                className="mobile-link"
                key={item.label}
                href={item.href}
                onClick={closeAll}
              >
                {item.label}
              </Link>
            )
          )}

          <div className="mobile-divider" role="presentation"></div>
          {utilityLinks.map((link) => (
            <Link
              className="mobile-link subtle"
              key={link.href}
              href={link.href}
              onClick={closeAll}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-theme">
            <ThemeToggle />
          </div>
        </div>
        <div className="mobile-actions">
          <a className="button primary" href={`tel:${site.phone}`}>
            Call Branch
          </a>
          <a
            className="button secondary"
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </nav>
    </>
  );
}
