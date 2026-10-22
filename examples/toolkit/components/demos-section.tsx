import { ArrowUpRightIcon } from "@ux-sting/icons";
import { DEMOS_ROOT } from "../lib/seo";
import { Section } from "./section";

const sites = [
  { href: `${DEMOS_ROOT}/`, name: "Wayfare", what: "Travel booking", theme: "wayfare · teal" },
  { href: `${DEMOS_ROOT}/cars/`, name: "Drivo", what: "Car rental", theme: "drivo · red" },
  { href: `${DEMOS_ROOT}/shop/`, name: "Maison Nord", what: "Fashion shop", theme: "nord · gray" },
  {
    href: `${DEMOS_ROOT}/watch/`,
    name: "Pulse One",
    what: "Product launch",
    theme: "pulse · violet",
  },
  {
    href: `${DEMOS_ROOT}/crypto/`,
    name: "Chainlens",
    what: "Crypto analytics",
    theme: "lens · indigo",
  },
  {
    href: `${DEMOS_ROOT}/ember/`,
    name: "Ember",
    what: "Restaurant reservations",
    theme: "ember · amber",
  },
];

/** Every UX-STING demo, as one index. */
export function DemosSection() {
  return (
    <Section
      id="demos"
      kicker="All demos"
      title="The same toolkit, six finished sites."
      intro={
        <p>
          Each demo is a static Next.js export built from UX-STING components and its own theme made
          with <code>createTheme</code>. Run any of the commands above against them.
        </p>
      }
    >
      <ul className="ledger border-y border-border">
        {sites.map((s) => (
          <li key={s.name}>
            <a
              href={s.href}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[12rem_minmax(0,1fr)_9rem_auto]"
            >
              <span className="font-display text-xl group-hover:underline">{s.name}</span>
              <span className="hidden text-muted-foreground sm:block">{s.what}</span>
              <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                {s.theme}
              </span>
              <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary" />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
