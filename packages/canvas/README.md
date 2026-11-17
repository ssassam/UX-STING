# @ux-sting/canvas

`renderCanvas(directions)` returns a standalone comparison board. Each direction has `id`, `title`, HTTP(S) `url`, and optional `rationale` and `score`.

`startCanvas(directions, outDir)` writes a new `index.html` without overwriting one and serves the directory on loopback. Returns `{ url, close }`; call `close()` when finished. Preview URLs need to remain reachable independently. Frames are sandboxed, width is selectable and choice stays in the current tab. There is no persistent editing or publishing.
