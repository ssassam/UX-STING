#!/usr/bin/env bash
# Builds every demo as a static export and assembles one GitHub Pages site,
# served at the root of https://uxsting.veltein.com (CNAME written below):
#   /          Wayfare travel
#   /cars/     Drivo car rental
#   /shop/     Maison Nord shop
#   /watch/    Pulse One product landing page
#   /crypto/   Chainlens crypto analytics
#   /ember/    Ember restaurant reservations
#   /toolkit/  UX-STING toolkit hub (QA, extract, images, taste, motion)
#   /toolkit/motion/demos/  @ux-sting/motion standalone demo pages
# Usage: scripts/build-pages.sh [/base-path]   (default: "" = domain root)
set -euo pipefail
BASE="${1:-}"
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
build toolkit /toolkit
# Standalone motion demos read ../css and ../dist, so ship all three folders.
mkdir -p "$OUT/toolkit/motion"
cp -r "$ROOT/packages/motion/demos" "$ROOT/packages/motion/css" "$ROOT/packages/motion/dist" "$OUT/toolkit/motion/"
touch "$OUT/.nojekyll"
echo "uxsting.veltein.com" > "$OUT/CNAME"

# One sitemap index for all demos — submit this URL in Google Search Console.
SITE="https://uxsting.veltein.com"
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for sub in "" /cars /shop /watch /crypto /ember /toolkit; do
    echo "  <sitemap><loc>$SITE$sub/sitemap.xml</loc></sitemap>"
  done
  echo '</sitemapindex>'
} > "$OUT/sitemap-index.xml"
echo "wrote sitemap-index.xml"
