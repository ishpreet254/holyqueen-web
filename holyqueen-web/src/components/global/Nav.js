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
  const [condensed, setCondensed] = useState(false);
  const headerRef = useRef(null);
  const closeTimer = useRef(0);
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

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpenIndex(-1);
      setDrawer(false);
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenIndex(-1);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const closeAll = () => {
    setOpenIndex(-1);
    setDrawer(false);
    setDrawerGroup(-1);
  };

  const openPanel = (index) => {
    window.clearTimeout(closeTimer.current);
    setOpenIndex(index);
  };
  const schedulePanelClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenIndex(-1), 140);
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
            return (
              <div
                key={item.label}
                className={`nav-item${openIndex === index ? " open" : ""}`}
                onMouseEnter={() => hasPanel && openPanel(index)}
                onMouseLeave={() => hasPanel && schedulePanelClose()}
              >
                <Link
                  href={item.href}
                  className={isActive(item.href) ? "active" : undefined}
                  aria-expanded={hasPanel ? openIndex === index : undefined}
                  onFocus={() => hasPanel && openPanel(index)}
                  onClick={() => setOpenIndex(-1)}
                >
                  {item.label}
                  {hasPanel && (
                    <span className="nav-caret" aria-hidden="true">
                      ⌄
                    </span>
                  )}
                </Link>

                {hasPanel && (
                  <div
                    className="mega-panel"
                    onMouseEnter={() => openPanel(index)}
                    onMouseLeave={schedulePanelClose}
                  >
                    <div className="mega-columns">
                      {item.columns.map((column) => (
                        <div key={column.heading}>
                          <h3>{column.heading}</h3>
                          <ul>
                            {column.links.map((link) => (
                              <li key={link.href + link.label}>
                                <Link
                                  href={link.href}
                                  onClick={() => setOpenIndex(-1)}
                                >
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
                        onClick={() => setOpenIndex(-1)}
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

        <a className="nav-cta" href={`tel:${site.phone}`}>
          Call Branch
        </a>

        <button
          className={`menu-toggle${drawer ? " active" : ""}`}
          type="button"
          aria-label={drawer ? "Close menu" : "Open menu"}
          aria-expanded={drawer}
          aria-controls="mobile-menu"
          onClick={() => setDrawer((prev) => !prev)}
        >
          <span></span>
          <span></span>
        </button>
      </header>

      <nav
        id="mobile-menu"
        className={`mobile-menu${drawer ? " open" : ""}`}
        aria-label="Mobile navigation"
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
