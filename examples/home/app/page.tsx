import { ArrowRightIcon, ExternalLinkIcon } from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Marquee } from "@ux-sting/react/marquee";
import { Reveal } from "@ux-sting/react/reveal";
import { Heading, Text } from "@ux-sting/react/typography";
import { CopyCommand } from "../components/copy-command";
import { HeroArt } from "../components/hero-art";
import { LiveLab } from "../components/live-lab";
import { Measures } from "../components/measures";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { CONTACT_EMAIL, premiumTemplates } from "../content/premium";
import { demos, GITHUB_URL, hosts, INSTALL_CMD, NPM_VERSION, SITE } from "../content/site";
import { withBase } from "../lib/base";
import { jsonLd, pageMeta, SITE_URL } from "../lib/seo";

export const metadata = pageMeta({
  description:
    "A live React design system: 115 accessible components, 17 themes, motion, charts, data grids and agent skills that verify the result in a browser.",
});

const inside = [
  {
    no: "01",
    title: "115 accessible components",
    body: "Layout, a complete form system, date and time, navigation, overlays, a data grid with multi-sort, 10k-row virtualization and resizable columns, commerce and editorial patterns, motion and effects.",
    spec: "@ux-sting/react",
  },
  {
    no: "02",
    title: "Tokens and 17 theme presets",
    body: "OKLCH semantic tokens as CSS variables. Material, Fluent, Carbon, Polaris, Apple, Base Web and Stripe styles plus editorial, luxury, brutalist and terminal looks, in light, dark and high contrast, with 3 densities.",
    spec: "createTheme({ primary })",
  },
  {
    no: "03",
    title: "Agent skills for 24 hosts",
    body: "Ten skills and a Universal Design Agent teach your coding agent to art-direct a page, build it with UX-STING and prove it in a browser. One command detects your editors and installs them.",
    spec: "npx ux-sting skills add",
  },
  {
    no: "04",
    title: "Design intelligence, offline",
    body: "192 industry conventions with their anti-patterns, 80 styles, 192 palettes, 74 font pairings, 34 landing patterns and 22 stack guides, searched locally and saved as your project's design system.",
    spec: "design_data.py system",
  },
  {
    no: "05",
    title: "Browser QA and anti-slop checks",
    body: "Screenshots at phone and desktop width, accessibility, layout and placeholder checks in one report. The agent fixes the top findings and runs it again before it calls the page done.",
    spec: "npx ux-sting qa <url>",
  },
  {
    no: "06",
    title: "Your code, your edits",
    body: "Copy a component's source into your project with a lockfile that protects your changes, or stay on npm and eject only the one you need. ux-sting update merges upstream fixes later.",
    spec: "npx ux-sting add dialog",
  },
];

const steps = [
  {
    title: "Install the skills",
    body: "Run one command in your project. It finds Claude Code, Codex, Cursor and the other hosts you use.",
    cmd: INSTALL_CMD,
  },
  {
    title: "Ask for a page",
    body: "The design agent reads your brief, checks your industry's conventions and picks a direction before writing code.",
    cmd: "“Build our pricing page”",
  },
  {
    title: "It builds with UX-STING",
    body: "Accessible components and your theme tokens instead of hand-rolled divs, so keyboard, focus and RTL come for free.",
    cmd: "@ux-sting/react",
  },
  {
    title: "It proves the page",
    body: "A real browser takes screenshots and runs the checks. The top findings are fixed and re-checked before you see “done”.",
    cmd: "npx ux-sting qa",
  },
];

const faqs = [
  {
    q: "Is UX-STING free?",
    a: "Yes. UX-STING is released under the Veltein Fair-Source License: free for personal, open-source and commercial projects, as long as the footer keeps a visible link to veltein.com (for example “Built with UX-STING by Veltein”) and the author and generator meta tags stay in the page head.",
  },
  {
    q: "What does the white-label license add?",
    a:
      "It lets an agency or company remove or replace the Veltein credit and creator meta tags on client sites and commercial products. Write to " +
      CONTACT_EMAIL +
      " for terms.",
  },
  {
    q: "Which AI coding tools does it work with?",
    a: "Twenty-four hosts, including Claude Code, Codex, Cursor, Windsurf, Copilot, Gemini, Antigravity, Qoder, Kiro, Cline, Continue and OpenCode. npx ux-sting skills add detects the ones in your project; --ai picks them by name.",
  },
  {
    q: "Can I use it without an AI agent?",
    a: "Yes. Install @ux-sting/react from npm and import components per entry point, or copy a component's source into your project with npx ux-sting add.",
  },
  {
    q: "How is accessibility checked?",
    a: "Components target WCAG 2.2 AA with keyboard support, focus management and contrast-tested tokens. Every docs demo is tested with axe in both LTR and RTL on each commit, and the QA command checks your own pages in a browser.",
  },
  {
    q: "Do I need Tailwind CSS?",
    a: "No. UX-STING is Tailwind v4 native if you use it, and also ships a precompiled styles.css for projects without Tailwind.",
  },
  {
    q: "Does it support Next.js server components?",
    a: "Yes. It is built for the App Router: server components by default, client code only where a component needs it, and a separate entry point for every component.",
  },
  {
    q: "Does it support right-to-left languages?",
    a: "Yes. Layout uses logical properties, built-in labels are localized in English, French and Arabic, and dates, numbers and currencies are formatted with Intl.",
  },
  {
    q: "What are the premium templates?",
    a: "Complete, production-ready sites built with UX-STING, like the live demos on this page, sold with full source code. Each one lists what is included and its price.",
  },
];

function SectionHead({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="grid max-w-3xl content-start gap-3 self-start">
      <span className="spec-label text-primary">{eyebrow}</span>
      <Heading level={2} size="2xl" id={`${id}-title`}>
        {title}
      </Heading>
      {intro ? (
        <Text size="lg" variant="muted">
          {intro}
        </Text>
      ) : null}
    </div>
  );
}

const wrap = "mx-auto w-full max-w-7xl px-4 sm:px-6";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "@id": `${SITE_URL}#software`,
                name: "UX-STING",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Any",
                softwareVersion: NPM_VERSION,
                description:
                  "Accessible, themeable React design system with agent skills for 24 AI coding hosts and browser QA.",
                url: SITE_URL,
                downloadUrl: "https://www.npmjs.com/package/ux-sting",
                codeRepository: GITHUB_URL,
                offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
                author: { "@id": "https://veltein.com/#organization" },
                publisher: { "@id": "https://veltein.com/#organization" },
              },
              {
                "@type": "Organization",
                "@id": "https://veltein.com/#organization",
                name: "VELTEIN",
                url: "https://veltein.com",
                founder: { "@id": "https://veltein.com/#person" },
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          })}
        />

        {/* HERO */}
        <section
          aria-labelledby="hero-title"
          className="hero-stage relative overflow-hidden"
        >
          <HeroArt />
          <div
            className={`${wrap} hero-content relative z-10 flex min-h-[670px] items-center py-20 sm:min-h-[780px] lg:min-h-[850px]`}
          >
            <div className="grid max-w-3xl min-w-0 gap-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">v{NPM_VERSION}</Badge>
                <span className="spec-label text-muted-foreground">
                  Interface system for a new generation
                </span>
              </div>
              <Heading
                level={1}
                id="hero-title"
                className="hero-title text-6xl leading-[.98] sm:text-7xl lg:text-[clamp(6rem,9vw,9.5rem)]"
              >
                Interfaces<br />that <span className="hero-gradient-word">feel alive.</span>
              </Heading>
              <Text size="lg" variant="muted" className="hero-intro max-w-xl">
                Explore motion, color and components in one accessible React system. Build with UX-STING, then prove the experience in a real browser.
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" endIcon={<ArrowRightIcon aria-hidden className="rtl:rotate-180" />}>
                  <a href="#lab">Explore the system</a>
                </Button>
                <Button asChild size="lg" variant="ghost"><a href="#templates">See what it builds</a></Button>
              </div>
              <div id="install" className="hero-install max-w-lg scroll-mt-28">
                <span className="spec-label text-muted-foreground">Start building</span>
                <CopyCommand command={INSTALL_CMD} />
              </div>
            </div>
          </div>
        </section>

        {/* MEASURES */}
        <section aria-label="UX-STING in numbers" className={`${wrap} measures-section py-10 sm:py-14`}>
          <Measures />
        </section>

        <section id="lab" aria-labelledby="lab-title" className="lab-section scroll-mt-20 py-20 sm:py-28">
          <div className={`${wrap} grid gap-9`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead id="lab" eyebrow="The interactive canvas" title="Explore the system. Change its atmosphere." intro="Select a color. Follow the light. Explore a real chart and a sortable data grid." />
              <span className="spec-label text-muted-foreground">Live UX-STING / interact below ↘</span>
            </div>
            <LiveLab />
          </div>
        </section>

        {/* INSIDE */}
        <section
          id="inside"
          aria-labelledby="inside-title"
          className={`${wrap} inside-section grid scroll-mt-20 gap-10 py-20 sm:py-28`}
        >
          <SectionHead
            id="inside"
            eyebrow="What's inside"
            title="The craft behind the feeling."
            intro="Components, themes, the design knowledge to choose between them and the checks that prove the result — in one toolkit."
          />
          <Reveal as="ol" stagger={70} className="ledger grid">
            {inside.map((row) => (
              <li
                key={row.no}
                className="grid gap-3 py-6 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.5fr)_14rem] md:items-baseline md:gap-8"
              >
                <span className="measure text-sm text-primary">{row.no}</span>
                <Heading level={3} size="md">
                  {row.title}
                </Heading>
                <Text variant="muted">{row.body}</Text>
                <code className="measure w-fit rounded-full bg-muted px-3 py-1 text-xs md:justify-self-end">
                  {row.spec}
                </code>
              </li>
            ))}
          </Reveal>
        </section>

        {/* HOSTS */}
        <section aria-labelledby="hosts-title" className="hosts-section py-14">
          <div className={`${wrap} mb-6 flex flex-wrap items-baseline justify-between gap-3`}>
            <Heading level={2} size="lg" id="hosts-title">
              One install. 24 AI coding hosts.
            </Heading>
            <code className="measure text-sm text-muted-foreground">npx ux-sting skills hosts</code>
          </div>
          <Marquee label="Supported AI coding hosts" duration={45}>
            {hosts.map((h) => (
              <span
                key={h}
                className="measure mx-2 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/50 bg-background/50 px-4 py-2 text-sm"
              >
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {h}
              </span>
            ))}
          </Marquee>
        </section>

        {/* HOW */}
        <section
          id="how"
          aria-labelledby="how-title"
          className={`${wrap} how-section grid scroll-mt-20 gap-10 py-20 sm:py-28`}
        >
          <SectionHead
            id="how"
            eyebrow="How it works"
            title="From prompt to proven page in four steps."
          />
          <Reveal
            as="ol"
            stagger={90}
            className="how-steps grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s, i) => (
              <li key={s.title} className="grid content-start gap-3 p-3 sm:p-4">
                <span className="measure text-5xl font-semibold text-primary">{i + 1}</span>
                <Heading level={3} size="sm">
                  {s.title}
                </Heading>
                <Text variant="muted" size="sm">
                  {s.body}
                </Text>
                <code className="measure mt-auto w-fit rounded-full bg-muted px-3 py-1 text-xs">
                  {s.cmd}
                </code>
              </li>
            ))}
          </Reveal>
        </section>

        {/* TEMPLATES */}
        <section
          id="templates"
          aria-labelledby="templates-title"
          className="templates-section scroll-mt-20 py-20 sm:py-28"
        >
          <div className={`${wrap} grid gap-10`}>
            <SectionHead
              id="templates"
              eyebrow="Live templates"
              title="Six complete sites, built with UX-STING."
              intro="Open any of them, switch the theme, resize the window, tab through it. Every one is a static export of a Next.js app in the repository."
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {demos.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.href}
                    className="template-link group grid h-full overflow-hidden rounded-3xl bg-card outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <img
                      src={withBase(`/${d.image}`)}
                      alt={`${d.name} ${d.kind.toLowerCase()} template, home screen`}
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="grid gap-1.5 p-5">
                      <span className="spec-label text-muted-foreground">{d.kind}</span>
                      <span className="inline-flex items-center gap-1.5 text-lg font-semibold">
                        {d.name}
                        <ArrowRightIcon
                          aria-hidden
                          className="size-4 text-primary transition group-hover:translate-x-1 rtl:rotate-180"
                        />
                      </span>
                      <span className="text-sm text-muted-foreground">{d.body}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Text variant="muted" size="sm">
              Plus the{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4"
                href={`${SITE}/toolkit/`}
              >
                UX-STING toolkit
              </a>
              : QA, site extraction, image search, taste and motion tools in the browser.
            </Text>
          </div>
        </section>

        {/* PRICING / PREMIUM */}
        <section
          id="pricing"
          aria-labelledby="pricing-title"
          className="pricing-section scroll-mt-20 py-20 sm:py-28"
        >
          <div className={`${wrap} grid gap-10`}>
            <SectionHead
              id="pricing"
              eyebrow="Free, Premium, White-label"
              title="Start free. Buy a head start. Remove the credit."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <article className="grid content-start gap-5 rounded-sm border border-border bg-background p-6">
                <div className="grid gap-1">
                  <span className="spec-label text-muted-foreground">Community</span>
                  <p className="measure text-4xl font-semibold">Free</p>
                </div>
                <ul className="grid gap-2 text-sm">
                  {[
                    "All 115 components and 17 themes",
                    "Agent skills for 24 hosts",
                    "Design data and browser QA",
                    "Personal and commercial projects",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        ✓
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <Text size="sm" variant="muted">
                  Keep the visible “Built with UX-STING by Veltein” footer link and the creator meta
                  tags.
                </Text>
                <Button asChild variant="outline" className="mt-auto">
                  <a href="#install">Install free</a>
                </Button>
              </article>

              <article
                aria-labelledby="premium-title"
                className="relative grid content-start gap-5 rounded-sm border-2 border-primary bg-background p-6"
              >
                <div aria-hidden className="hazard absolute inset-x-0 top-0 h-1.5" />
                <div className="grid gap-1">
                  <span className="spec-label text-primary">Premium templates</span>
                  <p id="premium-title" className="measure text-4xl font-semibold">
                    Per template
                  </p>
                </div>
                <ul className="grid gap-2 text-sm">
                  {[
                    "Complete Next.js site, full source",
                    "Built and QA-checked with UX-STING",
                    "Your theme in one createTheme call",
                    "Ready to deploy as a static export",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        ✓
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-auto">
                  <a href="#premium">Browse premium templates</a>
                </Button>
              </article>

              <article className="grid content-start gap-5 rounded-sm border border-border bg-background p-6">
                <div className="grid gap-1">
                  <span className="spec-label text-muted-foreground">White-label license</span>
                  <p className="measure text-4xl font-semibold">On request</p>
                </div>
                <ul className="grid gap-2 text-sm">
                  {[
                    "Remove or replace the Veltein credit",
                    "Remove the creator meta tags",
                    "For agencies, client sites and products",
                    "Everything in Community",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        ✓
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-auto">
                  <a href={`mailto:${CONTACT_EMAIL}?subject=UX-STING%20white-label%20license`}>
                    Ask for terms
                  </a>
                </Button>
              </article>
            </div>

            <div id="premium" className="grid scroll-mt-24 gap-6">
              <Heading level={3} size="lg">
                Premium templates
              </Heading>
              {premiumTemplates.length === 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-dashed border-border-strong bg-background p-6">
                  <div className="grid gap-1">
                    <p className="font-semibold">The first premium templates are being prepared.</p>
                    <Text size="sm" variant="muted">
                      Leave your email and you will hear when they are on sale.
                    </Text>
                  </div>
                  <Button asChild>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Notify%20me%3A%20UX-STING%20premium%20templates`}
                    >
                      Get notified
                    </a>
                  </Button>
                </div>
              ) : (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {premiumTemplates.map((t) => {
                    const price =
                      t.price != null
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: t.currency ?? "USD",
                            maximumFractionDigits: 0,
                          }).format(t.price)
                        : "Price on request";
                    const buy =
                      t.buyUrl ??
                      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Buy template: ${t.name}`)}`;
                    return (
                      <li
                        key={t.id}
                        className="grid overflow-hidden rounded-sm border border-border bg-background"
                      >
                        <img
                          src={withBase(`/${t.image}`)}
                          alt={`${t.name} template preview`}
                          width={1280}
                          height={800}
                          loading="lazy"
                          className="aspect-[16/10] w-full border-b border-border object-cover object-top"
                        />
                        <div className="grid content-start gap-3 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="grid gap-0.5">
                              <span className="spec-label text-muted-foreground">{t.category}</span>
                              <span className="text-lg font-semibold">{t.name}</span>
                            </div>
                            <span className="measure text-lg font-semibold text-primary">
                              {price}
                            </span>
                          </div>
                          <Text size="sm" variant="muted">
                            {t.description}
                          </Text>
                          {t.includes?.length ? (
                            <ul className="grid gap-1 text-sm">
                              {t.includes.map((x) => (
                                <li key={x} className="flex gap-2">
                                  <span aria-hidden className="text-primary">
                                    ✓
                                  </span>
                                  {x}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button asChild size="sm">
                              <a href={buy}>Buy {t.name}</a>
                            </Button>
                            {t.demoUrl ? (
                              <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                endIcon={<ExternalLinkIcon />}
                              >
                                <a href={t.demoUrl} target="_blank" rel="noopener">
                                  Live demo<span className="sr-only"> (opens in a new tab)</span>
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className={`${wrap} grid scroll-mt-20 gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}
        >
          <SectionHead
            id="faq"
            eyebrow="FAQ"
            title="Questions, answered."
            intro="Anything else? Open an issue on GitHub or write to us."
          />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
