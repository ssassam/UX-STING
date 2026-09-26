"use client";
import { Lightbox } from "@ux-sting/react/media";
import { Pagination } from "@ux-sting/react/pagination";
import { Link, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { sized, type Photo } from "../lib/photos";

const PAGE_SIZE = 12;

/** Paginated photo grid; each tile opens a lightbox and shows its credit. */
export function CreditsGallery({ photos }: { photos: Photo[] }) {
  const params = useSearchParams();
  const pages = Math.max(1, Math.ceil(photos.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), pages);
  const start = (page - 1) * PAGE_SIZE;
  const visible = photos.slice(start, start + PAGE_SIZE);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="grid gap-6">
      <p role="status" className="text-sm text-muted-foreground">
        Showing {start + 1}–{start + visible.length} of {photos.length} photos
      </p>
      <ul
        id="gallery"
        className="grid scroll-mt-24 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {visible.map((p, i) => (
          <li key={p.page} className="grid content-start gap-2">
            <button
              type="button"
              onClick={() => {
                setIndex(start + i);
                setOpen(true);
              }}
              className="group relative block overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="sr-only">Enlarge: </span>
              <img
                src={sized(p, 960).replace("/960px-", "/500px-")}
                alt={p.alt}
                loading="lazy"
                className="aspect-4/3 w-full object-cover transition-transform duration-(--ui-duration-slow) group-hover:scale-105"
              />
            </button>
            <div className="grid gap-0.5 text-xs">
              <Text size="sm" weight="medium" className="line-clamp-2">
                {p.alt}
              </Text>
              <p className="text-muted-foreground [overflow-wrap:anywhere]">
                <Link href={p.page} external externalLabel="(opens Wikimedia Commons)">
                  {p.author}
                </Link>{" "}
                ·{" "}
                {p.licenseUrl ? (
                  <Link href={p.licenseUrl} external externalLabel="(license, opens in a new tab)">
                    {p.license}
                  </Link>
                ) : (
                  p.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {pages > 1 ? (
        <Pagination
          totalPages={pages}
          page={page}
          getHref={(n) => (n === 1 ? "?" : `?page=${n}`) + "#gallery"}
          renderLink={({ href, children, ...rest }) => (
            <NextLink href={href} {...rest}>
              {children}
            </NextLink>
          )}
          className="justify-center"
        />
      ) : null}
      <Lightbox
        images={photos.map((p) => ({
          src: p.src,
          alt: p.alt,
          caption: `${p.alt} — ${p.author}, ${p.license}`,
        }))}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
}
