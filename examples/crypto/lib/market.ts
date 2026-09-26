/**
 * Sample market data for the Chainlens template. Everything here is generated
 * from a fixed seed — it is NOT real price data and must not be used to trade.
 */

export type Range = "1D" | "1W" | "1M" | "1Y";
export interface Point {
  t: number;
  price: number;
}
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  category: "Layer 1" | "Layer 2" | "DeFi" | "Stablecoin" | "Payments";
  price: number;
  supply: number;
  volatility: number;
  seed: number;
  about: string;
}

export const coins: Coin[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    category: "Layer 1",
    price: 68420,
    supply: 19.7e6,
    volatility: 0.018,
    seed: 11,
    about: "The first decentralised digital currency, secured by proof-of-work mining.",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    category: "Layer 1",
    price: 3380,
    supply: 120.2e6,
    volatility: 0.024,
    seed: 23,
    about: "A programmable blockchain for smart contracts and decentralised applications.",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    category: "Layer 1",
    price: 162,
    supply: 465e6,
    volatility: 0.034,
    seed: 37,
    about: "A high-throughput chain designed for fast, low-cost transactions.",
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    category: "Layer 1",
    price: 0.46,
    supply: 35.6e9,
    volatility: 0.03,
    seed: 41,
    about: "A research-driven proof-of-stake blockchain.",
  },
  {
    id: "polygon",
    symbol: "POL",
    name: "Polygon",
    category: "Layer 2",
    price: 0.58,
    supply: 10.4e9,
    volatility: 0.036,
    seed: 53,
    about: "Scaling infrastructure that settles to Ethereum.",
  },
  {
    id: "arbitrum",
    symbol: "ARB",
    name: "Arbitrum",
    category: "Layer 2",
    price: 0.94,
    supply: 3.8e9,
    volatility: 0.038,
    seed: 61,
    about: "An optimistic rollup that makes Ethereum transactions cheaper.",
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    category: "DeFi",
    price: 14.2,
    supply: 608e6,
    volatility: 0.032,
    seed: 71,
    about: "A decentralised oracle network that brings real-world data on-chain.",
  },
  {
    id: "uniswap",
    symbol: "UNI",
    name: "Uniswap",
    category: "DeFi",
    price: 8.9,
    supply: 600e6,
    volatility: 0.035,
    seed: 83,
    about: "The governance token of a leading decentralised exchange.",
  },
  {
    id: "aave",
    symbol: "AAVE",
    name: "Aave",
    category: "DeFi",
    price: 96,
    supply: 14.8e6,
    volatility: 0.033,
    seed: 97,
    about: "A lending protocol for borrowing and supplying crypto assets.",
  },
  {
    id: "stellar",
    symbol: "XLM",
    name: "Stellar",
    category: "Payments",
    price: 0.11,
    supply: 29.4e9,
    volatility: 0.027,
    seed: 101,
    about: "A network for fast, low-cost cross-border payments.",
  },
  {
    id: "litecoin",
    symbol: "LTC",
    name: "Litecoin",
    category: "Payments",
    price: 72,
    supply: 74.9e6,
    volatility: 0.025,
    seed: 113,
    about: "An early Bitcoin fork with faster block times.",
  },
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    category: "Stablecoin",
    price: 1,
    supply: 33e9,
    volatility: 0.0006,
    seed: 127,
    about: "A stablecoin backed one-to-one by US-dollar reserves.",
  },
];

/** Deterministic PRNG so the demo looks the same on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RANGES: Record<Range, { points: number; stepMs: number; volScale: number }> = {
  "1D": { points: 96, stepMs: 15 * 60_000, volScale: 0.12 },
  "1W": { points: 168, stepMs: 60 * 60_000, volScale: 0.25 },
  "1M": { points: 120, stepMs: 6 * 60 * 60_000, volScale: 0.5 },
  "1Y": { points: 365, stepMs: 24 * 60 * 60_000, volScale: 1 },
};

/** Fixed "now" so server and client render identical series. */
export const NOW = Date.UTC(2026, 8, 26, 16, 0);

/** Random walk that ends exactly at the coin's current price. */
export function series(coin: Coin, range: Range): Point[] {
  const { points, stepMs, volScale } = RANGES[range];
  const rand = mulberry32(coin.seed * 7 + points);
  const steps: number[] = [];
  let log = 0;
  const drift = (rand() - 0.45) * 0.002;
  for (let i = 0; i < points; i++) {
    log += drift + (rand() - 0.5) * 2 * coin.volatility * volScale;
    steps.push(log);
  }
  const end = steps[steps.length - 1]!;
  return steps.map((l, i) => ({
    t: NOW - (points - 1 - i) * stepMs,
    price: coin.price * Math.exp(l - end),
  }));
}

export function stats(coin: Coin, range: Range = "1D") {
  const s = series(coin, range);
  const first = s[0]!.price;
  const prices = s.map((p) => p.price);
  return {
    change: (coin.price - first) / first,
    high: Math.max(...prices),
    low: Math.min(...prices),
    marketCap: coin.price * coin.supply,
    volume: coin.price * coin.supply * (0.02 + mulberry32(coin.seed)() * 0.06),
  };
}

export const getCoin = (id: string) => coins.find((c) => c.id === id);

export const formatUsd = (v: number, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : v >= 100 ? 0 : v >= 1 ? 2 : 4,
    minimumFractionDigits: compact ? 0 : v >= 100 ? 0 : 2,
  }).format(v);

export const formatPct = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(v);

export const totalMarketCap = coins.reduce((n, c) => n + c.price * c.supply, 0);
