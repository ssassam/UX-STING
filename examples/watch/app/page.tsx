import {
  CreditCardIcon,
  HeartPulseIcon,
  MapIcon,
  MoonIcon,
  RecycleIcon,
  TimerIcon,
  CheckIcon,
  MinusIcon,
} from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { Blockquote, Heading, Text } from "@ux-sting/react/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@ux-sting/react/table";
import { Separator } from "@ux-sting/react/separator";
import { ReviewStars } from "@ux-sting/react/rating";
import { DemoLinks } from "../components/demo-links";
import { Hero } from "../components/hero";
import { Preorder } from "../components/preorder";
import { Section } from "../components/section";
import { Showcase } from "../components/showcase";
import { SiteHeader } from "../components/site-header";

const features = [
  {
    icon: <HeartPulseIcon />,
    title: "Heart & stress",
    body: "Medical-grade optical sensor with irregular-rhythm alerts.",
  },
  {
    icon: <MoonIcon />,
    title: "Sleep coaching",
    body: "Sleep stages, snoring detection and a bedtime nudge.",
  },
  {
    icon: <MapIcon />,
    title: "Dual-band GPS",
    body: "Accurate tracks in cities, forests and canyons.",
  },
  {
    icon: <TimerIcon />,
    title: "Fast charge",
    body: "10 minutes on the puck gives you two more days.",
  },
  { icon: <CreditCardIcon />, title: "Tap to pay", body: "Contactless payments with 140+ banks." },
  {
    icon: <RecycleIcon />,
    title: "Recycled case",
    body: "100% recycled aluminium and a plastic-free box.",
  },
];

const specs: [string, string, string][] = [
  ["Display", '1.4" AMOLED, 1,000 nits', '1.5" AMOLED, 2,000 nits'],
  ["Case", "Recycled aluminium", "Grade 5 titanium"],
  ["Glass", "Gorilla Glass 3", "Sapphire crystal"],
  ["Battery", "Up to 14 days", "Up to 16 days"],
  ["GPS", "Dual-band GPS", "Dual-band GPS"],
  ["Water resistance", "5 ATM, swim-proof", "10 ATM, dive-ready"],
  ["LTE", "—", "Yes, eSIM"],
  ["Weight (44 mm)", "34 g", "39 g"],
];

const press = [
  {
    quote: "The first smartwatch I forgot to charge — because I didn't need to.",
    source: "Gadget Weekly (fictional)",
    rating: 5,
  },
  {
    quote: "GPS accuracy that embarrasses watches twice the price.",
    source: "RunnersLab (fictional)",
    rating: 5,
  },
  {
    quote: "Sleep insights are genuinely useful, not just pretty charts.",
    source: "The Daily Tech (fictional)",
    rating: 4,
  },
];

const faqs = [
  {
    q: "Which phones does it work with?",
    a: "Any iPhone with iOS 16 or later and Android phones with Android 10 or later.",
  },
  {
    q: "When will it ship?",
    a: "Pre-orders ship from mid-November. We'll email you a week before, and you're only charged when it ships.",
  },
  {
    q: "Can I swim with it?",
    a: "Yes. Pulse One is rated 5 ATM for pool and open-water swims; Pro is rated 10 ATM for snorkelling.",
  },
  {
    q: "Is there a subscription?",
    a: "No. Every health and training feature is included, forever.",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="grid gap-24 pb-8 outline-none">
        <Hero />
        <Section
          id="features"
          title="Everything you need on your wrist"
          intro="Built for health, training and everyday life — without the daily charge."
          className="scroll-mt-24"
        >
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {features.map((f) => (
              <li
                key={f.title}
                className="grid content-start gap-3 rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-subtle text-primary-subtle-foreground [&_svg]:size-5">
                  {f.icon}
                </span>
                <h3 className="font-semibold">{f.title}</h3>
                <Text size="sm" variant="muted">
                  {f.body}
                </Text>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="modes" title="One watch, three superpowers">
          <Showcase />
        </Section>
        <Section
          id="specs"
          title="Tech specs"
          intro="Compare Pulse One and Pulse One Pro."
          className="scroll-mt-24"
        >
          <Table label="Tech specs table" containerClassName="rounded-2xl border border-border">
            <TableCaption className="sr-only">
              Pulse One and Pulse One Pro specifications
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Feature</TableHead>
                <TableHead scope="col">Pulse One · €249</TableHead>
                <TableHead scope="col">Pulse One Pro · €349</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map(([k, a, b]) => (
                <TableRow key={k}>
                  <TableHead scope="row" className="font-medium text-foreground">
                    {k}
                  </TableHead>
                  <TableCell>
                    {a === "—" ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MinusIcon aria-hidden className="size-4" /> Not included
                      </span>
                    ) : (
                      a
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      {b.startsWith("Yes") ? (
                        <CheckIcon aria-hidden className="size-4 text-success" />
                      ) : null}
                      {b}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
        <Section id="reviews" title="What reviewers say" className="scroll-mt-24">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
            {press.map((p) => (
              <li
                key={p.source}
                className="grid content-between gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <Blockquote className="border-s-2 border-primary ps-4 text-lg">
                  {p.quote}
                </Blockquote>
                <div className="flex items-center justify-between gap-2">
                  <Text size="sm" variant="muted">
                    {p.source}
                  </Text>
                  <ReviewStars value={p.rating} size="sm" />
                </div>
              </li>
            ))}
          </ul>
        </Section>
        <section id="buy" aria-labelledby="buy-title" className="scroll-mt-20 bg-muted/40 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6">
            <div className="grid gap-2 text-center">
              <Heading level={2} size="2xl" id="buy-title">
                Reserve your Pulse One
              </Heading>
              <Text variant="muted">No payment today. Free delivery and 30-day returns.</Text>
            </div>
            <Preorder />
          </div>
        </section>
        <Section id="faq" title="Questions" className="scroll-mt-24">
          <Accordion type="single" collapsible variant="separated" className="max-w-3xl">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger headingLevel={3}>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-2">
            <p className="text-lg font-bold">Pulse</p>
            <Text size="sm" variant="muted" className="max-w-md">
              Pulse One is a fictional product. This page is a UX-STING landing-page template — no
              orders are taken.
            </Text>
          </div>
          <DemoLinks current="watch" />
        </div>
        <Separator />
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          Built with the{" "}
          <a
            href="https://github.com/ssassam/UX-STING"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm font-medium text-foreground underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            UX-STING design system
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
        </p>
      </footer>
    </>
  );
}
