#!/usr/bin/env python3
"""Logo and identity data: industry conventions, logo styles, palettes, identity deliverables, mockups.

Standard library only, no network. Data in ../references/data/*.csv, adapted from the MIT-licensed
UI/UX Pro Max design skill (see THIRD_PARTY_NOTICES.md in UX-STING).

  python3 brand_data.py brief "artisan coffee roaster"      # category conventions + clichés to avoid
  python3 brand_data.py kit "artisan coffee roaster"        # identity deliverables + mockup scenes
  python3 brand_data.py search "monogram luxury" [--domain style] [-n 5]
  python3 brand_data.py domains
"""
from __future__ import annotations

import argparse
import csv
import math
import re
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "references" / "data"

DOMAINS = {
    "industry": ("logo-industries.csv", ["industry", "keywords"],
                 ["industry", "recommended_styles", "primary_colors", "typography", "common_symbols", "mood", "avoid"]),
    "style": ("logo-styles.csv", ["style_name", "category", "keywords", "best_for"],
              ["style_name", "category", "effects", "best_for", "avoid_for", "complexity", "era"]),
    "palette": ("logo-palettes.csv", ["palette_name", "category", "keywords", "psychology", "best_for"],
                ["palette_name", "primary_hex", "secondary_hex", "accent_hex", "psychology", "best_for", "avoid_for"]),
    "identity": ("identity-industries.csv", ["industry", "keywords"],
                 ["industry", "cip_style", "primary_colors", "typography", "key_deliverables", "mood", "avoid"]),
    "identity-style": ("identity-styles.csv", ["style_name", "category", "keywords", "best_for"],
                       ["style_name", "description", "materials", "finishes", "mood", "best_for", "avoid_for"]),
    "deliverable": ("identity-deliverables.csv", ["deliverable", "category", "keywords", "description"],
                    ["deliverable", "category", "dimensions", "file_format", "logo_placement", "best_practices", "avoid"]),
    "mockup": ("identity-mockups.csv", ["context_name", "category", "keywords", "best_for"],
               ["context_name", "category", "scene_description", "lighting", "camera_angle", "best_for"]),
    "icon-style": ("icon-styles.csv", ["name", "description", "keywords", "best_for"],
                   ["name", "description", "stroke_width", "fill", "best_for"]),
}


def load(name: str) -> list[dict]:
    with (DATA / name).open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def tokens(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if len(t) > 1]


def bm25(rows: list[dict], cols: list[str], query: str, n: int) -> list[tuple[float, dict]]:
    docs = [tokens(" ".join(r.get(c, "") for c in cols)) for r in rows]
    avg = (sum(map(len, docs)) / len(docs)) if docs else 1
    df: dict[str, int] = {}
    for d in docs:
        for t in set(d):
            df[t] = df.get(t, 0) + 1
    q = tokens(query)
    out = []
    for r, d in zip(rows, docs):
        s, hit = 0.0, 0
        for t in q:
            tf = d.count(t)
            if tf:
                hit += 1
                idf = math.log(1 + (len(docs) - df[t] + 0.5) / (df[t] + 0.5))
                s += idf * tf * 2.2 / (tf + 1.2 * (0.25 + 0.75 * len(d) / (avg or 1)))
        if s > 0:
            out.append((s * (1 + hit / max(len(set(q)), 1)), r))
    out.sort(key=lambda x: -x[0])
    return out[:n]


def luminance(hex_: str) -> float:
    h = hex_.strip().lstrip("#")
    def ch(i: int) -> float:
        c = int(h[i:i + 2], 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4)


def contrast(a: str, b: str) -> float:
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def hexes(text: str) -> list[str]:
    return re.findall(r"#[0-9A-Fa-f]{6}\b", text)


def brief(query: str) -> str:
    ind = bm25(load("logo-industries.csv"), DOMAINS["industry"][1], query, 3)
    if not ind:
        return f"No industry matched {query!r}; try `search` with broader words."
    row = ind[0][1]
    o = [f"# Category conventions — {row['industry']}", "",
         f"> Query: “{query}” · also close: {', '.join(r['industry'] for _, r in ind[1:]) or '—'}", "",
         "**These are what the category already looks like.** Use them to *avoid blending in* (Phase 2): "
         "common symbols are the clichés to treat as off-limits unless you give them a genuinely fresh form.", "",
         f"- **Clichés / common symbols:** {row['common_symbols']}",
         f"- **Usual styles:** {row['recommended_styles']}",
         f"- **Usual colors:** {row['primary_colors']}",
         f"- **Usual type:** {row['typography']}",
         f"- **Mood:** {row['mood']}",
         f"- **Best practices:** {row['best_practices']}",
         f"- **Avoid:** {row['avoid']}", "", "## Styles that fit", ""]
    for _, s in bm25(load("logo-styles.csv"), DOMAINS["style"][1], f"{row['recommended_styles']} {row['mood']}", 4):
        o.append(f"- **{s['style_name']}** ({s['category']}, {s['complexity']}, {s['era']}): {s['best_for']} · avoid for {s['avoid_for']}")
    o += ["", "## Palettes", "", "| Palette | Primary | Secondary | Accent | Text on bg | Psychology |",
          "| --- | --- | --- | --- | --- | --- |"]
    for _, p in bm25(load("logo-palettes.csv"), DOMAINS["palette"][1], f"{row['industry']} {row['keywords']} {row['mood']}", 4):
        tb = [h for h in hexes(p["text_hex"]) + hexes(p["background_hex"])]
        c = f"{contrast(tb[0], tb[1]):.1f}:1" if len(tb) >= 2 else "—"
        o.append(f"| {p['palette_name']} | `{p['primary_hex']}` | `{p['secondary_hex']}` | `{p['accent_hex']}` | {c} | {p['psychology']} |")
    o += ["", "A palette is a mood board, not the answer: the mark is drawn in black first (Phase 4); test each "
          "colour on white and on the brand's darkest surface at 16 px."]
    return "\n".join(o)


def kit(query: str, as_industry: str | None = None) -> str:
    logo = bm25(load("logo-industries.csv"), DOMAINS["industry"][1], query, 1)
    expanded = f"{query} {logo[0][1]['keywords']} {logo[0][1]['industry']}" if logo else query
    rows_i = load("identity-industries.csv")
    if as_industry:
        ind = [(1.0, r) for r in rows_i if r["industry"].lower() == as_industry.lower()]
        if not ind:
            return f"Unknown identity industry {as_industry!r}. Known: {', '.join(r['industry'] for r in rows_i)}"
    else:
        ind = bm25(rows_i, DOMAINS["identity"][1], expanded, 3)
    o = ["# Identity kit plan", ""]
    if len(ind) > 1:
        o += [f"> Matched **{ind[0][1]['industry']}**; also close: {', '.join(r['industry'] for _, r in ind[1:])}. "
              "Re-run with `--as \"<industry>\"` if another fits better.", ""]
    if ind:
        r = ind[0][1]
        o += [f"**{r['industry']}** — style {r['cip_style']}; colors {r['primary_colors']} / {r['secondary_colors']}; "
              f"type {r['typography']}; mood {r['mood']}", "", f"- Best practices: {r['best_practices']}",
              f"- Avoid: {r['avoid']}", "", "## Deliverables", ""]
        rows = load("identity-deliverables.csv")
        core = ["Primary Logo", "Logo Variations", "Business Card", "Social Media Profile", "Website Favicon"]
        picked = [r2 for r2 in rows if r2["deliverable"] in core]
        for _, d in bm25(rows, ["deliverable", "keywords", "category"], r["key_deliverables"], 8):
            if d not in picked:
                picked.append(d)
        for d in picked:
            o.append(f"- **{d['deliverable']}** ({d['dimensions']}, {d['file_format']}): logo {d['logo_placement']}; "
                     f"{d['best_practices']} · avoid {d['avoid']}")
        o += ["", "## Mockup scenes (for presentation_board.py or real photography)", ""]
        for _, m in bm25(load("identity-mockups.csv"), DOMAINS["mockup"][1], f"{r['industry']} {r['keywords']} {r['key_deliverables']}", 4):
            o.append(f"- **{m['context_name']}**: {m['scene_description']} · light {m['lighting']} · camera {m['camera_angle']}")
        sty = bm25(load("identity-styles.csv"), DOMAINS["identity-style"][1], f"{r['cip_style']} {r['mood']}", 1)
        if sty:
            s = sty[0][1]
            o += ["", f"## Identity style — {s['style_name']}", "", s["description"],
                  f"- Materials: {s['materials']} · finishes: {s['finishes']}"]
    o += ["", "Mockups show the mark in use; never present a mockup as a real photograph of a client asset."]
    return "\n".join(o)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("brief").add_argument("query")
    k = sub.add_parser("kit")
    k.add_argument("query")
    k.add_argument("--as", dest="as_industry", help="force an identity industry (see `search --domain identity`)")
    se = sub.add_parser("search")
    se.add_argument("query")
    se.add_argument("--domain", choices=list(DOMAINS) + ["all"], default="all")
    se.add_argument("-n", type=int, default=5)
    sub.add_parser("domains")
    a = ap.parse_args()
    if a.cmd == "brief":
        print(brief(a.query))
    elif a.cmd == "kit":
        print(kit(a.query, a.as_industry))
    elif a.cmd == "search":
        for d in (DOMAINS if a.domain == "all" else [a.domain]):
            fn, cols, show = DOMAINS[d]
            hits = bm25(load(fn), cols, a.query, a.n if a.domain != "all" else 2)
            if hits:
                print(f"\n## {d}")
            for s, r in hits:
                print(f"— {r[show[0]]}  (score {s:.1f})")
                for c in show[1:]:
                    if r.get(c):
                        print(f"    {c}: {r[c]}")
    else:
        for d, (fn, *_r) in DOMAINS.items():
            print(f"{d:<15} {len(load(fn)):>3}  {fn}")


if __name__ == "__main__":
    main()
