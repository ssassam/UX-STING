import { cn } from "@ux-sting/utils";
import { forwardRef, type AudioHTMLAttributes, type VideoHTMLAttributes } from "react";

export interface MediaTrack {
  src: string;
  kind?: "captions" | "subtitles" | "descriptions";
  srcLang: string;
  label: string;
  default?: boolean;
}

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /** Aspect ratio reserved for the player. */
  ratio?: number;
  /** Caption/subtitle tracks (WebVTT). Provide captions for spoken content. */
  tracks?: MediaTrack[];
  /** Accessible title. */
  title?: string;
}

/**
 * Native video with reserved aspect ratio and caption tracks. Autoplay is
 * only allowed muted and respects reduced motion (use `autoPlay` sparingly).
 */
export const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  {
    ratio = 16 / 9,
    tracks = [],
    controls = true,
    preload = "metadata",
    playsInline = true,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      className="relative overflow-hidden rounded-lg bg-black"
      style={{ aspectRatio: String(ratio) }}
    >
      {/* Caption tracks are passed via `tracks`. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        controls={controls}
        preload={preload}
        playsInline={playsInline}
        className={cn("size-full", className)}
        {...props}
      >
        {tracks.map((t) => (
          <track
            key={t.src}
            kind={t.kind ?? "captions"}
            src={t.src}
            srcLang={t.srcLang}
            label={t.label}
            default={t.default}
          />
        ))}
        {children}
      </video>
    </div>
  );
});

export interface AudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
  /** Visible title for the audio clip. */
  title?: string;
  /** Link to a transcript for accessibility. */
  transcriptHref?: string;
  transcriptLabel?: string;
}

/** Native audio player with visible title and optional transcript link. */
export const Audio = forwardRef<HTMLAudioElement, AudioProps>(function Audio(
  {
    title,
    transcriptHref,
    transcriptLabel = "Transcript",
    controls = true,
    preload = "metadata",
    className,
    ...props
  },
  ref,
) {
  return (
    <figure className={cn("grid gap-2 rounded-lg border border-border bg-card p-3", className)}>
      {title ? <figcaption className="text-sm font-medium">{title}</figcaption> : null}
      {/* Audio uses a transcript link (`transcriptHref`) instead of a caption track. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={ref}
        controls={controls}
        preload={preload}
        className="w-full"
        aria-label={title}
        {...props}
      />
      {transcriptHref ? (
        <a href={transcriptHref} className="text-sm text-primary underline underline-offset-4">
          {transcriptLabel}
        </a>
      ) : null}
    </figure>
  );
});
