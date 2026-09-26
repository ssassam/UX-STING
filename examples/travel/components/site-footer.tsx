"use client";
import { CompassIcon } from "@ux-sting/icons";
import { Field } from "@ux-sting/react/field";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Separator } from "@ux-sting/react/separator";
import { Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { THEMES, useSiteTheme, type ThemeName } from "../app/providers";

const columns = [
  {
    title: "Explore",
    links: [
      ["Destinations", "/destinations"],
      ["Stays", "/search"],
      ["Guided tours", "/tours"],
      ["Beach escapes", "/destinations?style=beach"],
    ],
  },
  {
    title: "Your trips",
    links: [
      ["My trips", "/trips"],
      ["Manage a booking", "/trips"],
      ["Help centre", "/#faq"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/"],
      ["Careers", "/"],
      ["Press", "/"],
      ["Photo credits", "/credits"],
    ],
  },
] as const;

const themeLabels: Record<ThemeName, string> = {
  wayfare: "Wayfare (brand)",
  default: "Default",
  modern: "Modern",
  soft: "Soft",
  material: "Material style",
  fluent: "Fluent style",
  carbon: "Carbon style",
  polaris: "Polaris style",
  apple: "Apple style",
  baseweb: "Base Web style",
  stripe: "Stripe style",
  "high-contrast": "High contrast",
};

export function SiteFooter() {
  const { theme, setTheme } = useSiteTheme();
  return (
    <footer className="mt-16 border-t border-border bg-muted/40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="grid content-start gap-4">
          <NextLink
            href="/"
            className="flex w-fit items-center gap-2 rounded-sm text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CompassIcon className="size-6 text-primary" aria-hidden /> Wayfare
          </NextLink>
          <Text variant="muted" size="sm" className="max-w-xs">
            Hand-picked stays and small-group tours, with free cancellation on most bookings and
            24/7 support.
          </Text>
          <Field
            label="Design theme"
            description="Preview this template in any UX-STING theme."
            className="max-w-60"
          >
            <NativeSelect
              size="sm"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeName)}
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {themeLabels[t]}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="grid content-start gap-3">
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="grid gap-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <NextLink
                    href={href}
                    className="rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>
          © 2026 Wayfare. Demo template — no real bookings are made. Photos: Wikimedia Commons (
          <NextLink href="/credits" className="underline underline-offset-2 hover:text-foreground">
            credits
          </NextLink>
          ).
        </p>
        <p>Built with the UX-STING design system.</p>
      </div>
    </footer>
  );
}
