/**
 * Fictional headlines for the Chainlens template — written for the demo, not
 * real news. Sources are invented publication names.
 */
import { NOW } from "./market";

export type Topic = "Markets" | "Regulation" | "Technology" | "DeFi";
export type Sentiment = "bullish" | "bearish" | "neutral";

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  topic: Topic;
  sentiment: Sentiment;
  coins: string[];
  minutesAgo: number;
  readMinutes: number;
}

export const topics: Topic[] = ["Markets", "Regulation", "Technology", "DeFi"];

export const articles: Article[] = [
  {
    id: "a1",
    title: "Bitcoin holds above $68K as ETF inflows extend to a sixth day",
    summary: "Spot funds added another $410M, while options markets price calmer weeks ahead.",
    source: "Ledger Street",
    topic: "Markets",
    sentiment: "bullish",
    coins: ["bitcoin"],
    minutesAgo: 18,
    readMinutes: 3,
  },
  {
    id: "a2",
    title: "Ethereum developers lock the date for the next network upgrade",
    summary: "The upgrade lowers data costs for rollups and simplifies staking withdrawals.",
    source: "Blockwire",
    topic: "Technology",
    sentiment: "bullish",
    coins: ["ethereum", "arbitrum", "polygon"],
    minutesAgo: 47,
    readMinutes: 5,
  },
  {
    id: "a3",
    title: "EU regulators publish final guidance on stablecoin reserves",
    summary: "Issuers must hold a larger share of reserves in bank deposits from next year.",
    source: "Policy Chain",
    topic: "Regulation",
    sentiment: "neutral",
    coins: ["usdc"],
    minutesAgo: 95,
    readMinutes: 4,
  },
  {
    id: "a4",
    title: "Solana network sets a new daily transaction record",
    summary: "Activity was driven by payments apps and a surge in on-chain games.",
    source: "Blockwire",
    topic: "Technology",
    sentiment: "bullish",
    coins: ["solana"],
    minutesAgo: 140,
    readMinutes: 3,
  },
  {
    id: "a5",
    title: "Lending protocols see deposits climb as yields tick up",
    summary: "Total value locked in lending markets rose 8% over the week.",
    source: "DeFi Digest",
    topic: "DeFi",
    sentiment: "bullish",
    coins: ["aave", "chainlink"],
    minutesAgo: 210,
    readMinutes: 6,
  },
  {
    id: "a6",
    title: "Altcoins slip as traders rotate back into large caps",
    summary: "Mid-cap tokens underperformed while Bitcoin dominance edged higher.",
    source: "Ledger Street",
    topic: "Markets",
    sentiment: "bearish",
    coins: ["cardano", "stellar", "litecoin"],
    minutesAgo: 265,
    readMinutes: 4,
  },
  {
    id: "a7",
    title: "Decentralised exchange volumes cool after a record month",
    summary: "Weekly volume fell 12%, though fees remain above the yearly average.",
    source: "DeFi Digest",
    topic: "DeFi",
    sentiment: "bearish",
    coins: ["uniswap"],
    minutesAgo: 330,
    readMinutes: 5,
  },
  {
    id: "a8",
    title: "Oracle networks expand to real-world asset pricing",
    summary: "New feeds cover treasury bills and commodities for tokenised funds.",
    source: "Blockwire",
    topic: "Technology",
    sentiment: "bullish",
    coins: ["chainlink"],
    minutesAgo: 410,
    readMinutes: 4,
  },
  {
    id: "a9",
    title: "US lawmakers debate a market-structure bill for digital assets",
    summary: "The draft would split oversight between two agencies by asset type.",
    source: "Policy Chain",
    topic: "Regulation",
    sentiment: "neutral",
    coins: ["bitcoin", "ethereum"],
    minutesAgo: 520,
    readMinutes: 7,
  },
  {
    id: "a10",
    title: "Layer-2 fees fall to record lows after data upgrade",
    summary: "Average transaction costs on major rollups dropped below one cent.",
    source: "Rollup Report",
    topic: "Technology",
    sentiment: "bullish",
    coins: ["arbitrum", "polygon"],
    minutesAgo: 690,
    readMinutes: 3,
  },
  {
    id: "a11",
    title: "Cross-border payment pilots expand in South-East Asia",
    summary: "Banks test settlement on public networks for remittances.",
    source: "Ledger Street",
    topic: "Markets",
    sentiment: "neutral",
    coins: ["stellar"],
    minutesAgo: 840,
    readMinutes: 4,
  },
  {
    id: "a12",
    title: "Funding rates turn negative on several altcoin perpetuals",
    summary: "Short positioning builds, a pattern that has preceded squeezes before.",
    source: "Derivatives Desk",
    topic: "Markets",
    sentiment: "bearish",
    coins: ["solana", "cardano"],
    minutesAgo: 1020,
    readMinutes: 5,
  },
  {
    id: "a13",
    title: "Governance vote passes to share protocol fees with stakers",
    summary: "Token holders approved the change with 71% support.",
    source: "DeFi Digest",
    topic: "DeFi",
    sentiment: "bullish",
    coins: ["uniswap", "aave"],
    minutesAgo: 1260,
    readMinutes: 4,
  },
  {
    id: "a14",
    title: "Litecoin hashrate reaches an all-time high",
    summary: "Miners added capacity ahead of the winter power-price season.",
    source: "Blockwire",
    topic: "Technology",
    sentiment: "neutral",
    coins: ["litecoin"],
    minutesAgo: 1500,
    readMinutes: 3,
  },
];

export const publishedAt = (a: Article) => new Date(NOW - a.minutesAgo * 60_000);

export const timeAgo = (a: Article) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return a.minutesAgo < 60
    ? rtf.format(-a.minutesAgo, "minute")
    : rtf.format(-Math.round(a.minutesAgo / 60), "hour");
};
