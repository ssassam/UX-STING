import { dnaResult, missing, swatches, theme, tokenGroups } from "../lib/data";
import { Command } from "./command";
import { CreditedFigure } from "./figure";
import { Section } from "./section";

export function ExtractSection() {
  const top = dnaResult.matches.slice(0, 3);
  const mapped = theme.mapping.filter((m) => m.path);
  return (
    <Section
      id="extract"
      number="02"
      kicker="Design extraction"
      title="Take the measurements of a design that already exists."
      intro={
        <p>
          Point it at a live site and it reads what the browser actually rendered: colors, type
          scale, spacing, radii, shadows, motion and breakpoints. It writes W3C design tokens, and
          anything it could not measure stays empty instead of being made up. Below is the real
          output for the Ember demo.
        </p>
      }
    >
      <div className="grid gap-12">
        <div className="grid gap-2">
          <Command>npx ux-sting extract https://your-site.example --dark</Command>
          <Command>npx ux-sting theme import ux-sting-extract/tokens.json</Command>
          <Command>npx ux-sting dna ux-sting-extract/tokens.json</Command>
        </div>

        <div className="grid gap-4">
          <h3 className="font-display text-2xl">Colors it found</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 [&>li:last-child:nth-child(odd)]:col-span-2 sm:[&>li:last-child:nth-child(odd)]:col-span-1">
            {swatches.map((s) => (
              <li key={s.name} className="grid gap-2">
                <span
                  aria-hidden="true"
                  className="block h-16 rounded-sm border border-border"
                  // ux-audit-ignore: measured values from the extraction, shown as data
                  style={{ background: s.hex }}
                />
                <span className="grid">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{s.hex}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <div className="grid content-start gap-6">
            <h3 className="font-display text-2xl">Scales</h3>
            <dl className="ledger border-y border-border">
              {tokenGroups.map((g) => (
                <div
                  key={g.label}
                  className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="text-sm text-muted-foreground">{g.label}</dt>
                  <dd className="font-mono text-sm leading-7">
                    {g.items.map((i) => (
                      <span key={`${i.name}:${i.value}`} className="me-4 inline-block">
                        {i.name ? <span className="text-muted-foreground">{i.name} </span> : null}
                        {i.value}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted-foreground">
              Unmeasured: {missing.length ? missing.join(", ") : "nothing; every group was found"}.
            </p>
          </div>
          <CreditedFigure
            file="drawing-for-the-street-elevation-of-a-town-house-1729.jpg"
            alt="An ink and wash elevation of a gabled town house, split down the middle to show two alternative window designs."
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <h3 className="font-display text-2xl">Theme import, made accessible</h3>
            <p className="text-muted-foreground">
              Tokens map to UX-STING&rsquo;s semantic roles in OKLCH. Pairs that would fail WCAG AA
              are corrected, and each correction is reported:
            </p>
            {theme.adjustments.length === 0 ? (
              <p className="border-y border-border py-3 text-sm">
                On Ember every measured pair already met AA, so nothing was changed.
              </p>
            ) : null}
            <ul className="ledger border-y border-border empty:hidden">
              {theme.adjustments.map((a) => (
                <li key={a.pair.join()} className="grid gap-1 py-3 text-sm">
                  <span className="font-mono">{a.pair.join(" / ")}</span>
                  <span className="text-muted-foreground">
                    {a.before}:1 → <strong className="text-foreground">{a.after}:1</strong>,{" "}
                    {a.changed} adjusted
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              {mapped.length} roles came straight from tokens;{" "}
              {theme.mapping.length - mapped.length} were derived from them.
            </p>
          </div>
          <div className="grid content-start gap-4">
            <h3 className="font-display text-2xl">Nearest preset</h3>
            <p className="text-muted-foreground">
              A feature vector (scheme, lightness, hue, chroma, radius, type, spacing, motion) is
              compared with every built-in theme, using only the features that were measured. Lower
              is closer; here the top three are nearly tied, so Ember is its own design.
            </p>
            <ol className="ledger border-y border-border">
              {top.map((m, i) => (
                <li key={m.preset} className="grid gap-2 py-3">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-sm">
                      {i + 1}. {m.preset}
                    </span>
                    <span className="font-mono text-sm tabular-nums">
                      distance {m.distance.toFixed(3)}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    compared on {m.compared.length} features
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}
