import { describe, expect, it } from "vitest";
import { renderCanvas, startCanvas } from "./index.js";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
describe("comparison canvas", () => {
  it("escapes untrusted labels and sandboxes previews", () => {
    const html = renderCanvas([
      { id: "a", title: '<script>alert("bad")</script>', url: "https://example.com" },
    ]);
    expect(html).not.toContain('<script>alert("bad")');
    expect(html).toContain('sandbox="allow-scripts"');
    expect(html).toContain("Made with love by Veltein");
    expect(() => renderCanvas([{ id: "a", title: "X", url: "javascript:alert(1)" }])).toThrow(
      "HTTP(S)",
    );
  });
  it("serves a usable local board and refuses overwrite", async () => {
    const dir = await mkdtemp(join(tmpdir(), "canvas-"));
    const directions = [{ id: "a", title: "A", url: "https://example.com" }];
    const server = await startCanvas(directions, dir);
    try {
      expect(await (await fetch(server.url)).text()).toContain("Compare design directions");
      await expect(startCanvas(directions, dir)).rejects.toThrow();
    } finally {
      await server.close();
      await rm(dir, { recursive: true, force: true });
    }
  });
});
