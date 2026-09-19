"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/* Loads automatically as it approaches the viewport (no click required),
   using an IntersectionObserver so the ~500KB iframe still isn't fetched
   for visitors who never scroll this far. loading="lazy" is a backstop for
   browsers where the observer isn't available. */
export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  const shellRef = useRef(null);
  const query = encodeURIComponent(site.branch.mapQuery);

  useEffect(() => {
    if (loaded) return undefined;
    const node = shellRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setLoaded(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px 600px 0px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div className="map-shell reveal" ref={shellRef}>
      {loaded ? (
        <iframe
          title="Holy Queen Mysuru branch map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
        ></iframe>
      ) : (
        <div className="map-placeholder" aria-hidden="true">
          <span className="map-pin">◈</span>
          <strong>Loading the branch map…</strong>
        </div>
      )}
      <div className="map-card">
        <strong>{site.branch.line1}</strong>
        <span>{site.branch.line2}</span>
        <a
          className="button secondary"
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
        >
          Get directions
        </a>
      </div>
    </div>
  );
}
