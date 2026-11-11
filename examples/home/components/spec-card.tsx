"use client";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { Field } from "@ux-sting/react/field";
import { Input } from "@ux-sting/react/input";
import { Switch } from "@ux-sting/react/switch";
import { useState } from "react";

const copy = {
  ltr: {
    title: "Newsletter",
    email: "Email",
    hint: "One email a week. Unsubscribe anytime.",
    digest: "Weekly digest",
    cta: "Subscribe",
    stock: "Verified",
  },
  rtl: {
    title: "النشرة البريدية",
    email: "البريد الإلكتروني",
    hint: "رسالة واحدة في الأسبوع. يمكنك إلغاء الاشتراك متى شئت.",
    digest: "ملخص أسبوعي",
    cta: "اشترك",
    stock: "موثّق",
  },
};

/**
 * Hero "spec sheet": real UX-STING components, live and keyboard-operable, annotated with what
 * the library guarantees. The RTL switch flips the preview to Arabic with logical properties.
 */
export function SpecCard() {
  const [rtl, setRtl] = useState(false);
  const t = rtl ? copy.rtl : copy.ltr;
  return (
    <figure className="relative grid gap-0 rounded-sm border border-border-strong bg-card shadow-2xl shadow-black/30">
      <div aria-hidden className="hazard h-2 rounded-t-sm opacity-90" />
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="spec-label text-muted-foreground">Spec sheet · live preview</span>
        <Switch
          size="sm"
          checked={rtl}
          onCheckedChange={setRtl}
          label="RTL"
          labelPosition="start"
        />
      </div>
      <div dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : "en"} className="grid gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold">{t.title}</p>
          <Badge variant="success" size="sm">
            {t.stock}
          </Badge>
        </div>
        <Field label={t.email} description={t.hint}>
          <Input type="email" placeholder="you@studio.dev" autoComplete="off" dir="ltr" />
        </Field>
        <Switch defaultChecked label={t.digest} />
        <Button className="w-full">{t.cta}</Button>
      </div>
      <figcaption className="ledger grid border-t border-border text-xs">
        {[
          ["Contrast", "WCAG 2.2 AA tokens"],
          ["Keyboard", "Tab · Space · Enter"],
          ["Direction", rtl ? "RTL via logical props" : "LTR · flip the switch"],
          ["Checked", "axe, on every commit"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 px-4 py-2">
            <span className="spec-label text-muted-foreground">{k}</span>
            <span className="measure text-foreground">
              <span aria-hidden className="me-1.5 text-primary">
                ✓
              </span>
              {v}
            </span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
