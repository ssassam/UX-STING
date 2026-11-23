# kariddi

One binary that crawls a web application and scans everything it finds.

- **Crawl engine:** [katana](https://github.com/projectdiscovery/katana) (ProjectDiscovery), used as a Go library — HTTP crawling, JavaScript endpoint extraction, form extraction, technology detection, headless and hybrid browser modes, scope control and rate limiting.
- **Detection engine:** [cariddi](https://github.com/edoardottt/cariddi) (edoardottt), used as a Go library — its rules for secrets, juicy parameters, juicy file types, error messages and useful information run over every URL and response body katana returns.
- **On top:** katana's own secret detector and API endpoint classifier, robots.txt / sitemap.xml discovery, de-duplicated findings with severities, JSON Lines output, and a self-contained HTML report.

> Only scan systems you own or have written permission to test. kariddi sends real requests to the target and stays inside the target's root domain by default.

This is a standalone Go module. It does not depend on, and is not part of, the UX-STING packages.

## Install

Requires Go 1.26 or newer (older Go toolchains download it automatically).

```bash
cd tools/kariddi
go build -o kariddi .
```

Or without cloning:

```bash
go install github.com/ssassam/UX-STING/tools/kariddi@latest
```

The browser modes (`-hl`, `-hh`) need Chrome or Chromium.

## Use

```bash
# Crawl and scan one target, write a report
kariddi -u https://example.com -o out

# Several targets from a file or stdin
kariddi -l targets.txt -o out
cat targets.txt | kariddi -silent

# Stay on the exact host, go deeper, be gentle
kariddi -u https://app.example.com -fs fqdn -d 5 -rl 20 -c 5

# JavaScript-heavy app: render pages in a browser too
kariddi -u https://app.example.com -hh -xhr -o out

# Authenticated crawl
kariddi -u https://app.example.com -H 'Cookie: session=...' -cos 'logout'

# CI: machine-readable output, fail the job on a high-severity finding
kariddi -u https://staging.example.com -json -redact -fail-on high > findings.jsonl
```

`kariddi -h` lists every flag. The main ones:

| Flag                  | What it does                                                                   | Default       |
| --------------------- | ------------------------------------------------------------------------------ | ------------- |
| `-u`, `-l`            | Targets (repeatable / file). stdin is read when neither is given               |               |
| `-d`                  | Crawl depth                                                                    | `3`           |
| `-jc`, `-jsl`         | Extract endpoints from JavaScript (regex / jsluice)                            | on / off      |
| `-kf`, `-kf-max`      | Seed the crawl from robots.txt and sitemap.xml                                 | `all`, `50`   |
| `-fx`, `-aff`         | Extract forms / fill and submit them (`-aff` sends data to the target)         | on / off      |
| `-hl`, `-hh`, `-xhr`  | Headless browser crawl / hybrid crawl / record XHR requests                    | off           |
| `-fs`, `-cs`, `-cos`  | Scope: `rdn`, `fqdn` or `dn`; in-scope and out-of-scope URL regexes            | `rdn`         |
| `-c`, `-p`, `-rl`     | Fetchers per target, targets in parallel, requests per second                  | `10, 5, 100`  |
| `-H`, `-proxy`        | Extra request headers, HTTP/SOCKS5 proxy                                       |               |
| `-scan`               | cariddi detectors: `secrets,endpoints,errors,info,ext`, `all`, `none`          | `all`         |
| `-ext`                | Juicy file level, 1 (juiciest only) to 7 (every known type)                    | `2`           |
| `-sf`, `-pf`          | Your own secret regexes / parameter names (replace the built-in lists)         |               |
| `-ks`, `-ke`, `-pt`   | katana's secret detector, API endpoint classifier, page-type classifier        | on / on / off |
| `-o`, `-sr`           | Output directory / also store raw responses                                    |               |
| `-json`, `-silent`    | JSON Lines on stdout / findings only                                           |               |
| `-redact`             | Mask secret values everywhere they are printed or written                      | off           |
| `-fail-on`            | Exit with code 2 if a finding is at least `info`, `low`, `medium` or `high`    |               |

Bool flags that default to on are turned off with `=false`, for example `-jc=false`.

## Output

Terminal output is one line per URL and per finding:

```
[200] GET https://example.com/js/app.js
[high] [secret] AWS Access Key: AKIA…  ← https://example.com/js/app.js
[medium] [endpoint] Juicy parameter: redirect  ← https://example.com/search?q=1&redirect=/home
[high] [extension] .env file: env  ← https://example.com/.env
```

With `-o out` you also get:

| File             | Contents                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `urls.txt`       | Every discovered URL, one per line                                    |
| `findings.jsonl` | One finding per line, most severe first                               |
| `report.json`    | Everything: stats, findings, forms, technologies, URLs                |
| `report.html`    | The same as a single page you can open or share (no external assets)  |
| `responses/`     | Raw HTTP responses, with `-sr`                                        |

Report files are written with owner-only permissions because they can contain live secrets. Use `-redact` before sharing one.

Finding types: `secret`, `endpoint` (juicy parameter in a query string or form), `extension` (juicy file), `error` (leaked error message), `info` (emails, IPs, HTML comments) from cariddi; `secret` and `api` (REST / GraphQL / SOAP / XHR endpoint) from katana. The `engine` field says which one reported it. katana's secret detector reports the rule that matched but not the matched text.

Exit codes: `0` success, `1` crawl or write error, `2` the `-fail-on` threshold was reached, `64` bad usage.

## Things to know

- **A run always lasts at least `-timeout` seconds.** katana ends a crawl when its queue has been idle for that long (10 s by default). Lower `-timeout` for quick local checks.
- **`-hh` gives the scanners the most to read.** The full headless mode (`-hl`) is best at discovering URLs in JavaScript-heavy apps, but katana returns fewer response bodies in that mode, so fewer secrets are found. The default HTTP mode and `-hh` return the body of every fetched page.
- **robots.txt and sitemap.xml are read by kariddi itself.** katana v1.8.0 fetches them but its scope check then drops the URLs. kariddi reads the two files, keeps URLs on the target host and crawls the ones the main crawl did not reach.
- **Regex rules produce false positives.** Treat findings as leads to verify, not as confirmed issues. cariddi's `info` rules in particular are broad; use `-scan secrets,endpoints,errors,ext` to leave them out.
- **Nothing is sent to third parties.** kariddi never validates a found secret against its provider and makes no update checks.

## How it fits together

```
targets ──▶ katana engine (standard | hybrid | headless)
                │  every request/response
                ▼
          scan workers ──▶ cariddi rules on URL, form fields and body
                │          + katana knowledge base (secrets, API endpoints)
                ▼
            collector ──▶ terminal / JSON Lines, urls.txt, findings.jsonl,
                          report.json, report.html
```

| Path                  | Role                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `main.go`             | Flags, wiring, terminal output                                   |
| `internal/engine`     | katana as a library; robots.txt / sitemap.xml seeding            |
| `internal/scan`       | cariddi's rule sets applied to URLs, parameters and bodies       |
| `internal/report`     | De-duplication, stats, JSON and HTML reports                     |

## Develop

```bash
go vet ./...
go test -race ./...        # crawls a local test server, about 15 s
go test -short ./...       # unit tests only
```

Upgrading an engine is a dependency bump: `go get github.com/projectdiscovery/katana@latest` or `go get github.com/edoardottt/cariddi@latest`, then `go mod tidy` and run the tests. New upstream rules are picked up automatically.

## License

kariddi links cariddi, which is GPL-3.0, so kariddi is distributed under the **GNU General Public License v3.0 or later** (see [LICENSE](./LICENSE)). This applies to `tools/kariddi` only; the rest of the UX-STING repository stays MIT. katana is MIT licensed.

Credit for the engines goes to their authors: [edoardottt](https://github.com/edoardottt) for cariddi and [ProjectDiscovery](https://projectdiscovery.io) for katana.
