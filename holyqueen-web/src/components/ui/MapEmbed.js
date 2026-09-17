"use client";

import { useState } from "react";
import { site } from "@/content/site";

/* The live Google Maps iframe is ~500KB of third-party weight, so it only
   loads when the visitor actually asks for it. */
export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  const query = encodeURIComponent(site.branch.mapQuery);

  return (
    <div className="map-shell reveal">
      {loaded ? (
        <iframe
          title="Holy Queen Mysuru branch map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
        ></iframe>
      ) : (
        <button
          type="button"
          className="map-placeholder"
          onClick={() => setLoaded(true)}
        >
          <span className="map-pin" aria-hidden="true">
            ◈
          </span>
          <strong>View the branch on Google Maps</strong>
          <span>Loads the interactive map</span>
        </button>
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
