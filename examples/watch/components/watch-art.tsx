/**
 * Product illustration of the Pulse One watch, drawn in SVG so the case and
 * band recolour instantly. Colours are product finishes (data), not UI tokens.
 */
export const finishes = [
  {
    id: "graphite",
    name: "Graphite",
    caseColor: "oklch(0.32 0.01 260)",
    band: "oklch(0.24 0.01 260)",
    accent: "oklch(0.78 0.16 150)",
  },
  {
    id: "silver",
    name: "Silver",
    caseColor: "oklch(0.86 0.01 250)",
    band: "oklch(0.7 0.02 250)",
    accent: "oklch(0.78 0.14 230)",
  },
  {
    id: "sunset",
    name: "Sunset",
    caseColor: "oklch(0.72 0.12 50)",
    band: "oklch(0.62 0.15 35)",
    accent: "oklch(0.85 0.14 80)",
  },
  {
    id: "ocean",
    name: "Ocean",
    caseColor: "oklch(0.45 0.08 240)",
    band: "oklch(0.36 0.09 245)",
    accent: "oklch(0.82 0.12 200)",
  },
] as const;
export type Finish = (typeof finishes)[number];

export type Screen = "time" | "health" | "workout";

export function WatchArt({
  finish,
  screen = "time",
  className = "",
}: {
  finish: Finish;
  screen?: Screen;
  className?: string;
}) {
  const ring = (r: number, pct: number, color: string, width = 7) => {
    const c = 2 * Math.PI * r;
    return (
      <>
        <circle
          cx="120"
          cy="150"
          r={r}
          fill="none"
          stroke="oklch(1 0 0 / 0.1)"
          strokeWidth={width}
        />
        <circle
          cx="120"
          cy="150"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 120 150)"
        />
      </>
    );
  };
  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-label={`Pulse One watch in ${finish.name}`}
    >
      <defs>
        <linearGradient id="caseShade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(1 0 0 / 0.35)" />
          <stop offset="0.5" stopColor="oklch(1 0 0 / 0)" />
          <stop offset="1" stopColor="oklch(0 0 0 / 0.3)" />
        </linearGradient>
      </defs>
      {/* band */}
      <rect x="72" y="0" width="96" height="80" rx="18" fill={finish.band} />
      <rect x="72" y="220" width="96" height="80" rx="18" fill={finish.band} />
      {[20, 40, 250, 270].map((y) => (
        <rect key={y} x="112" y={y} width="16" height="6" rx="3" fill="oklch(0 0 0 / 0.25)" />
      ))}
      {/* case */}
      <rect x="40" y="58" width="160" height="184" rx="46" fill={finish.caseColor} />
      <rect x="40" y="58" width="160" height="184" rx="46" fill="url(#caseShade)" />
      <rect x="198" y="118" width="10" height="30" rx="4" fill={finish.caseColor} />
      <rect x="198" y="118" width="10" height="30" rx="4" fill="oklch(0 0 0 / 0.2)" />
      {/* screen */}
      <rect x="52" y="70" width="136" height="160" rx="36" fill="oklch(0.13 0 0)" />
      {screen === "time" ? (
        <>
          <text
            x="120"
            y="138"
            textAnchor="middle"
            fontSize="44"
            fontWeight="600"
            fill="oklch(0.98 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            10:09
          </text>
          <text
            x="120"
            y="160"
            textAnchor="middle"
            fontSize="12"
            fill="oklch(0.75 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            TUE 14 OCT
          </text>
          <circle cx="92" cy="190" r="4" fill={finish.accent} />
          <text
            x="100"
            y="194"
            fontSize="12"
            fill="oklch(0.9 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            8,432 steps
          </text>
        </>
      ) : screen === "health" ? (
        <>
          {ring(52, 0.82, finish.accent)}
          {ring(41, 0.64, "oklch(0.8 0.14 20)")}
          {ring(30, 0.9, "oklch(0.85 0.12 90)")}
          <text
            x="120"
            y="147"
            textAnchor="middle"
            fontSize="15"
            fontWeight="600"
            fill="oklch(0.98 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            62
          </text>
          <text
            x="120"
            y="162"
            textAnchor="middle"
            fontSize="9"
            fill="oklch(0.75 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            BPM
          </text>
        </>
      ) : (
        <>
          <text
            x="120"
            y="112"
            textAnchor="middle"
            fontSize="11"
            fill={finish.accent}
            fontFamily="system-ui, sans-serif"
          >
            OUTDOOR RUN
          </text>
          <text
            x="120"
            y="148"
            textAnchor="middle"
            fontSize="34"
            fontWeight="600"
            fill="oklch(0.98 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            5.21
          </text>
          <text
            x="120"
            y="165"
            textAnchor="middle"
            fontSize="11"
            fill="oklch(0.75 0 0)"
            fontFamily="system-ui, sans-serif"
          >
            KM · 4′58″/KM
          </text>
          <polyline
            points="70,200 84,192 96,196 108,184 120,190 132,178 146,186 158,176 170,182"
            fill="none"
            stroke={finish.accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
