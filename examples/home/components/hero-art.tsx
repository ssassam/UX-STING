"use client";

import { useState } from "react";

export function HeroArt() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className={`hero-art relative flex min-h-[360px] items-center justify-center sm:min-h-[480px] ${playing ? "" : "lab-paused"}`}>
      <div className="hero-art-orbit hero-art-orbit-a" aria-hidden />
      <div className="hero-art-orbit hero-art-orbit-b" aria-hidden />
      <div className="hero-art-orbit hero-art-orbit-c" aria-hidden />
      <div className="hero-art-axis" aria-hidden />
      <div className="hero-art-core" aria-hidden>
        <span className="hero-art-core-small">THE INTERFACE ENGINE</span>
        <strong>UX<span>·</span>STING</strong>
        <span className="hero-art-core-small">DESIGN / BUILD / VERIFY</span>
      </div>
      <span className="hero-art-marker hero-art-marker-a" aria-hidden>01 / MOTION</span>
      <span className="hero-art-marker hero-art-marker-b" aria-hidden>02 / SYSTEM</span>
      <span className="hero-art-marker hero-art-marker-c" aria-hidden>03 / PROOF</span>
      <button
        type="button"
        onClick={() => setPlaying((value) => !value)}
        aria-pressed={!playing}
        className="hero-motion-button absolute bottom-2 left-2 z-10 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {playing ? "Pause motion" : "Play motion"}
      </button>
    </div>
  );
}
