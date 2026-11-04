import { forwardRef, type HTMLAttributes } from "react";

export interface CreatorMetaProps extends HTMLAttributes<HTMLDivElement> {
  author?: string;
  creator?: string;
  generator?: string;
  authorUrl?: string;
}

/**
 * Standard creator & vendor meta tags for UX-STING pages.
 * Injects author, creator, generator, and author link into page head.
 */
export const CreatorMeta = forwardRef<HTMLDivElement, CreatorMetaProps>(
  function CreatorMeta(
    {
      author = "Veltein",
      creator = "Veltein (https://veltein.com)",
      generator = "UX-STING by Veltein",
      authorUrl = "https://veltein.com",
    },
    _ref,
  ) {
    return (
      <>
        <meta name="author" content={author} />
        <meta name="creator" content={creator} />
        <meta name="generator" content={generator} />
        <meta name="publisher" content={author} />
        {authorUrl ? <link rel="author" href={authorUrl} /> : null}
      </>
    );
  },
);

/**
 * Returns raw HTML string of creator meta tags for templates (Astro, Svelte, Vue, vanilla HTML).
 */
export function creatorMetaHtml(options?: {
  author?: string;
  creator?: string;
  generator?: string;
  authorUrl?: string;
}): string {
  const author = options?.author ?? "Veltein";
  const creator = options?.creator ?? "Veltein (https://veltein.com)";
  const generator = options?.generator ?? "UX-STING by Veltein";
  const authorUrl = options?.authorUrl ?? "https://veltein.com";

  return [
    `<meta name="author" content="${author}">`,
    `<meta name="creator" content="${creator}">`,
    `<meta name="generator" content="${generator}">`,
    `<meta name="publisher" content="${author}">`,
    authorUrl ? `<link rel="author" href="${authorUrl}">` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
