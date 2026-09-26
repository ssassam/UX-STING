import { ExternalLinkIcon } from "@ux-sting/icons";

/** Links between the UX-STING demo sites (all hosted on GitHub Pages); open in a new tab. */
const SITE = "https://ssassam.github.io/UX-STING";

export const demos = [
  { id: "travel", label: "Wayfare — travel", href: `${SITE}/` },
  { id: "cars", label: "Drivo — car rental", href: `${SITE}/cars/` },
  { id: "shop", label: "Maison Nord — shop", href: `${SITE}/shop/` },
  { id: "watch", label: "Pulse One — product launch", href: `${SITE}/watch/` },
  { id: "crypto", label: "Chainlens — crypto analytics", href: `${SITE}/crypto/` },
] as const;

export function DemoLinks({ current }: { current: (typeof demos)[number]["id"] }) {
  return (
    <nav aria-label="More UX-STING demos" className="grid content-start gap-3">
      <h2 className="text-sm font-semibold">More demos</h2>
      <ul className="grid gap-2 text-sm">
        {demos
          .filter((d) => d.id !== current)
          .map((d) => (
            <li key={d.id}>
              <a
                href={d.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {d.label}
                <ExternalLinkIcon aria-hidden className="size-3.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
      </ul>
    </nav>
  );
}
