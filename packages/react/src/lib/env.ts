/** `true` outside production builds. Used only for developer warnings. */
export const isDev = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== "production";

export function devWarn(message: string): void {
  if (isDev) console.warn(`[unified-ui] ${message}`);
}
