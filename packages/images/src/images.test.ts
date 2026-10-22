import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { creditHtml, creditText, creditsMarkdown, toEntry } from "./credits.js";
import { recordCredits, slugify } from "./download.js";
import {
  fromCommons,
  fromMet,
  fromOpenverse,
  normalizeLicense,
  searchImages,
  type ImageResult,
} from "./sources.js";

const openverse = {
  results: [
    {
      id: "a1",
      title: "Harbour at dusk",
      url: "https://live.staticflickr.com/1/a1.jpg",
      creator: "Ana",
      license: "by-sa",
      license_version: "2.0",
      license_url: "https://creativecommons.org/licenses/by-sa/2.0/",
      foreign_landing_url: "https://www.flickr.com/photos/ana/1",
      width: 2000,
      height: 1333,
    },
    { id: "a2", title: "", url: "https://x.example/a2.jpg", creator: null, license: "cc0" },
    { id: "a3", title: "NC photo", url: "https://x.example/a3.jpg", license: "by-nc" },
  ],
};

const commons = {
  query: {
    pages: {
      "2": {
        title: "File:Old mill.jpg",
        index: 2,
        imageinfo: [
          {
            url: "https://upload.wikimedia.org/o.jpg",
            thumburl: "https://upload.wikimedia.org/t.jpg",
            descriptionurl: "https://commons.wikimedia.org/wiki/File:Old_mill.jpg",
            width: 4000,
            height: 3000,
            thumbwidth: 1600,
            thumbheight: 1200,
            mime: "image/jpeg",
            extmetadata: {
              License: { value: "cc-by-4.0" },
              LicenseUrl: { value: "https://creativecommons.org/licenses/by/4.0" },
              Artist: { value: '<a href="//commons.wikimedia.org/wiki/User:Jo">Jo &amp; Co</a>' },
              ObjectName: { value: "Old mill" },
            },
          },
        ],
      },
      "1": {
        title: "File:Logo.png",
        index: 1,
        imageinfo: [
          {
            url: "https://upload.wikimedia.org/l.png",
            descriptionurl: "https://commons.wikimedia.org/wiki/File:Logo.png",
            width: 100,
            height: 100,
            mime: "image/png",
            extmetadata: { License: { value: "fair use" } },
          },
        ],
      },
      "3": {
        title: "File:Clip.webm",
        index: 3,
        imageinfo: [{ url: "x", descriptionurl: "y", width: 1, height: 1, mime: "video/webm" }],
      },
    },
  },
};

describe("licenses", () => {
  it("keeps PD, CC0, BY and BY-SA and drops everything else", () => {
    expect(normalizeLicense("cc0")).toEqual({ code: "cc0", version: null });
    expect(normalizeLicense("pd")).toEqual({ code: "pdm", version: null });
    expect(normalizeLicense("Public domain")).toEqual({ code: "pdm", version: null });
    expect(normalizeLicense("cc-by-sa-3.0")).toEqual({ code: "by-sa", version: "3.0" });
    expect(normalizeLicense("CC BY 4.0")).toEqual({ code: "by", version: "4.0" });
    for (const bad of [
      "cc-by-nc-sa-4.0",
      "by-nd",
      "GFDL",
      "fair use",
      "arr",
      "",
      undefined,
      "unknown",
    ])
      expect(normalizeLicense(bad)).toBeNull();
  });
});

describe("normalisers", () => {
  it("reads Openverse results and drops NC", () => {
    const r = fromOpenverse(openverse);
    expect(r.map((x) => x.id)).toEqual(["openverse:a1", "openverse:a2"]);
    expect(r[0]).toMatchObject({ license: "by-sa", licenseVersion: "2.0", creator: "Ana" });
    expect(r[1]).toMatchObject({ title: "Untitled", license: "cc0", creator: null });
  });
  it("reads Commons pages in search order, strips HTML, skips fair use and video", () => {
    const r = fromCommons(commons);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({
      title: "Old mill",
      creator: "Jo & Co",
      license: "by",
      url: "https://upload.wikimedia.org/t.jpg",
      width: 1600,
    });
  });
  it("keeps only public-domain Met objects with an image, as CC0", () => {
    const r = fromMet([
      {
        objectID: 1,
        isPublicDomain: true,
        primaryImage: "https://images.metmuseum.org/1.jpg",
        title: "Vase",
        objectDate: "ca. 1750",
        artistDisplayName: "",
      },
      { objectID: 2, isPublicDomain: false, primaryImage: "https://images.metmuseum.org/2.jpg" },
      { objectID: 3, isPublicDomain: true, primaryImage: "" },
    ]);
    expect(r).toEqual([
      expect.objectContaining({
        id: "met:1",
        license: "cc0",
        title: "Vase, ca. 1750",
        creator: null,
      }),
    ]);
  });
});

describe("credits", () => {
  const img: ImageResult = fromCommons(commons)[0]!;
  it("formats TASL credits and escapes HTML", () => {
    expect(creditText(img)).toBe("“Old mill” by Jo & Co, CC BY 4.0, via Wikimedia Commons");
    const html = creditHtml(img);
    expect(html).toContain("Jo &amp; Co");
    expect(html).toContain('rel="license"');
    expect(toEntry(img, "old-mill.jpg").attributionRequired).toBe(true);
  });
  it("writes a manifest that merges by id and regenerates CREDITS.md", () => {
    const dir = mkdtempSync(join(tmpdir(), "uximg-"));
    try {
      const manifest = join(dir, "credits.json");
      recordCredits(manifest, [{ result: img, file: join(dir, "old-mill.jpg") }]);
      recordCredits(manifest, [{ result: img, file: join(dir, "old-mill.jpg") }]);
      const saved = JSON.parse(readFileSync(manifest, "utf8"));
      expect(saved).toHaveLength(1);
      expect(saved[0].file).toBe("old-mill.jpg");
      expect(readFileSync(join(dir, "CREDITS.md"), "utf8")).toContain("[CC BY 4.0]");
      expect(creditsMarkdown([toEntry({ ...img, license: "by-sa" }, "a.jpg")])).toContain(
        "CC BY-SA:",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
  it("slugs file names safely", () => {
    expect(slugify("Château d'Eau / 1890")).toBe("chateau-d-eau-1890");
    expect(slugify("***")).toBe("image");
  });
});

describe("searchImages", () => {
  it("combines sources, filters by license and reports failing sources", async () => {
    const fake = (async (url: string) => {
      if (url.includes("openverse")) return new Response(JSON.stringify(openverse));
      if (url.includes("wikimedia")) return new Response(JSON.stringify(commons));
      return new Response("blocked", { status: 403 });
    }) as unknown as typeof fetch;
    const { results, errors } = await searchImages("mill", {
      fetch: fake,
      licenses: ["by", "by-sa"],
    });
    expect(results.map((r) => r.license)).toEqual(["by-sa", "by"]);
    // The Met only has CC0, so it is not even queried here.
    expect(errors).toEqual([]);
    const all = await searchImages("mill", { fetch: fake });
    expect(all.results).toHaveLength(3);
    expect(all.errors).toEqual(["met: collectionapi.metmuseum.org answered 403"]);
  });
});
