import { dim, log } from "./log.js";

/**
 * Browser-backed commands live in their own packages so `ux-sting add` stays
 * dependency-free. They load on demand; when missing, the user gets the one
 * install command they need.
 */
export async function runPlugin(
  pkg: string,
  load: () => Promise<{ run: (argv: string[]) => Promise<number> }>,
  argv: string[],
): Promise<number> {
  let plugin: Awaited<ReturnType<typeof load>>;
  try {
    plugin = await load();
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "ERR_MODULE_NOT_FOUND" || code === "MODULE_NOT_FOUND") {
      log.error(`This command needs ${pkg}.`);
      log.info(dim(`Install it with: npm i -D ${pkg}  (then: npx playwright install chromium)`));
      return 1;
    }
    throw error;
  }
  return plugin.run(argv);
}
