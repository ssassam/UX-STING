/**
 * In-page collector, passed to Playwright's `page.evaluate`. It must stay
 * self-contained (no imports, no outer variables): Playwright serialises the
 * function source. It reads computed styles and geometry only — it never
 * sees or infers source code — and returns a `PageObservation`.
 */
export function collectPage(opts: { authorized: boolean }) {
  const vw = document.documentElement.clientWidth;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const hex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  // The canvas normalises any CSS color syntax (oklch, lab, color-mix…) to sRGB.
  const rgba = (color: string): [number, number, number, number] => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
  };
  const bgOf = (el: Element | null): [number, number, number] => {
    const layers: Array<[number, number, number, number]> = [];
    for (let e = el; e; e = e.parentElement) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let out: [number, number, number] = [255, 255, 255];
    for (const [r, g, b, a] of layers.reverse())
      out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
    return out;
  };
  const colorOn = (color: string, el: Element) => {
    const [r, g, b, a] = rgba(color);
    const [br, bg, bb] = bgOf(el);
    return hex(r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a));
  };
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return (
      r.width > 0 &&
      r.height > 0 &&
      s.visibility !== "hidden" &&
      s.display !== "none" &&
      Number(s.opacity) > 0.05
    );
  };
  const top = (el: Element) => el.getBoundingClientRect().top + scrollY;
  const ownText = (el: Element) =>
    Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  const align = (v: string): "start" | "center" | "end" =>
    v === "center"
      ? "center"
      : v === "right" || v === "end"
        ? getComputedStyle(document.documentElement).direction === "rtl"
          ? "start"
          : "end"
        : "start";

  // ── Sections: full-width blocks under body/main, unwrapping single-child wrappers.
  const blocks: Element[] = [];
  const consider = (el: Element, depth: number) => {
    if (!visible(el) || depth > 4) return;
    const r = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "noscript", "template"].includes(tag)) return;
    const structural = ["header", "nav", "section", "footer", "article", "aside"].includes(tag);
    if (
      tag === "main" ||
      (!structural && el.children.length === 1) ||
      (!structural &&
        r.width >= vw * 0.9 &&
        el.children.length > 1 &&
        r.height > window.innerHeight * 2)
    ) {
      Array.from(el.children).forEach((c) => consider(c, depth + 1));
      return;
    }
    if (r.width >= vw * 0.85 && r.height >= 48) blocks.push(el);
  };
  Array.from(document.body.children).forEach((c) => consider(c, 0));

  const textSel = "h1,h2,h3,h4,p,li,a,button,small,label,span,dt,dd,figcaption,blockquote";
  const sections = blocks.map((el) => {
    const r = el.getBoundingClientRect();
    const all = Array.from(el.querySelectorAll("*")).filter(visible);
    const contentWidth = Math.max(
      0,
      ...all
        .filter((d) => d.getBoundingClientRect().width < r.width - 8)
        .map((d) => d.getBoundingClientRect().width),
    );
    // Main row: the first descendant whose children sit side by side.
    let columns = 1;
    let columnWidths: number[] = [r.width];
    let gap = 0;
    let repeatedItems = 0;
    for (const d of [el, ...all]) {
      const kids = Array.from(d.children).filter(visible);
      if (kids.length < 2) continue;
      const rects = kids.map((k) => k.getBoundingClientRect());
      const firstTop = rects[0]!.top;
      const row = rects.filter((k) => Math.abs(k.top - firstTop) < 12 && k.width > 60);
      if (row.length >= 2) {
        columns = row.length;
        columnWidths = row.map((k) => Math.round(k.width));
        const sorted = [...row].sort((a, b) => a.left - b.left);
        gap = Math.max(0, Math.round(sorted[1]!.left - sorted[0]!.right));
        const w0 = rects[0]!.width;
        const h0 = rects[0]!.height;
        repeatedItems = rects.filter(
          (k) =>
            Math.abs(k.width - w0) < w0 * 0.12 && Math.abs(k.height - h0) < Math.max(40, h0 * 0.4),
        ).length;
        break;
      }
    }
    const texts = all.filter((d) => d.matches(textSel) && ownText(d));
    const firstText = texts[0];
    const aligns = texts.map((t) => align(getComputedStyle(t).textAlign));
    const centerCount = aligns.filter((a) => a === "center").length;
    const lis = el.querySelectorAll("ol > li").length;
    const ruled = all.filter(
      (d) =>
        parseFloat(getComputedStyle(d).borderTopWidth) > 0 &&
        d.getBoundingClientRect().width > r.width * 0.5,
    ).length;
    const bg = rgba(getComputedStyle(el).backgroundColor);
    return {
      tag: el.tagName.toLowerCase(),
      top: Math.round(r.top + scrollY),
      height: Math.round(r.height),
      width: Math.round(r.width),
      contentWidth: Math.round(contentWidth || r.width),
      background:
        bg[3] > 0.5 ? colorOn(getComputedStyle(el).backgroundColor, el.parentElement ?? el) : null,
      paddingBlock: firstText ? Math.max(0, Math.round(top(firstText) - (r.top + scrollY))) : 0,
      columns,
      columnWidths,
      childCount: el.children.length,
      gap,
      hasMedia:
        !!el.querySelector("img,video,picture,canvas,iframe,[role=img]") ||
        all.some((d) => d.tagName.toLowerCase() === "svg" && d.getBoundingClientRect().width > 200),
      repeatedItems,
      textAlign: (centerCount > aligns.length / 2 ? "center" : "start") as "center" | "start",
      indexed: lis >= 3 || ruled >= 3,
    };
  });

  // ── Text samples
  const bodySize = parseFloat(getComputedStyle(document.body).fontSize) || 16;
  const texts = Array.from(document.querySelectorAll(textSel))
    .filter((el) => visible(el) && ownText(el).length > 0)
    .slice(0, 600)
    .map((el) => {
      const s = getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const size = parseFloat(s.fontSize);
      const filled = rgba(s.backgroundColor)[3] > 0.5;
      const role =
        tag === "h1" || tag === "h2" || tag === "h3"
          ? tag
          : tag === "button" || ((tag === "a" || el.getAttribute("role") === "button") && filled)
            ? "button"
            : tag === "a"
              ? "link"
              : s.textTransform === "uppercase" && size <= bodySize
                ? "label"
                : size < bodySize * 0.92 || tag === "small"
                  ? "small"
                  : "body";
      const lh = s.lineHeight === "normal" ? size * 1.2 : parseFloat(s.lineHeight);
      return {
        role,
        fontFamily: s.fontFamily,
        fontSize: Math.round(size * 10) / 10,
        fontWeight: Number(s.fontWeight) || 400,
        lineHeight: Math.round(lh * 10) / 10,
        letterSpacing: s.letterSpacing === "normal" ? 0 : parseFloat(s.letterSpacing),
        uppercase: s.textTransform === "uppercase",
        textAlign: align(s.textAlign),
        color: colorOn(s.color, el),
        chars: ownText(el).length,
        left: Math.round(el.getBoundingClientRect().left),
      };
    });

  // ── Controls, borders, radii, shadows, motion
  const els = Array.from(document.querySelectorAll("body *")).filter(visible).slice(0, 4000);
  const buttons = els
    .filter((el) => {
      const tag = el.tagName.toLowerCase();
      return (
        (tag === "button" || tag === "a" || el.getAttribute("role") === "button") &&
        rgba(getComputedStyle(el).backgroundColor)[3] > 0.5 &&
        el.getBoundingClientRect().height >= 28
      );
    })
    .slice(0, 60)
    .map((el) => {
      const s = getComputedStyle(el);
      return {
        background: colorOn(s.backgroundColor, el.parentElement ?? el),
        color: colorOn(s.color, el),
        radius: parseFloat(s.borderTopLeftRadius) || 0,
        borderWidth: parseFloat(s.borderTopWidth) || 0,
      };
    });
  const links = els
    .filter((el) => el.tagName === "A" && el.closest("main"))
    .slice(0, 80)
    .map((el) => colorOn(getComputedStyle(el).color, el));
  const borderColors: string[] = [];
  const radii: number[] = [];
  const shadows: Array<{ blur: number; offset: number }> = [];
  for (const el of els) {
    const s = getComputedStyle(el);
    const bw = parseFloat(s.borderTopWidth) || parseFloat(s.borderBottomWidth);
    if (bw > 0 && s.borderTopStyle !== "none")
      borderColors.push(colorOn(s.borderTopColor, el.parentElement ?? el));
    const rad = parseFloat(s.borderTopLeftRadius);
    if (
      rad > 0 &&
      (bw > 0 || rgba(s.backgroundColor)[3] > 0.5) &&
      el.getBoundingClientRect().width > 120
    )
      radii.push(rad);
    if (s.boxShadow && s.boxShadow !== "none") {
      const nums = s.boxShadow
        .replace(/rgba?\([^)]*\)|oklch\([^)]*\)|#[0-9a-f]+/gi, "")
        .trim()
        .split(/\s+/)
        .map(parseFloat);
      if (nums.length >= 3)
        shadows.push({ offset: Math.max(Math.abs(nums[0]!), Math.abs(nums[1]!)), blur: nums[2]! });
    }
  }
  const transitionsMs = els
    .filter((el) => el.matches("a,button,[role=button],input,select,textarea,summary"))
    .flatMap((el) =>
      getComputedStyle(el)
        .transitionDuration.split(",")
        .map((d) => parseFloat(d) * (d.includes("ms") ? 1 : 1000)),
    )
    .filter((d) => d > 0)
    .slice(0, 200);

  const header = document.querySelector("header") ?? document.querySelector("nav");
  const navLinks = Array.from((header ?? document.body).querySelectorAll("nav a, header a")).filter(
    visible,
  );
  const pos = header ? getComputedStyle(header).position : "static";
  const images = Array.from(document.querySelectorAll("img,video,picture"))
    .filter(visible)
    .slice(0, 80)
    .map((el) => {
      const r = el.getBoundingClientRect();
      return {
        width: Math.round(r.width),
        height: Math.round(r.height),
        fullBleed: r.width >= vw * 0.95,
      };
    })
    .filter((im) => im.width >= 80 && im.height >= 60);

  const outline = opts.authorized
    ? blocks.map((el) => {
        const h = el.querySelector("h1,h2,h3");
        const p = Array.from(el.querySelectorAll("p")).find(
          (x) => visible(x) && (x.textContent ?? "").trim().length > 20,
        );
        // One entry per list item or card: its heading if it has one, else its first line of text.
        const cards = Array.from(el.querySelectorAll("li, article")).filter(
          (x) => visible(x) && !x.parentElement?.closest("li, article"),
        );
        const items = cards
          .map((x) => {
            const head = x.querySelector("h3, h4, strong, dt");
            const text =
              (head as HTMLElement | null)?.innerText ?? (x as HTMLElement).innerText ?? "";
            return (
              text
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)[0]
                ?.slice(0, 80) ?? ""
            );
          })
          .filter(Boolean)
          .slice(0, 9);
        const cta = Array.from(el.querySelectorAll("a, button")).find(
          (x) => visible(x) && rgba(getComputedStyle(x).backgroundColor)[3] > 0.5,
        );
        return {
          action: (cta as HTMLElement | undefined)?.innerText.trim().slice(0, 40) || undefined,
          heading: h?.textContent?.replace(/\s+/g, " ").trim().slice(0, 140),
          text: p?.textContent?.replace(/\s+/g, " ").trim().slice(0, 320),
          items: [...new Set(items)],
        };
      })
    : [];

  return {
    url: location.href,
    viewport: { width: vw, height: window.innerHeight },
    lang: document.documentElement.lang || "en",
    dir: (getComputedStyle(document.documentElement).direction === "rtl" ? "rtl" : "ltr") as
      "ltr" | "rtl",
    title: document.title,
    description:
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? undefined,
    documentHeight: document.documentElement.scrollHeight,
    pageBackground: hex(...bgOf(document.body)),
    texts,
    sections,
    buttons,
    linkColors: links,
    borderColors,
    radii,
    shadows,
    transitionsMs,
    animations: document.getAnimations().filter((a) => a.playState === "running").length,
    nav: {
      itemCount: navLinks.length,
      sticky: pos === "sticky" || pos === "fixed",
      labels: opts.authorized
        ? navLinks
            .map((a) => (a as HTMLElement).innerText.trim())
            .filter(Boolean)
            .slice(0, 7)
        : [],
    },
    headingColor: (() => {
      const h = document.querySelector("h1, h2");
      return h ? colorOn(getComputedStyle(h).color, h) : undefined;
    })(),
    images,
    outline,
  };
}
