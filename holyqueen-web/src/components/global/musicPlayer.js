"use client";

/* A single shared <audio> element for the whole app (there is only ever one,
   however many MusicToggle buttons are on screen — the desktop utility bar
   and the mobile drawer each render one). Modelled on ThemeToggle's
   DOM-attribute + window-event pattern so every instance always agrees on
   whether music is actually playing. */

const EVENT = "hq-music-change";
let audio = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0.55;
    audio.addEventListener("play", notify);
    audio.addEventListener("pause", notify);
    audio.addEventListener("ended", notify);
  }
  return audio;
}

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeMusic(callback) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

export function isMusicPlaying() {
  return Boolean(audio && !audio.paused);
}

export function toggleMusic() {
  const el = getAudio();
  if (!el) return;
  if (el.paused) {
    // Browsers only allow this because it runs inside a click handler.
    el.play().catch(() => {
      /* Playback blocked for some reason — the button just reflects
         reality via the play/pause events, no state to unwind here. */
    });
  } else {
    el.pause();
  }
}
