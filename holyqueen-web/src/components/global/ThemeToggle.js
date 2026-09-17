"use client";

import { useSyncExternalStore } from "react";

const EVENT = "hq-theme-change";

function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

export default function ThemeToggle({ className = "" }) {
  /* Read straight from the DOM attribute the inline head script already set,
     so there is no effect-driven re-render and no flash. */
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const isDark = theme === "dark";

  const apply = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("hq-theme", next);
    } catch {
      /* storage unavailable — the choice just won't persist */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={apply}
    >
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
