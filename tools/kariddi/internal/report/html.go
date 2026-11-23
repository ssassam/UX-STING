package report

import (
	"encoding/json"
	"html/template"
	"io"
	"sort"
	"strings"
)

type htmlCount struct {
	Label string
	Count int
}

type htmlData struct {
	*Report
	Severities []htmlCount
	Types      []htmlCount
	Statuses   []htmlCount
	TechHosts  []string
}

func detailString(d map[string]any) string {
	if len(d) == 0 {
		return ""
	}

	keys := make([]string, 0, len(d))
	for k := range d {
		keys = append(keys, k)
	}

	sort.Strings(keys)

	parts := make([]string, 0, len(keys))

	for _, k := range keys {
		var v string

		switch t := d[k].(type) {
		case string:
			v = t
		case []string:
			v = strings.Join(t, ", ")
		default:
			b, err := json.Marshal(t)
			if err != nil {
				continue
			}

			v = string(b)
		}

		parts = append(parts, k+": "+v)
	}

	return strings.Join(parts, " · ")
}

func counts(m map[string]int, order []string) []htmlCount {
	var out []htmlCount

	seen := map[string]bool{}

	for _, k := range order {
		if n, ok := m[k]; ok {
			out = append(out, htmlCount{k, n})
			seen[k] = true
		}
	}

	var rest []string

	for k := range m {
		if !seen[k] {
			rest = append(rest, k)
		}
	}

	sort.Strings(rest)

	for _, k := range rest {
		out = append(out, htmlCount{k, m[k]})
	}

	return out
}

// WriteHTML renders the report as one self-contained HTML page (no external
// assets, no scripts loaded from the network).
func (r *Report) WriteHTML(w io.Writer) error {
	data := htmlData{
		Report:     r,
		Severities: counts(r.Stats.BySeverity, []string{"critical", "high", "medium", "low", "info"}),
		Types:      counts(r.Stats.ByType, []string{"secret", "endpoint", "extension", "error", "api", "info"}),
		Statuses:   counts(r.Stats.ByStatus, nil),
	}

	for host := range r.Technologies {
		data.TechHosts = append(data.TechHosts, host)
	}

	sort.Strings(data.TechHosts)

	return htmlTemplate.Execute(w, data)
}

var htmlTemplate = template.Must(template.New("report").Funcs(template.FuncMap{
	"detail": detailString,
	"join":   strings.Join,
}).Parse(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>kariddi report</title>
<style>
:root {
  --bg: #f6f7f9; --panel: #ffffff; --ink: #14171c; --muted: #5d6673; --line: #dfe3e8;
  --accent: #0b5cad; --critical: #8f1239; --high: #b42318; --medium: #9a5b00; --low: #1f6f43; --info: #46536a;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1216; --panel: #171b21; --ink: #e8ebf0; --muted: #9aa4b2; --line: #2a313b;
    --accent: #7ab8ff; --critical: #ff8fb1; --high: #ff8a80; --medium: #f5b955; --low: #6fd39a; --info: #a9b6cc;
  }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink);
  font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
main { max-width: 1200px; margin: 0 auto; padding: 24px 16px 64px; }
h1 { font-size: 24px; margin: 0 0 4px; }
h2 { font-size: 17px; margin: 32px 0 10px; }
p.meta { color: var(--muted); margin: 0 0 16px; overflow-wrap: anywhere; }
.warn { border: 1px solid var(--medium); color: var(--medium); border-radius: 8px; padding: 8px 12px; margin: 0 0 16px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
.card b { display: block; font-size: 24px; font-variant-numeric: tabular-nums; }
.card span { color: var(--muted); font-size: 13px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 0; }
.chip { border: 1px solid var(--line); background: var(--panel); border-radius: 999px; padding: 2px 10px; font-size: 13px; }
.sev { font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: .04em; white-space: nowrap; }
.sev-critical { color: var(--critical); } .sev-high { color: var(--high); } .sev-medium { color: var(--medium); }
.sev-low { color: var(--low); } .sev-info { color: var(--info); }
input[type=search] { width: 100%; max-width: 420px; padding: 8px 10px; border-radius: 8px;
  border: 1px solid var(--line); background: var(--panel); color: var(--ink); font: inherit; }
.scroll { overflow-x: auto; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; margin-top: 10px; }
table { border-collapse: collapse; width: 100%; font-size: 14px; }
th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); white-space: nowrap; }
tr:last-child td { border-bottom: 0; }
td.wrap { overflow-wrap: anywhere; min-width: 220px; }
code { font: 13px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
a { color: var(--accent); }
small { color: var(--muted); }
.empty { color: var(--muted); padding: 14px; }
</style>
</head>
<body>
<main>
<h1>kariddi report</h1>
<p class="meta">{{.Tool}} {{.Version}} · {{.Started.Format "2006-01-02 15:04:05 MST"}} · ran {{.Duration}} · targets: {{join .Targets ", "}}</p>
{{if .Interrupted}}<p class="warn">The run was interrupted, so this report is partial.</p>{{end}}

<div class="cards">
  <div class="card"><b>{{.Stats.URLs}}</b><span>URLs discovered</span></div>
  <div class="card"><b>{{.Stats.Fetched}}</b><span>responses fetched</span></div>
  <div class="card"><b>{{.Stats.Findings}}</b><span>findings</span></div>
  <div class="card"><b>{{.Stats.Forms}}</b><span>forms</span></div>
  {{range .Severities}}<div class="card"><b class="sev-{{.Label}}">{{.Count}}</b><span>{{.Label}} severity</span></div>{{end}}
</div>
<div class="chips">
  {{range .Types}}<span class="chip">{{.Label}}: {{.Count}}</span>{{end}}
  {{range .Statuses}}<span class="chip">HTTP {{.Label}}: {{.Count}}</span>{{end}}
</div>

<h2>Findings</h2>
{{if .Findings}}
<input type="search" id="f-q" placeholder="Filter findings…" aria-label="Filter findings" data-table="f-t">
<div class="scroll"><table id="f-t">
<thead><tr><th>Severity</th><th>Type</th><th>Finding</th><th>Match</th><th>URL</th><th>Engine</th></tr></thead>
<tbody>
{{range .Findings}}<tr>
  <td><span class="sev sev-{{.Severity}}">{{.Severity}}</span></td>
  <td>{{.Type}}</td>
  <td class="wrap">{{.Name}}{{with detail .Detail}}<br><small>{{.}}</small>{{end}}</td>
  <td class="wrap"><code>{{.Match}}</code></td>
  <td class="wrap"><code>{{.URL}}</code></td>
  <td>{{.Engine}}</td>
</tr>{{end}}
</tbody></table></div>
{{else}}<div class="scroll"><div class="empty">No findings.</div></div>{{end}}

{{if .TechHosts}}
<h2>Technologies</h2>
<div class="scroll"><table>
<thead><tr><th>Host</th><th>Detected</th></tr></thead>
<tbody>{{range .TechHosts}}<tr><td><code>{{.}}</code></td><td class="wrap">{{join (index $.Technologies .) ", "}}</td></tr>{{end}}</tbody>
</table></div>
{{end}}

{{if .Forms}}
<h2>Forms</h2>
<div class="scroll"><table>
<thead><tr><th>Method</th><th>Action</th><th>Parameters</th><th>Found on</th></tr></thead>
<tbody>{{range .Forms}}<tr>
  <td>{{.Method}}</td><td class="wrap"><code>{{.Action}}</code></td>
  <td class="wrap">{{join .Parameters ", "}}</td><td class="wrap"><code>{{.Page}}</code></td>
</tr>{{end}}</tbody>
</table></div>
{{end}}

<h2>URLs</h2>
{{if .URLs}}
<input type="search" id="u-q" placeholder="Filter URLs…" aria-label="Filter URLs" data-table="u-t">
<div class="scroll"><table id="u-t">
<thead><tr><th>Status</th><th>Method</th><th>URL</th><th>Type</th><th>Size</th><th>Found via</th></tr></thead>
<tbody>
{{range .URLs}}<tr>
  <td>{{if .Status}}{{.Status}}{{else}}–{{end}}</td>
  <td>{{.Method}}</td>
  <td class="wrap"><code>{{.URL}}</code>{{if .PageType}}<br><small>page type: {{.PageType}}</small>{{end}}</td>
  <td>{{.ContentType}}</td>
  <td>{{if .Length}}{{.Length}}{{end}}</td>
  <td>{{.Tag}}{{if .Attribute}}[{{.Attribute}}]{{end}}</td>
</tr>{{end}}
</tbody></table></div>
{{else}}<div class="scroll"><div class="empty">No URLs discovered.</div></div>{{end}}
</main>
<script>
document.querySelectorAll('input[type=search]').forEach(function (input) {
  var rows = document.querySelectorAll('#' + input.dataset.table + ' tbody tr');
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    rows.forEach(function (row) {
      row.hidden = q !== '' && row.textContent.toLowerCase().indexOf(q) === -1;
    });
  });
});
</script>
</body>
</html>
`))
