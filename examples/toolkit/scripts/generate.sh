#!/usr/bin/env bash
# Regenerates the real tool output shown on the toolkit site. Every number,
# screenshot and token on the site comes from running these commands.
# Needs: pnpm build, a Playwright Chromium, network for the image search.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CLI="node $ROOT/packages/cli/dist/index.js"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"; [ -n "${SERVER:-}" ] && kill "$SERVER" 2>/dev/null || true' EXIT
DATA="$HERE/data"
PUB="$HERE/public"
mkdir -p "$DATA" "$PUB/qa" "$PUB/images"

# 1. Browser QA on the two planted-problem fixtures and on Ember.
for name in broken slop; do
  $CLI qa "$ROOT/packages/qa/src/__fixtures__/$name.html" --out "$TMP/qa-$name" --json > "$DATA/qa-$name.json" || true
done
# The planted-bugs page is blank above the fold (one of its bugs), so show the full page.
cp "$TMP/qa-broken/shots/375-full.png" "$PUB/qa/broken-full.png"
cp "$TMP/qa-slop/shots/1440.png" "$PUB/qa/slop-1440.png"
(cd "$ROOT/examples/ember" && rm -rf out && PAGES_BASE_PATH= pnpm build >/dev/null)
$CLI qa "$ROOT/examples/ember/out" --out "$TMP/qa-ember" --json > "$DATA/qa-ember.json" || true
cp "$TMP/qa-ember/shots/1440.png" "$PUB/qa/ember-1440.png"

# 2. Extraction → DTCG → theme → DNA, against the Ember export served locally.
python3 -m http.server 47811 --bind 127.0.0.1 --directory "$ROOT/examples/ember/out" >/dev/null 2>&1 &
SERVER=$!
sleep 1
$CLI extract http://127.0.0.1:47811/ --out "$TMP/extract" --dark
cp "$TMP/extract/tokens.json" "$DATA/ember.tokens.json"
$CLI theme import "$TMP/extract/tokens.json" --name ember-imported --out "$TMP/theme"
cp "$TMP/theme/ember-imported.theme.json" "$DATA/ember.theme.json"
cp "$TMP/theme/ember-imported.css" "$DATA/ember.theme.css"
$CLI dna "$TMP/extract/tokens.json" --json > "$DATA/ember.dna.json"
# Role mapping and AA adjustments, as the site shows them.
node --input-type=module -e '
import { readFileSync, writeFileSync } from "node:fs";
const { dtcgToTheme } = await import(process.argv[1]);
const r = dtcgToTheme(JSON.parse(readFileSync(process.argv[2], "utf8")), { name: "ember-imported" });
writeFileSync(process.argv[3], JSON.stringify({ scheme: r.scheme, mapping: r.mapping, adjustments: r.adjustments, missing: r.missing }, null, 2) + "\n");
' "$ROOT/packages/extract/dist/index.js" "$TMP/extract/tokens.json" "$DATA/ember.import.json"

# 3. Public-domain images from The Met with credits (one query per section).
rm -rf "$PUB/images" && mkdir -p "$PUB/images" && rm -f "$DATA/credits.json"
$CLI images "drawing instruments" --source met --license cc0 --count 6 --json > "$DATA/images-search.json"
pick() { # <query> <result number>
  $CLI images "$1" --source met --license cc0 --count 6 --download "$2" --dir "$PUB/images" --credits "$DATA/credits.json"
}
pick "drawing instruments" 1
pick "proportional dividers" 1
pick "architectural elevation drawing" 2
# Resize for the web (originals are 2–3 MB museum scans).
SHARP="$(ls -d "$ROOT"/node_modules/.pnpm/sharp@*/node_modules/sharp | head -1)"
node -e '
const sharp = require(process.argv[1]); const fs = require("fs"); const dir = process.argv[2];
(async () => { for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"))) {
  const buf = await sharp(dir + "/" + f).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  fs.writeFileSync(dir + "/" + f, buf);
} })();' "$SHARP" "$PUB/images"
# Keep machine paths out of the published data.
sed -i -e "s#$ROOT/##g" -e "s#$TMP/##g" -e "s#http://127.0.0.1:47811/#examples/ember/#g" -e "s#http://127.0.0.1:[0-9]*/#local/#g" "$DATA"/*.json "$DATA"/CREDITS.md
echo "generated into $DATA and $PUB"
