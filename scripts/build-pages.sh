#!/usr/bin/env bash
# Builds every demo as a static export and assembles one GitHub Pages site:
#   /<repo>/          Wayfare travel
#   /<repo>/cars/     Drivo car rental
#   /<repo>/shop/     Maison Nord shop
#   /<repo>/watch/    Pulse One product landing page
#   /<repo>/crypto/   Chainlens crypto analytics
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
touch "$OUT/.nojekyll"
