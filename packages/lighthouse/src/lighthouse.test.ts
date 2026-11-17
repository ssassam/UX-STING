import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ launch: vi.fn(), audit: vi.fn(), kill: vi.fn() }));
vi.mock("chrome-launcher", () => ({ launch: mocks.launch }));
vi.mock("lighthouse", () => ({ default: mocks.audit }));
import { runLighthouse } from "./index.js";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.launch.mockResolvedValue({ port: 9222, kill: mocks.kill });
  mocks.audit.mockResolvedValue({
    lhr: {
      finalDisplayedUrl: "https://example.com/",
      categories: {
        performance: { score: 0.99 },
        accessibility: { score: 1 },
        "best-practices": { score: 0.98 },
        seo: { score: 0.97 },
      },
    },
    report: "<html>report</html>",
  });
});
describe("Lighthouse runner", () => {
  it("measures all categories and closes Chrome", async () => {
    const report = await runLighthouse("https://example.com", { formFactor: "desktop" });
    expect(report.passed).toBe(true);
    expect(report.scores.performance).toBe(99);
    expect(mocks.kill).toHaveBeenCalledOnce();
    expect(mocks.audit).toHaveBeenCalledWith(
      "https://example.com/",
      expect.objectContaining({ formFactor: "desktop", port: 9222 }),
    );
  });
  it("fails gates with unavailable scores", async () => {
    mocks.audit.mockResolvedValue({
      lhr: { finalDisplayedUrl: "https://example.com", categories: {} },
      report: "",
    });
    const report = await runLighthouse("https://example.com");
    expect(report.passed).toBe(false);
    expect(report.failures).toHaveLength(4);
  });
  it("closes Chrome when auditing throws", async () => {
    mocks.audit.mockRejectedValue(new Error("navigation failed"));
    await expect(runLighthouse("https://example.com")).rejects.toThrow("navigation failed");
    expect(mocks.kill).toHaveBeenCalledOnce();
  });
  it("validates targets and thresholds before launching Chrome", async () => {
    await expect(runLighthouse("file:///etc/passwd")).rejects.toThrow("HTTP(S)");
    await expect(
      runLighthouse("https://example.com", { thresholds: { performance: 101 } }),
    ).rejects.toThrow("Thresholds");
    expect(mocks.launch).not.toHaveBeenCalled();
  });
});
