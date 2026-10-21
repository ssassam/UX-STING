"use client";
import { useInterval, usePrefersReducedMotion } from "@ux-sting/hooks";
import { cn } from "@ux-sting/utils";
import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";

export interface RotatingTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Words or short phrases to cycle through. */
  words: string[];
  /** Time each word stays, in ms. Default 2500. */
  interval?: number;
  /** Stops on the current word. */
  paused?: boolean;
  /** What screen readers hear instead. Defaults to the words joined by commas. */
  srText?: string;
}

/**
 * Cycles through words in place ("Build apps that are fast / safe / yours").
 * All words share one grid cell, so the line never reflows. Screen readers
 * hear the full list once instead of every change; reduced motion keeps the
 * first word.
 */
export const RotatingText = forwardRef<HTMLSpanElement, RotatingTextProps>(function RotatingText(
  { words, interval = 2500, paused = false, srText, className, ...props },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const running = !paused && !reduced && words.length > 1;
  useInterval(() => setIndex((i) => (i + 1) % words.length), running ? interval : null);
  return (
    <span ref={ref} className={cn("ui-rotating-text", className)} {...props}>
      <span className="sr-only">{srText ?? words.join(", ")}</span>
      <span aria-hidden className="inline-grid">
        {words.map((word, i) => (
          <span key={word} data-active={i === index ? "" : undefined}>
            {word}
          </span>
        ))}
      </span>
    </span>
  );
});

export interface TypewriterProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text to type. Pass several to type, erase and loop through them. */
  text: string | string[];
  /** Ms per character. Default 45. */
  speed?: number;
  /** Pause on a finished phrase before erasing, in ms. Default 1800. */
  hold?: number;
  /** Show a blinking caret. Default `true`. */
  cursor?: boolean;
}

/**
 * Types text character by character. Space for the longest phrase is
 * reserved, so nothing below jumps. Screen readers and reduced motion get the
 * full text immediately; without JavaScript the text is simply shown.
 */
export const Typewriter = forwardRef<HTMLSpanElement, TypewriterProps>(function Typewriter(
  { text, speed = 45, hold = 1800, cursor = true, className, ...props },
  ref,
) {
  const phrases = Array.isArray(text) ? text : [text];
  const reduced = usePrefersReducedMotion();
  const [phrase, setPhrase] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const current = phrases[phrase] ?? "";
  const loop = phrases.length > 1;
  const done = !loop && count >= current.length;

  useEffect(() => {
    if (reduced || done) return;
    const atEnd = !deleting && count >= current.length;
    const atStart = deleting && count === 0;
    const id = setTimeout(
      () => {
        if (atEnd) setDeleting(true);
        else if (atStart) {
          setDeleting(false);
          setPhrase((p) => (p + 1) % phrases.length);
        } else setCount((c) => c + (deleting ? -1 : 1));
      },
      atEnd ? hold : deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(id);
  }, [reduced, done, deleting, count, current.length, hold, speed, phrases.length]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");
  const shown = reduced ? current : current.slice(0, count);
  return (
    <span ref={ref} className={cn("ui-typewriter", className)} {...props}>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden className="inline-grid">
        <span className="ui-typewriter-ghost">{longest}</span>
        <span className="ui-typewriter-text">
          {shown}
          {cursor && !reduced ? <span className="ui-typewriter-caret" /> : null}
        </span>
      </span>
    </span>
  );
});
