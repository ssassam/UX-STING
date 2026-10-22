import type { LayoutMeasurement, TasteMeasurement } from "./types.js";

/**
 * In-page layout collector, passed to Playwright's `page.evaluate`. It must
 * stay self-contained (no imports, no outer variables) because Playwright
 * serialises the function source. It reads computed styles and geometry
 * only and returns small, summarised measurements — never the DOM or the
 * accessibility tree.
 */
export function collectLayout(): LayoutMeasurement {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  const path = (el: Element): string => {
    const parts: string[] = [];
    for (let e: Element | null = el; e && e !== document.body && parts.length < 3;) {
      const tag = e.tagName.toLowerCase();
      if (e.id) {
        parts.unshift(`${tag}#${CSS.escape(e.id)}`);
        break;
      }
      const cls = typeof e.className === "string" ? e.className.trim().split(/\s+/)[0] : "";
      const parent: Element | null = e.parentElement;
      const twins = parent
        ? Array.from(parent.children).filter((c) => c.tagName === e!.tagName)
        : [];
      const nth = twins.length > 1 ? `:nth-of-type(${twins.indexOf(e) + 1})` : "";
      parts.unshift(cls && !/[[\]:/]/.test(cls) ? `${tag}.${CSS.escape(cls)}${nth}` : tag + nth);
      e = parent;
    }
    return parts.join(" > ");
  };

  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let e: Element | null = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) < 0.05)
        return false;
    }
    return true;
  };
  const rect = (el: Element) => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top + scrollY,
      bottom: r.bottom + scrollY,
      left: r.left + scrollX,
      right: r.right + scrollX,
    };
  };

  // ── Content leaves: text, media and controls the reader actually sees.
  const MEDIA = "img,svg,video,canvas,picture,iframe,[role=img]";
  const CONTROLS = "a[href],button,input,select,textarea,[role=button],[tabindex]";
  const leaves: Element[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode() as Element | null; n; n = walker.nextNode() as Element | null) {
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(n.tagName)) continue;
    const ownText = Array.from(n.childNodes).some(
      (c) => c.nodeType === 3 && (c.textContent ?? "").trim().length > 0,
    );
    if ((ownText || n.matches(MEDIA) || n.matches(CONTROLS)) && visible(n)) leaves.push(n);
  }

  // ── Horizontal overflow.
  const overflowPx = Math.max(0, document.documentElement.scrollWidth - vw);
  const offenders = overflowPx
    ? Array.from(document.querySelectorAll("body *"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.right > vw + 1 && r.width > 0 && getComputedStyle(el).position !== "fixed";
        })
        // Keep the outermost offenders only.
        .filter((el, _i, all) => !all.some((o) => o !== el && o.contains(el)))
        .slice(0, 5)
        .map(path)
    : [];

  // ── First-screen title.
  const heading =
    Array.from(document.querySelectorAll("h1")).find(visible) ??
    Array.from(document.querySelectorAll("h1,h2,[role=heading]")).find(visible) ??
    document.querySelector("h1");
  let title: LayoutMeasurement["title"] = null;
  if (heading) {
    const r = heading.getBoundingClientRect();
    title = {
      text: (heading.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
      top: Math.round(r.top + scrollY),
      bottom: Math.round(r.bottom + scrollY),
      visible: visible(heading),
      tag: heading.tagName.toLowerCase(),
    };
  }

  // ── Sections: landmarks and full-width bands, unwrapping single-child wrappers.
  const bands: Element[] = [];
  const consider = (el: Element, depth: number) => {
    if (depth > 4 || !visible(el)) return;
    const tag = el.tagName.toLowerCase();
    const structural = ["header", "nav", "section", "footer", "article", "aside"].includes(tag);
    // Headings introduce the band after them; they are not bands themselves.
    if (/^h[1-6]$/.test(tag)) return;
    const r = el.getBoundingClientRect();
    // Unwrap single-child wrappers, but never down to an inline box (a <code> in a <p>).
    const only = el.children.length === 1 ? el.children[0]! : undefined;
    const wrapper = only && !getComputedStyle(only).display.startsWith("inline");
    if (tag === "main" || (!structural && wrapper) || r.width < vw * 0.6) {
      if (r.width >= vw * 0.6 || tag === "main")
        for (const c of Array.from(el.children)) consider(c, depth + 1);
      return;
    }
    bands.push(el);
  };
  for (const c of Array.from(document.body.children)) consider(c, 0);

  const sections = bands.slice(0, 40).map((el) => {
    const box = rect(el);
    const inner = leaves.filter((l) => el.contains(l));
    // The leaves' nearest common ancestor is the layout container; its content
    // box shows centering, unaffected by ragged text or deliberately narrow copy.
    let container: Element = inner[0] ?? el;
    while (container !== el && !inner.every((l) => container.contains(l)))
      container = container.parentElement ?? el;
    // An inline box (a lone link) hugs its text; measure the block around it.
    while (container !== el && getComputedStyle(container).display.startsWith("inline"))
      container = container.parentElement ?? el;
    const cr = rect(container);
    const cs = getComputedStyle(container);
    const left = cr.left + parseFloat(cs.paddingLeft);
    const right = cr.right - parseFloat(cs.paddingRight);
    return {
      target: path(el),
      top: Math.round(box.top),
      height: Math.round(box.bottom - box.top),
      marginStart: Math.round(Math.max(0, left)),
      marginEnd: Math.round(Math.max(0, vw - right)),
      textChars: (el.textContent ?? "").replace(/\s+/g, " ").trim().length,
      childCount: Array.from(el.children).filter(visible).length,
      hasMedia: inner.some((l) => l.matches(MEDIA)),
      hasControls: inner.some((l) => l.matches("input,select,textarea,button")),
      isNav: el.matches("nav, [role=navigation]"),
    };
  });

  // ── Orphaned grid items: last row with a single item under rows of ≥ 3.
  const orphanItems: LayoutMeasurement["orphanItems"] = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const s = getComputedStyle(el);
    if (!/grid|flex/.test(s.display) || el.children.length < 4 || !visible(el)) continue;
    if (s.display.includes("flex") && !s.flexWrap.startsWith("wrap")) continue;
    const kids = Array.from(el.children).filter(visible);
    const rows = new Map<number, number>();
    for (const k of kids) {
      const t = Math.round(k.getBoundingClientRect().top / 4);
      rows.set(t, (rows.get(t) ?? 0) + 1);
    }
    const counts = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, n]) => n);
    const last = counts[counts.length - 1] ?? 0;
    const perRow = counts[0] ?? 0;
    if (counts.length >= 2 && perRow >= 3 && last === 1)
      orphanItems.push({ target: path(el), perRow, lastRow: last });
    if (orphanItems.length >= 5) break;
  }

  // ── Empty stretches: vertical bands no content leaf covers.
  const spans = leaves
    .map(rect)
    .map((r) => [r.top, r.bottom] as const)
    .sort((a, b) => a[0] - b[0]);
  const emptyStretches: LayoutMeasurement["emptyStretches"] = [];
  let cursor = 0;
  for (const [top, bottom] of spans) {
    if (top - cursor >= vh * 0.75)
      emptyStretches.push({ top: Math.round(cursor), height: Math.round(top - cursor) });
    cursor = Math.max(cursor, bottom);
  }
  const docHeight = document.documentElement.scrollHeight;
  if (docHeight - cursor >= vh * 0.75)
    emptyStretches.push({ top: Math.round(cursor), height: Math.round(docHeight - cursor) });

  // ── Contrast of visible text against its composited background.
  const rgba = (color: string): [number, number, number, number] => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
  };
  const background = (el: Element): [number, number, number] | null => {
    const layers: Array<[number, number, number, number]> = [];
    for (let e: Element | null = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== "none" || s.filter !== "none" || s.mixBlendMode !== "normal")
        return null;
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let out: [number, number, number] = [255, 255, 255];
    for (const [r, g, b, a] of layers.reverse())
      out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
    return out;
  };
  const lum = ([r, g, b]: number[]) => {
    const f = (c: number) => {
      const v = c / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
  };
  let checked = 0;
  let skipped = 0;
  const failing: LayoutMeasurement["contrast"]["failing"] = [];
  for (const el of leaves) {
    const text = Array.from(el.childNodes)
      .filter((c) => c.nodeType === 3)
      .map((c) => c.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    if (!text || el.closest("[aria-hidden=true]")) continue;
    if (el.matches(":disabled, [aria-disabled=true]")) continue;
    const s = getComputedStyle(el);
    const bg = background(el);
    if (!bg) {
      skipped++;
      continue;
    }
    const [r, g, b, a] = rgba(s.color);
    const fg = [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];
    const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x) as [number, number];
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    const size = parseFloat(s.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
    const required = large ? 3 : 4.5;
    checked++;
    if (ratio < required - 0.005)
      failing.push({
        target: path(el),
        ratio: Math.round(ratio * 100) / 100,
        required,
        text: text.slice(0, 40),
      });
  }

  return {
    width: vw,
    height: vh,
    documentHeight: docHeight,
    overflow: { px: overflowPx, offenders },
    title,
    sections,
    orphanItems,
    emptyStretches: emptyStretches.slice(0, 5),
    contrast: { checked, skipped, failing: failing.slice(0, 20) },
  };
}

/**
 * Init script that records LCP and CLS with PerformanceObserver. Read the
 * values back with `readVitals`. Self-contained for the same reason as
 * `collectLayout`.
 */
export function installVitals() {
  const w = window as unknown as { __uxVitals: { lcp: number | null; cls: number } };
  w.__uxVitals = { lcp: null, cls: 0 };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) w.__uxVitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as Array<
        PerformanceEntry & { value: number; hadRecentInput: boolean }
      >)
        if (!e.hadRecentInput) w.__uxVitals.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  } catch {
    // Browsers without these entry types report null.
  }
}

export function readVitals() {
  const v = (window as unknown as { __uxVitals?: { lcp: number | null; cls: number } }).__uxVitals;
  return v
    ? { lcp: v.lcp === null ? null : Math.round(v.lcp), cls: Math.round(v.cls * 1000) / 1000 }
    : { lcp: null, cls: null };
}

/** Anti-slop signals (see the ux-sting-taste skill). Self-contained for `page.evaluate`. */
export function collectTaste(): TasteMeasurement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const hsl = (color: string) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data).map((v) => v / 255) as [
      number,
      number,
      number,
    ];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (!d) return { h: 0, s: 0, l };
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: (h * 60 + 360) % 360, s, l };
  };
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
  };
  const label = (el: Element) => {
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
    return (
      el.tagName.toLowerCase() +
      (el.id ? `#${el.id}` : cls && !/[[\]:/]/.test(cls) ? `.${cls}` : "")
    );
  };
  const all = Array.from(document.body.querySelectorAll("*")).filter(visible);

  const purpleGradients: string[] = [];
  const gradientText: string[] = [];
  let glass = 0;
  for (const el of all) {
    const s = getComputedStyle(el);
    if (s.backdropFilter && s.backdropFilter !== "none" && /blur/.test(s.backdropFilter)) glass++;
    if (!/gradient\(/.test(s.backgroundImage)) continue;
    const clip = s.backgroundClip || s.getPropertyValue("-webkit-background-clip");
    if (/text/.test(clip)) gradientText.push(label(el));
    const stops =
      s.backgroundImage.match(
        /(rgba?\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|lab\([^)]*\)|lch\([^)]*\)|color\([^)]*\)|hsla?\([^)]*\)|#[0-9a-f]{3,8})/gi,
      ) ?? [];
    const purple = stops
      .map(hsl)
      .filter((c) => c.h >= 245 && c.h <= 320 && c.s > 0.35 && c.l > 0.2 && c.l < 0.85);
    if (stops.length >= 2 && purple.length) purpleGradients.push(label(el));
  }

  const emojiIcons: Array<{ target: string; text: string }> = [];
  const EMOJI = /\p{Extended_Pictographic}/u;
  for (const el of all) {
    if (!el.matches("h1,h2,h3,h4,h5,h6,button,a,li,dt,span,div,p,i")) continue;
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent ?? "")
      .join("")
      .trim();
    if (!own || !EMOJI.test(own)) continue;
    const stripped = own.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "").trim();
    if (stripped.length === 0 || EMOJI.test(own.slice(0, 2)))
      emojiIcons.push({ target: label(el), text: own.slice(0, 24) });
    if (emojiIcons.length >= 8) break;
  }

  const text = (document.body.innerText || "").replace(/\s+/g, " ");
  const GENERIC = [
    /unlock the (full )?(power|potential)/i,
    /revolutioni[sz]e/i,
    /\bseamless(ly)?\b/i,
    /cutting[- ]edge/i,
    /next[- ]generation/i,
    /elevate your/i,
    /supercharge/i,
    /game[- ]chang/i,
    /in today'?s fast[- ]paced/i,
    /to the next level/i,
    /all[- ]in[- ]one platform/i,
    /harness the power/i,
    /streamline your/i,
    /best[- ]in[- ]class/i,
    /transform the way/i,
    /empower(s|ing)? (you|your|teams)/i,
  ];
  const genericCopy = GENERIC.map((re) => re.exec(text)?.[0]).filter((m): m is string =>
    Boolean(m),
  );
  const fakeStats = [
    ...text.matchAll(
      /\b(\d{1,3}(?:[,.]\d{3})*|\d+(?:\.\d)?[kKmM])\+\s+(?:happy |satisfied |active )?(?:users|customers|clients|teams|companies|developers|businesses)\b|\b99\.9+%|\b10x\b/g,
    ),
  ]
    .map((m) => m[0])
    .slice(0, 5);
  const lorem = /lorem ipsum|dolor sit amet/i.test(text);

  // Centered hero followed by exactly three equal cards.
  let centeredHeroCards: string | null = null;
  const h1 = Array.from(document.querySelectorAll("h1")).find(visible);
  if (h1 && getComputedStyle(h1).textAlign === "center") {
    const after = Array.from(document.querySelectorAll("section, [class*=grid], ul, div")).filter(
      (el) => {
        const r = el.getBoundingClientRect();
        return (
          visible(el) &&
          r.top + scrollY > h1.getBoundingClientRect().bottom + scrollY &&
          r.top + scrollY < h1.getBoundingClientRect().bottom + scrollY + 1400
        );
      },
    );
    for (const el of after) {
      const kids = Array.from(el.children).filter(visible);
      if (kids.length !== 3) continue;
      const rects = kids.map((k) => k.getBoundingClientRect());
      const sameRow = rects.every((r) => Math.abs(r.top - rects[0]!.top) < 4);
      const w = rects.map((r) => r.width);
      const equal = Math.max(...w) - Math.min(...w) < Math.max(...w) * 0.05 && Math.min(...w) > 160;
      const cardish = kids.every(
        (k) => k.querySelector("h2,h3,h4") && (k.textContent ?? "").trim().length > 20,
      );
      if (sameRow && equal && cardish) {
        centeredHeroCards = label(el);
        break;
      }
    }
  }

  // Numbers in tables should be end-aligned and use tabular figures.
  let numericCells = 0;
  let misaligned = 0;
  let proportional = 0;
  for (const cell of Array.from(document.querySelectorAll("td")).filter(visible).slice(0, 400)) {
    const t = (cell.textContent ?? "").trim();
    if (!/\d/.test(t) || !/^[\s$€£¥₹%+\-−–.,:\d]+\s?[kKmMbB%]?$/.test(t)) continue;
    numericCells++;
    const s = getComputedStyle(cell);
    const dir = getComputedStyle(document.documentElement).direction;
    const end = s.textAlign === "end" || s.textAlign === (dir === "rtl" ? "left" : "right");
    if (!end) misaligned++;
    const inner = cell.firstElementChild ? getComputedStyle(cell.firstElementChild) : s;
    const tabular =
      /tabular-nums/.test(s.fontVariantNumeric + inner.fontVariantNumeric) ||
      /mono/i.test(s.fontFamily);
    if (!tabular) proportional++;
  }

  return {
    purpleGradients: purpleGradients.slice(0, 5),
    gradientText: gradientText.slice(0, 5),
    emojiIcons,
    genericCopy,
    fakeStats,
    lorem,
    glass,
    centeredHeroCards,
    numbers: { cells: numericCells, misaligned, proportional },
  };
}
