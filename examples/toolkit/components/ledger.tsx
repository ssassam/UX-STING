const tools = [
  {
    href: "#qa",
    n: "01",
    name: "ux-sting qa",
    does: "Opens the page at 375, 768 and 1440px; checks accessibility, contrast, layout, console and LCP/CLS; ranks the three fixes that matter most.",
  },
  {
    href: "#extract",
    n: "02",
    name: "ux-sting extract · theme import · dna",
    does: "Measures a live site into W3C design tokens, turns them into an accessible theme, and names the nearest preset.",
  },
  {
    href: "#images",
    n: "03",
    name: "ux-sting images",
    does: "Searches museum and Commons archives for public-domain and CC images, downloads them and writes the credits.",
  },
  {
    href: "#taste",
    n: "04",
    name: "ux-sting-taste",
    does: "An art-direction routine: brief, what is unique, three directions, one concept, real images, then proof in the browser.",
  },
  {
    href: "#motion",
    n: "05",
    name: "@ux-sting/motion",
    does: "Eight CSS transitions with no dependencies, plus an optional GSAP layer for scroll stories.",
  },
];

/** The toolkit as an index of instruments, one hairline row each. */
export function Ledger() {
  return (
    <nav aria-label="Instruments" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <ol className="ledger border-y border-border">
        {tools.map((t) => (
          <li key={t.n}>
            <a
              href={t.href}
              className="group grid gap-1 py-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[4rem_minmax(0,18rem)_minmax(0,1fr)] sm:gap-6"
            >
              <span className="font-mono text-sm text-primary">{t.n}</span>
              <span className="font-mono text-sm font-medium group-hover:underline">{t.name}</span>
              <span className="text-sm text-pretty text-muted-foreground">{t.does}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
