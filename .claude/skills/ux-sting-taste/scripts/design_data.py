#!/usr/bin/env python3
"""UX-STING design data: industry conventions, styles, palettes, fonts and more.

Standard library only, no network. Data lives in ../references/data/*.csv (and
../../ux-sting-design-agent/references/stacks/*.csv for per-stack guidelines).
Data adapted from the MIT-licensed UI/UX Pro Max skill (see THIRD_PARTY_NOTICES.md).

  python3 design_data.py system "pastry shop in Fes" [--mode light|dark] [--rtl]
                         [--persist] [--page home] [--out DIR] [--force] [--name N]
  python3 design_data.py search "glass dashboard" [--domain style] [-n 5]
  python3 design_data.py stack vue ["forms"] [-n 8]
  python3 design_data.py domains
"""
from __future__ import annotations

import argparse
import colorsys
import csv
import math
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE.parent / "references" / "data"
STACKS = HERE.parent.parent / "ux-sting-design-agent" / "references" / "stacks"

# domain -> (file, columns searched, columns shown in search output)
DOMAINS = {
    "industry": ("industries.csv", ["industry", "keywords", "considerations"],
                 ["industry", "primary_style", "landing_pattern", "color_mood", "anti_patterns"]),
    "style": ("styles.csv", ["name", "keywords", "aliases", "best_for", "type"],
              ["name", "status", "best_for", "avoid_for", "effects", "a11y", "performance"]),
    "palette": ("palettes.csv", ["industry", "notes"],
                ["industry", "primary", "secondary", "accent", "background", "foreground", "notes"]),
    "font": ("font-pairings.csv", ["name", "mood", "best_for", "category"],
             ["name", "heading", "body", "mood", "best_for", "google_fonts_url"]),
    "landing": ("landing-patterns.csv", ["pattern_name", "keywords", "aliases"],
                ["pattern_name", "section_order", "primary_cta_placement", "conversion_optimization"]),
    "chart": ("charts.csv", ["data_type", "keywords", "best_chart_type", "when_to_use"],
              ["data_type", "best_chart_type", "secondary_options", "when_not_to_use", "accessibility_notes"]),
    "ux": ("ux-guidelines.csv", ["category", "issue", "description", "platform"],
           ["category", "issue", "do", "don't", "severity"]),
    "app": ("app-interface.csv", ["category", "issue", "keywords", "description"],
            ["category", "issue", "platform", "do", "don't", "severity"]),
    "motion": ("motion.csv", ["category", "keywords", "trigger", "intensity_tier"],
               ["category", "intensity_tier", "duration", "easing", "do", "don't"]),
    "icon": ("icon-roles.csv", ["category", "icon_name", "keywords", "best_for"],
             ["category", "icon_name", "best_for", "semantic_role", "allowed_contexts"]),
    "react-perf": ("react-performance.csv", ["category", "issue", "keywords", "description"],
                   ["category", "issue", "do", "don't", "severity"]),
}

# UX-STING theme preset hints keyed by words in a style id / name.
PRESET_HINTS = [
    ("brutal", "brutalist"), ("terminal", "terminal"), ("cyber", "terminal"), ("hacker", "terminal"),
    ("luxury", "luxury"), ("premium", "luxury"), ("editorial", "editorial"), ("magazine", "editorial"),
    ("swiss", "neutral"), ("minimal", "neutral"), ("material", "material"), ("fluent", "fluent"),
    ("soft", "soft"), ("neumorph", "soft"), ("clay", "soft"), ("glass", "modern"), ("flat", "modern"),
    ("corporate", "carbon"), ("enterprise", "carbon"), ("data-dense", "compact"), ("dashboard", "compact"),
    ("accessible", "high-contrast"), ("high-contrast", "high-contrast"),
]
# UX-STING token palettes (OKLCH hue, chroma) from packages/tokens/src/palette.ts.
TOKEN_PALETTES = {"blue": 262, "indigo": 275, "violet": 295, "pink": 350, "red": 25, "orange": 50,
                  "amber": 75, "green": 150, "teal": 185, "sky": 235}

# ---------------------------------------------------------------- data + search

def load(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def tokens(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if len(t) > 1]


def bm25(rows: list[dict], cols: list[str], query: str, n: int) -> list[tuple[float, dict]]:
    docs = [tokens(" ".join(r.get(c, "") for c in cols)) for r in rows]
    if not docs:
        return []
    avg = sum(map(len, docs)) / len(docs) or 1
    df: dict[str, int] = {}
    for d in docs:
        for t in set(d):
            df[t] = df.get(t, 0) + 1
    q = tokens(query)
    scored = []
    for r, d in zip(rows, docs):
        s, hit = 0.0, 0
        for t in q:
            tf = d.count(t)
            if tf:
                hit += 1
                idf = math.log(1 + (len(docs) - df[t] + 0.5) / (df[t] + 0.5))
                s += idf * tf * 2.2 / (tf + 1.2 * (0.25 + 0.75 * len(d) / avg))
        if s > 0:
            s *= 1 + hit / max(len(set(q)), 1)  # favour rows that cover more of the query
            scored.append((s, r))
    scored.sort(key=lambda x: -x[0])
    return scored[:n]


def domain_rows(name: str) -> list[dict]:
    return load(DATA / DOMAINS[name][0])

# ---------------------------------------------------------------- colour helpers

def rgb(hex_: str) -> tuple[float, float, float]:
    h = hex_.strip().lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))  # type: ignore[return-value]


def luminance(hex_: str) -> float:
    def ch(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(ch, rgb(hex_))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def nearest_token_palette(hex_: str) -> str:
    h, l, s = colorsys.rgb_to_hls(*rgb(hex_))
    if s < 0.12 or l < 0.08 or l > 0.95:
        return "slate"
    # sRGB hue -> rough OKLCH hue (good enough to pick a neighbour).
    deg = (h * 360 + 30) % 360
    return min(TOKEN_PALETTES, key=lambda k: min(abs(TOKEN_PALETTES[k] - deg), 360 - abs(TOKEN_PALETTES[k] - deg)))

# ---------------------------------------------------------------- design system

def split_names(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"\s*(?:\+|,)\s*", text) if p.strip()]


def resolve_style(name: str, styles: list[dict]) -> dict | None:
    key = name.lower()
    for s in styles:
        names = [s["name"].lower(), s["id"].lower()] + [a.lower() for a in s["aliases"].split("|") if a]
        if key in names:
            return s
    hit = bm25(styles, ["name", "aliases", "id"], name, 1)
    return hit[0][1] if hit else None


def preset_for(style: dict | None) -> str:
    text = f"{style['id']} {style['name']} {style['keywords']}".lower() if style else ""
    for word, preset in PRESET_HINTS:
        if word in text:
            return preset
    return "default"


def build(query: str, mode: str, rtl: bool, name: str | None) -> dict:
    industries = domain_rows("industry")
    hits = bm25(industries, DOMAINS["industry"][1], query, 3)
    if not hits:
        sys.exit(f"No industry matched {query!r}. Try broader words, or `search --domain industry`.")
    ind = hits[0][1]
    styles = domain_rows("style")
    picked, dropped = [], []
    for nm in split_names(ind["primary_style"]) + split_names(ind["secondary_styles"]):
        st = resolve_style(nm, styles)
        if not st or st in picked:
            continue
        if rtl and st["rtl"] == "caveats":
            dropped.append(st["name"])
            continue
        if mode != "auto" and st[mode] == "not-recommended":
            dropped.append(st["name"])
            continue
        picked.append(st)
    palette = next(p for p in domain_rows("palette") if p["id"] == ind["id"])
    fonts = [r for _, r in bm25(domain_rows("font"), ["mood", "best_for"],
                                f"{ind['typography_mood']} {ind['typography_mood']} {ind['color_mood']} {ind['industry']}", 3)]
    landing = bm25(domain_rows("landing"), DOMAINS["landing"][1], ind["landing_pattern"], 1)
    return {"query": query, "name": name or ind["industry"], "mode": mode, "rtl": rtl, "industry": ind,
            "alternatives": [r["industry"] for _, r in hits[1:]], "styles": picked, "dropped": dropped,
            "palette": palette, "fonts": fonts, "landing": landing[0][1] if landing else None}


def palette_md(p: dict) -> list[str]:
    pairs = [("primary", "on_primary"), ("secondary", "on_secondary"), ("accent", "on_accent"),
             ("foreground", "background"), ("card_foreground", "card"), ("muted_foreground", "background"),
             ("on_destructive", "destructive")]
    out = ["| Token | Hex | Pair | Contrast |", "| --- | --- | --- | --- |"]
    for a, b in pairs:
        c = contrast(p[a], p[b])
        out.append(f"| {a} | `{p[a]}` | on `{p[b]}` | {c:.2f}:1 {'✅' if c >= 4.5 else '⚠️ < 4.5 — fix before use'} |")
    for k in ("muted", "border", "ring"):
        out.append(f"| {k} | `{p[k]}` | — | — |")
    return out


def theme_snippet(ds: dict) -> str:
    p = ds["palette"]
    m = {"primary": "primary", "primary-foreground": "on_primary", "secondary": "secondary",
         "secondary-foreground": "on_secondary", "accent": "accent", "accent-foreground": "on_accent",
         "background": "background", "foreground": "foreground", "card": "card",
         "card-foreground": "card_foreground", "muted": "muted", "muted-foreground": "muted_foreground",
         "border": "border", "destructive": "destructive", "destructive-foreground": "on_destructive",
         "ring": "ring"}
    slug = re.sub(r"[^a-z0-9]+", "-", ds["name"].lower()).strip("-") or "brand"
    font = ds["fonts"][0] if ds["fonts"] else None
    lines = [f'  "{k}": "{p[v]}",' for k, v in m.items()]
    ff = ""
    if font:
        def kind(label: str) -> str:
            label = label.lower()
            return "mono" if "mono" in label else "serif" if "serif" in label and "sans" not in label else "sans"
        parts = [x.strip() for x in font["category"].split("+")]
        slots: dict[str, str] = {kind(parts[-1] if len(parts) > 1 else parts[0]): font["body"]}
        hk = kind(parts[0])
        note = ""
        if hk not in slots:
            slots[hk] = font["heading"]
        elif font["heading"] != font["body"]:
            note = f'  // headings: "{font["heading"]}" (apply via a heading class or `vars`)'
        ff = "\n  fontFamily: { " + ", ".join(f'{k}: "{v}"' for k, v in slots.items()) + " }," + note
    return ("```ts\nimport { createTheme } from \"@ux-sting/themes\";\n\n"
            f"// Category baseline: bend it toward unique.md before shipping.\nexport const theme = createTheme({{\n"
            f'  name: "{slug}",\n  primary: "{nearest_token_palette(p["primary"])}",   // nearest UX-STING scale; drives dark + high-contrast\n'
            f'  neutral: "slate",{ff}\n  colors: {{ light: {{\n' + "\n".join("  " + l for l in lines) + "\n  } },\n});\n```")


def to_markdown(ds: dict, page: str | None = None) -> str:
    ind, st0 = ds["industry"], (ds["styles"][0] if ds["styles"] else None)
    o = [f"# Design system — {ds['name']}" + (f" · page: {page}" if page else ""), "",
         f"> Query: “{ds['query']}” · mode: {ds['mode']}{' · RTL' if ds['rtl'] else ''} · "
         f"matched **{ind['industry']}** (also close: {', '.join(ds['alternatives']) or '—'})", "",
         "**This is the category convention, not the answer.** In ux-sting-taste step 3 at most one direction "
         "may follow it; the others break it on purpose. Anti-patterns below are binding for every direction.", "",
         "## Category convention", "",
         f"- **Landing pattern:** {ind['landing_pattern']}",
         f"- **Dashboard style:** {ind['dashboard_style'] or '—'}",
         f"- **Color mood:** {ind['color_mood']}",
         f"- **Typography mood:** {ind['typography_mood']}",
         f"- **Effects:** {ind['key_effects']}",
         f"- **Considerations:** {ind['considerations']}",
         f"- **Decision rules:** `{ind['decision_rules']}`",
         f"- **RTL support for this category:** {ind['rtl']}", "",
         f"### Anti-patterns ({ind['severity']})", "",
         *[f"- ❌ {a}" for a in split_names(ind["anti_patterns"])], "",
         "## Styles", ""]
    for st in ds["styles"]:
        o += [f"### {st['name']} (`{st['id']}`, {st['status']}) → UX-STING preset `{preset_for(st)}`", "",
              f"- Best for: {st['best_for']}", f"- Avoid for: {st['avoid_for']}",
              f"- Effects: {st['effects']}", f"- Light/dark: {st['light']} / {st['dark']} · mobile: {st['mobile']} · "
              f"RTL: {st['rtl']}", f"- Accessibility: {st['a11y']} · performance: {st['performance']}",
              f"- Variables: {st['variables']}", f"- Checklist: {st['checklist']}", ""]
    if ds["dropped"]:
        o += [f"_Dropped for {'RTL' if ds['rtl'] else ''}{'/' if ds['rtl'] and ds['mode'] != 'auto' else ''}"
              f"{ds['mode'] if ds['mode'] != 'auto' else ''}: {', '.join(ds['dropped'])}_", ""]
    o += ["## Palette", "", f"{ds['palette']['notes']}", "", *palette_md(ds["palette"]), "", theme_snippet(ds), ""]
    if ds["mode"] == "dark":
        o += ["Dark mode: set the theme's `dark` colors from the same hues; do not invert. Re-check contrast "
              "with `npx ux-sting qa`.", ""]
    o += ["## Font pairings", "", "| Pairing | Heading | Body | Mood |", "| --- | --- | --- | --- |"]
    o += [f"| {f['name']} | {f['heading']} | {f['body']} | {f['mood']} |" for f in ds["fonts"]]
    o += ["", "Load with `next/font/google` (self-hosted, no layout shift) rather than the Google Fonts URL.", ""]
    if ds["landing"]:
        lp = ds["landing"]
        o += ["## Landing pattern", "", f"**{lp['pattern_name']}** — {lp['section_order']}", "",
              f"- CTA: {lp['primary_cta_placement']}", f"- Color strategy: {lp['color_strategy']}",
              f"- Effects: {lp['recommended_effects']}", f"- Conversion: {lp['conversion_optimization']}", ""]
    if page:
        o += ["## Page overrides", "", "Only what differs from MASTER.md for this page. Everything else inherits.", ""]
    return "\n".join(o)


def persist(ds: dict, out: Path, page: str | None, force: bool) -> list[Path]:
    root = out / ".ux-sting" / "taste" / "design-system"
    master = root / "MASTER.md"
    written = []
    if master.exists() and not force:
        print(f"{master} exists; kept it (use --force to overwrite).", file=sys.stderr)
    else:
        root.mkdir(parents=True, exist_ok=True)
        master.write_text(to_markdown(ds), encoding="utf-8")
        written.append(master)
    if page:
        pf = root / "pages" / f"{re.sub(r'[^a-z0-9-]+', '-', page.lower())}.md"
        if pf.exists() and not force:
            print(f"{pf} exists; kept it.", file=sys.stderr)
        else:
            pf.parent.mkdir(parents=True, exist_ok=True)
            pf.write_text(f"# {page} — overrides\n\nInherits `../MASTER.md`. List only deviations here.\n",
                          encoding="utf-8")
            written.append(pf)
    return written

# ---------------------------------------------------------------- CLI

def show(rows: list[tuple[float, dict]], cols: list[str]) -> None:
    for s, r in rows:
        print(f"— {r.get(cols[0], '')}  (score {s:.1f})")
        for c in cols[1:]:
            if r.get(c):
                print(f"    {c}: {r[c]}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("system", help="category baseline: styles, palette, fonts, landing, anti-patterns")
    s.add_argument("query")
    s.add_argument("--name")
    s.add_argument("--mode", choices=["auto", "light", "dark"], default="auto")
    s.add_argument("--rtl", action="store_true", help="drop styles with RTL caveats")
    s.add_argument("--persist", action="store_true", help="write .ux-sting/taste/design-system/MASTER.md")
    s.add_argument("--page", help="with --persist: also create pages/<page>.md")
    s.add_argument("--out", default=".", help="project root for --persist")
    s.add_argument("--force", action="store_true")
    q = sub.add_parser("search", help="search one domain (or all)")
    q.add_argument("query")
    q.add_argument("--domain", choices=list(DOMAINS) + ["all"], default="all")
    q.add_argument("-n", type=int, default=5)
    k = sub.add_parser("stack", help="per-stack guidelines (22 stacks)")
    k.add_argument("name")
    k.add_argument("query", nargs="?", default="")
    k.add_argument("-n", type=int, default=10)
    sub.add_parser("domains", help="list domains and stacks with row counts")
    a = ap.parse_args()

    if a.cmd == "system":
        ds = build(a.query, a.mode, a.rtl, a.name)
        if a.persist:
            for p in persist(ds, Path(a.out), a.page, a.force):
                print(f"wrote {p}")
        else:
            print(to_markdown(ds))
    elif a.cmd == "search":
        for d in (DOMAINS if a.domain == "all" else [a.domain]):
            hits = bm25(domain_rows(d), DOMAINS[d][1], a.query, a.n if a.domain != "all" else 2)
            if hits:
                print(f"\n## {d}")
                show(hits, DOMAINS[d][2])
    elif a.cmd == "stack":
        f = STACKS / f"{a.name.lower()}.csv"
        if not f.exists():
            sys.exit(f"Unknown stack {a.name!r}. Known: {', '.join(sorted(p.stem for p in STACKS.glob('*.csv')))}")
        rows = load(f)
        hits = bm25(rows, ["category", "guideline", "description"], a.query, a.n) if a.query else [(0.0, r) for r in rows[: a.n]]
        show(hits, ["guideline", "category", "do", "don't", "severity", "docs_url"])
    else:
        for d, (fn, *_r) in DOMAINS.items():
            print(f"{d:<11} {len(load(DATA / fn)):>4}  {fn}")
        if STACKS.exists():
            print("stacks:", ", ".join(f"{p.stem} ({len(load(p))})" for p in sorted(STACKS.glob('*.csv'))))


if __name__ == "__main__":
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    main()
