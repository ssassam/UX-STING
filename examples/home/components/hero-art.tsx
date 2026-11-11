"use client";

import { useState } from "react";

/** Decorative light field; all product information stays in the HTML beside it. */
export function HeroArt() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className={`hero-art ${playing ? "" : "scene-paused"}`}>
      <div className="hero-halo hero-halo-one" aria-hidden />
      <div className="hero-halo hero-halo-two" aria-hidden />
      <div className="hero-halo hero-halo-three" aria-hidden />
      <svg className="hero-ribbons" viewBox="0 0 1000 850" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ribbon-a" x1="38" y1="684" x2="940" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#31D9E8" stopOpacity="0" />
            <stop offset=".28" stopColor="#31D9E8" />
            <stop offset=".66" stopColor="#FFE0A8" />
            <stop offset="1" stopColor="#FF977D" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ribbon-b" x1="100" y1="145" x2="955" y2="725" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6196EA" stopOpacity="0" />
            <stop offset=".35" stopColor="#6196EA" />
            <stop offset=".75" stopColor="#37D6D0" />
            <stop offset="1" stopColor="#37D6D0" stopOpacity="0" />
          </linearGradient>
          <filter id="ribbon-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <g className="hero-ribbon hero-ribbon-a">
          <path d="M-85 638C99 390 305 740 479 482C637 247 808 260 1050 112" stroke="url(#ribbon-a)" strokeWidth="42" opacity=".4" filter="url(#ribbon-glow)" />
          <path d="M-85 638C99 390 305 740 479 482C637 247 808 260 1050 112" stroke="url(#ribbon-a)" strokeWidth="2.4" />
        </g>
        <g className="hero-ribbon hero-ribbon-b">
          <path d="M-40 80C246 270 264 104 472 318C679 532 698 644 1033 715" stroke="url(#ribbon-b)" strokeWidth="46" opacity=".35" filter="url(#ribbon-glow)" />
          <path d="M-40 80C246 270 264 104 472 318C679 532 698 644 1033 715" stroke="url(#ribbon-b)" strokeWidth="2.2" />
        </g>
        <path className="hero-ribbon hero-ribbon-c" d="M210 800C278 578 747 658 844 294C901 81 1008 75 1100 70" stroke="url(#ribbon-a)" strokeWidth="1.3" opacity=".65" />
      </svg>
      <div className="hero-prism" aria-hidden><div className="hero-prism-inner" /></div>
      <span className="hero-scene-label hero-scene-label-one" aria-hidden>DESIGN / IN MOTION</span>
      <span className="hero-scene-label hero-scene-label-two" aria-hidden>01 — 17 THEMES</span>
      <button
        type="button"
        onClick={() => setPlaying((value) => !value)}
        aria-pressed={!playing}
        className="hero-motion-button"
      >{playing ? "Pause motion" : "Play motion"}</button>
    </div>
  );
}
