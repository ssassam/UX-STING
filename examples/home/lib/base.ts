/** Prefixes plain `<a>` hrefs with the deploy base path (next/link does this itself). */
export const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
