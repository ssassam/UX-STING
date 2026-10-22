import { credit } from "../lib/data";
import { withBase } from "../lib/base";

/** A credited museum image. Credits come from the `ux-sting images` manifest. */
export function CreditedFigure({
  file,
  alt,
  className,
  priority = false,
}: {
  file: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const c = credit(file);
  return (
    <figure className={`grid gap-2 ${className ?? ""}`}>
      {/* Plain img: static export, pre-sized */}
      <img
        src={withBase(`/images/${file}`)}
        alt={alt}
        className="figure-img h-auto w-full rounded-sm"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
      <figcaption className="text-xs text-muted-foreground">
        <a href={c.landingUrl} className="underline underline-offset-2 hover:text-foreground">
          {c.title}
        </a>
        {c.creator ? `, ${c.creator}` : ""}. CC0, The Metropolitan Museum of Art.
      </figcaption>
    </figure>
  );
}
