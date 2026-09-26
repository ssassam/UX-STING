# Chainlens — crypto analytics and news template

A market dashboard built with UX-STING: summary stat cards, an interactive price chart (hover or arrow keys, with a table view), top movers, a sortable and searchable asset table with sparklines and a watchlist, coin pages and a news feed with topics and sentiment. Dark mode and compact density by default.

**All prices, charts and headlines are generated sample data** (seeded in `lib/market.ts` and `lib/news.ts`). They are not real market data and not financial advice.

```bash
pnpm --filter @ux-sting/example-crypto dev
```

- Chart: `components/price-chart.tsx` (dependency-free SVG).
- Live demo: https://ssassam.github.io/UX-STING/crypto/

## Screenshots

<table>
<tr><td width="50%" align="center"><a href="screenshots/1-markets.webp"><img src="screenshots/1-markets.webp" alt="Market overview" width="100%"></a><br><sub>Market overview</sub></td><td width="50%" align="center"><a href="screenshots/2-chart.webp"><img src="screenshots/2-chart.webp" alt="Interactive price chart" width="100%"></a><br><sub>Interactive price chart</sub></td></tr>
<tr><td width="50%" align="center"><a href="screenshots/3-assets.webp"><img src="screenshots/3-assets.webp" alt="Sortable asset table" width="100%"></a><br><sub>Sortable asset table</sub></td><td width="50%" align="center"><a href="screenshots/4-coin.webp"><img src="screenshots/4-coin.webp" alt="Coin page" width="100%"></a><br><sub>Coin page</sub></td></tr>
<tr><td width="50%" align="center"><a href="screenshots/5-news.webp"><img src="screenshots/5-news.webp" alt="News with images" width="100%"></a><br><sub>News with images</sub></td><td width="50%" align="center"><a href="screenshots/6-light-mode.webp"><img src="screenshots/6-light-mode.webp" alt="Light mode" width="100%"></a><br><sub>Light mode</sub></td></tr>
</table>

