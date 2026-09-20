"use client";

import { useSyncExternalStore } from "react";
import { subscribeMusic, isMusicPlaying, toggleMusic } from "./musicPlayer";

export default function MusicToggle({ className = "" }) {
  const playing = useSyncExternalStore(subscribeMusic, isMusicPlaying, () => false);

  return (
    <button
      type="button"
      className={`theme-toggle music-toggle ${className}`.trim()}
      aria-pressed={playing}
      aria-label={playing ? "Pause background music" : "Play background music"}
      onClick={toggleMusic}
    >
      <span aria-hidden="true">{playing ? "♫" : "♪"}</span>
      <span>{playing ? "Music on" : "Music"}</span>
    </button>
  );
}
