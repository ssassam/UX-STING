#!/usr/bin/env bash
# Builds every demo as a static export and assembles one GitHub Pages site:
#   /<repo>/          Wayfare travel
#   /<repo>/cars/     Drivo car rental
#   /<repo>/shop/     Maison Nord shop
#   /<repo>/watch/    Pulse One product landing page
#   /<repo>/crypto/   Chainlens crypto analytics
#   /<repo>/ember/    Ember restaurant reservations
# Usage: scripts/build-pages.sh [/base-path]   (default: /UX-STING)
set -euo pipefail
BASE="${1:-/UX-STING}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/pages-dist"
rm -rf "$OUT"

build() { # <example dir> <sub path>
  local dir="$1" sub="$2"
  (cd "$ROOT/examples/$dir" && rm -rf out && PAGES_BASE_PATH="$BASE$sub" pnpm build >/dev/null)
  mkdir -p "$OUT$sub"
  cp -r "$ROOT/examples/$dir/out/." "$OUT$sub/"
  echo "built $dir -> $BASE$sub/"
}

build travel ""
build car-rental /cars
build shop /shop
build watch /watch
build crypto /crypto
build ember /ember
touch "$OUT/.nojekyll"

# One sitemap index for all demos — submit this URL in Google Search Console.
SITE="https://ssassam.github.io$BASE"
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for sub in "" /cars /shop /watch /crypto /ember; do
    echo "  <sitemap><loc>$SITE$sub/sitemap.xml</loc></sitemap>"
  done
  echo '</sitemapindex>'
} > "$OUT/sitemap-index.xml"
echo "wrote sitemap-index.xml"
