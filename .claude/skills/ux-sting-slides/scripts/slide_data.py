#!/usr/bin/env python3
"""UX-STING slide data: deck strategies, layouts, type scale, color by emotion, copy formulas, charts.

Standard library only, no network. Data in ../references/data/slide-*.csv, adapted from the
MIT-licensed UI/UX Pro Max design-system skill (see THIRD_PARTY_NOTICES.md in UX-STING).

  python3 slide_data.py plan "seed round pitch for a bakery chain" [--persist] [--out DIR]
  python3 slide_data.py search "revenue growth" [--domain chart] [-n 5]
  python3 slide_data.py domains
"""
from __future__ import annotations

import argparse
import csv
import math
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "references" / "data"

DOMAINS = {
    "strategy": ("slide-strategies.csv", ["strategy_name", "keywords", "goal", "audience"],
                 ["strategy_name", "slide_count", "structure", "emotion_arc", "audience", "tone"]),
    "layout": ("slide-layouts.csv", ["layout_name", "keywords", "use_case", "recommended_for"],
               ["layout_name", "use_case", "content_zones", "visual_weight", "avoid_for", "animation_class"]),
    "copy": ("slide-copy.csv", ["formula_name", "keywords", "use_case", "slide_type"],
             ["formula_name", "components", "example_template", "slide_type"]),
    "chart": ("slide-charts.csv", ["chart_type", "keywords", "best_for", "when_to_use", "slide_context"],
              ["chart_type", "best_for", "when_to_avoid", "max_categories", "accessibility_notes"]),
    "type": ("slide-typography.csv", ["content_type"],
             ["content_type", "primary_size", "secondary_size", "accent_size", "weight_contrast", "line_height"]),
    "color": ("slide-color-logic.csv", ["emotion"],
              ["emotion", "background", "text_color", "accent_usage", "use_full_bleed", "card_style"]),
    "background": ("slide-backgrounds.csv", ["slide_type", "image_category", "search_keywords"],
                   ["slide_type", "image_category", "overlay_style", "text_placement", "search_keywords"]),
    "layout-logic": ("slide-layout-logic.csv", ["goal", "emotion", "layout_pattern"],
                     ["goal", "emotion", "layout_pattern", "direction", "visual_weight", "break_pattern"]),
}

# Slide title words -> layout-logic goal.
TITLE_GOALS = [
    (r"title|cover|intro|welcome", "hook"), (r"problem|pain|challenge|opportunit", "problem"),
    (r"solution|value|magic|how it works|approach", "solution"), (r"traction|growth|result|metric|kpi", "traction"),
    (r"market|size|tam", "proof"), (r"financ|projection|revenue|numbers", "traction"),
    (r"product|demo|walkthrough", "demo"), (r"business model|pricing|plan", "pricing"),
    (r"compet|comparison|alternative|landscape", "comparison"), (r"team|people|founder|who", "team"),
    (r"roadmap|timeline|status|milestone|agenda|structure", "timeline"), (r"vision|future", "vision"),
    (r"feature|capabilit", "features"), (r"testimonial|customer|case|quote|story", "social"),
    (r"ask|cta|next step|call|q&a|questions|contact|resources", "cta"),
]
# Sparkline beat -> goal, when the title says nothing.
BEAT_GOALS = {"hook": "hook", "what-is": "problem", "what-could-be": "solution", "proof": "proof",
              "trust": "social", "action": "cta", "evaluation": "comparison", "comparison": "comparison",
              "analysis": "comparison", "new-bliss": "vision", "summary": "features", "overview": "features",
              "celebration": "traction", "insight": "traction", "connection": "social", "interaction": "demo",
              "synthesis": "features", "welcome": "hook", "structure": "timeline", "teaching": "features",
              "practice": "demo", "resources": "cta"}
GOAL_TYPE = {"hook": "hero-statement", "problem": "subtitle-heavy", "agitation": "metric-callout",
             "solution": "feature-grid", "proof": "metric-callout", "social": "testimonial",
             "comparison": "comparison", "traction": "data-insight", "cta": "cta-action", "team": "team",
             "pricing": "pricing", "demo": "body-focus", "vision": "hero-statement", "timeline": "timeline",
             "features": "feature-grid"}
GOAL_BG = {"hook": "hook", "problem": "problem", "solution": "solution", "team": "team", "social": "testimonial",
           "cta": "cta", "vision": "vision", "demo": "demo"}
CHART_GOALS = {"traction", "proof", "comparison"}


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


def by(rows: list[dict], key: str, value: str) -> dict | None:
    return next((r for r in rows if r[key] == value), None)


def goal_for(title: str, beat: str) -> str:
    for pattern, goal in TITLE_GOALS:
        if re.search(pattern, title.lower()):
            return goal
    return BEAT_GOALS.get(beat, "features")


def plan(query: str) -> dict:
    strategies = load("slide-strategies.csv")
    hits = bm25(strategies, DOMAINS["strategy"][1], query, 3)
    strat = hits[0][1] if hits else by(strategies, "strategy_name", "Problem-Solution-Benefit")
    titles = [t.strip() for t in re.split(r"\s*\d+\.\s*", strat["structure"]) if t.strip()]
    beats = strat["sparkline_beats"].split("|")
    arc = [e.strip() for e in strat["emotion_arc"].split("→") if e.strip()]
    if not titles:
        titles = [b.replace("-", " ").title() for b in beats]
    logic, layouts, types = load("slide-layout-logic.csv"), load("slide-layouts.csv"), load("slide-typography.csv")
    colors, bgs, copy, charts = (load("slide-color-logic.csv"), load("slide-backgrounds.csv"),
                                 load("slide-copy.csv"), load("slide-charts.csv"))
    slides, prev_layout = [], None
    n = len(titles)
    for i, title in enumerate(titles):
        beat = beats[min(i, len(beats) - 1)]
        goal = goal_for(title, beat)
        emotion = arc[round(i * (len(arc) - 1) / max(n - 1, 1))] if arc else "clarity"
        lg = by(logic, "goal", goal) or {}
        layout = bm25(layouts, ["layout_name", "keywords", "use_case"],
                      f"{title} {goal} {lg.get('layout_pattern', '').replace('-', ' ')}", 1)
        layout_row = layout[0][1] if layout else None
        # Break the rhythm: never the same layout twice in a row.
        if layout_row and prev_layout == layout_row["layout_name"]:
            alt = bm25(layouts, ["layout_name", "keywords", "use_case"], f"{title} {goal}", 2)
            layout_row = alt[1][1] if len(alt) > 1 else layout_row
        prev_layout = layout_row["layout_name"] if layout_row else None
        col = by(colors, "emotion", emotion) or by(colors, "emotion", lg.get("emotion", "")) or {}
        cp = bm25(copy, ["formula_name", "keywords", "use_case", "slide_type"], f"{title} {goal}", 1)
        slide = {"n": i + 1, "title": title, "beat": beat, "goal": goal, "emotion": emotion,
                 "pattern": lg.get("layout_pattern", ""), "direction": lg.get("direction", ""),
                 "layout": layout_row, "type": by(types, "content_type", GOAL_TYPE.get(goal, "body-focus")),
                 "color": col, "copy": cp[0][1] if cp else None,
                 "background": by(bgs, "slide_type", GOAL_BG[goal]) if goal in GOAL_BG and lg.get("use_bg_image") == "true" else None,
                 "chart": None}
        if goal in CHART_GOALS:
            ch = bm25(charts, DOMAINS["chart"][1], f"{title} {strat['key_metrics']}", 1)
            slide["chart"] = ch[0][1] if ch else None
        slides.append(slide)
    return {"query": query, "strategy": strat, "alternatives": [r["strategy_name"] for _, r in hits[1:]],
            "slides": slides}


CHART_MAP = [("line", "LineChart"), ("area", "LineChart (area)"), ("bar", "BarChart"), ("column", "BarChart"),
             ("donut", "DonutChart"), ("pie", "DonutChart"), ("funnel", "BarList"), ("sparkline", "Sparkline"),
             ("kpi", "ChartMetrics"), ("metric", "ChartMetrics"), ("number", "ChartMetrics"), ("progress", "BarList")]


def ux_chart(chart_type: str) -> str:
    low = chart_type.lower()
    return next((c for k, c in CHART_MAP if k in low), "BarChart or ChartTable")


def to_markdown(p: dict) -> str:
    s = p["strategy"]
    o = [f"# Deck plan — {s['strategy_name']}", "",
         f"> Brief: “{p['query']}” · also close: {', '.join(p['alternatives']) or '—'}", "",
         f"- **Goal:** {s['goal']}", f"- **Audience:** {s['audience']}", f"- **Tone:** {s['tone']}",
         f"- **Narrative:** {s['narrative_arc']}", f"- **Emotion arc:** {s['emotion_arc']}",
         f"- **Metrics to show:** {s['key_metrics']}", f"- **Slides:** {s['slide_count']} · source: {s['sources']}", "",
         "| # | Slide | Beat → goal | Emotion | Layout | Type scale | Color |", "| --- | --- | --- | --- | --- | --- | --- |"]
    for sl in p["slides"]:
        t, c = sl["type"] or {}, sl["color"] or {}
        o.append(f"| {sl['n']} | {sl['title']} | {sl['beat']} → {sl['goal']} | {sl['emotion']} | "
                 f"{sl['layout']['layout_name'] if sl['layout'] else sl['pattern']} | "
                 f"{t.get('primary_size', '—')}/{t.get('secondary_size', '—')} | "
                 f"{c.get('background', '—')}, accent {c.get('accent_usage', '—')} |")
    o.append("")
    for sl in p["slides"]:
        o += [f"## {sl['n']}. {sl['title']}", ""]
        if sl["layout"]:
            lay = sl["layout"]
            o += [f"- **Layout:** {lay['layout_name']} ({sl['pattern']}, {sl['direction']}) — zones: {lay['content_zones']}; "
                  f"weight: {lay['visual_weight']}; avoid: {lay['avoid_for']}"]
        if sl["type"]:
            t = sl["type"]
            o += [f"- **Type:** {t['primary_size']} / {t['secondary_size']} / {t['accent_size']}, weights {t['weight_contrast']}, "
                  f"tracking {t['letter_spacing']}, leading {t['line_height']}"]
        if sl["color"]:
            c = sl["color"]
            o += [f"- **Color ({sl['emotion']}):** background {c['background']}, text {c['text_color']}, accent {c['accent_usage']}, "
                  f"full-bleed {c['use_full_bleed']}, gradient {c['gradient']}, cards {c['card_style']}"]
        if sl["copy"]:
            cp = sl["copy"]
            o += [f"- **Copy ({cp['formula_name']}):** {cp['example_template']}"]
        if sl["chart"]:
            ch = sl["chart"]
            o += [f"- **Chart:** {ch['chart_type']} → `@ux-sting/react/chart` `{ux_chart(ch['chart_type'])}`; "
                  f"max {ch['max_categories']} categories; {ch['accessibility_notes']}"]
        if sl["background"]:
            b = sl["background"]
            o += [f"- **Image:** `npx ux-sting images \"{b['search_keywords']}\" --source commons,met,openverse` "
                  f"({b['image_category']}, overlay {b['overlay_style']}, text {b['text_placement']})"]
        o.append("")
    o += ["Every number, quote and logo comes from the brief or a cited source, or stays a `{{placeholder}}`."]
    return "\n".join(o)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    pl = sub.add_parser("plan", help="pick a deck strategy and plan every slide")
    pl.add_argument("query")
    pl.add_argument("--persist", action="store_true", help="write .ux-sting/slides/plan.md")
    pl.add_argument("--out", default=".")
    pl.add_argument("--force", action="store_true")
    se = sub.add_parser("search")
    se.add_argument("query")
    se.add_argument("--domain", choices=list(DOMAINS) + ["all"], default="all")
    se.add_argument("-n", type=int, default=5)
    sub.add_parser("domains")
    a = ap.parse_args()
    if a.cmd == "plan":
        md = to_markdown(plan(a.query))
        if a.persist:
            f = Path(a.out) / ".ux-sting" / "slides" / "plan.md"
            if f.exists() and not a.force:
                sys.exit(f"{f} exists; use --force to overwrite.")
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text(md, encoding="utf-8")
            print(f"wrote {f}")
        else:
            print(md)
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
            print(f"{d:<13} {len(load(fn)):>3}  {fn}")


if __name__ == "__main__":
    main()
