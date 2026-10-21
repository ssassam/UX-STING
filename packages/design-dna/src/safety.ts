/**
 * Target checks for anything that fetches or renders a user-supplied URL.
 * Call `checkTargetUrl()` before navigating, then check every resolved IP
 * with `isPrivateAddress()` (DNS rebinding) and re-check each redirect and
 * subrequest. Local and private hosts are refused unless the operator
 * allowlists an exact `host:port` for a dev server they control.
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata",
  "instance-data",
  "169.254.169.254",
  "fd00:ec2::254",
]);

/** True for loopback, private, link-local, CGNAT, multicast, reserved and unspecified addresses. */
export function isPrivateAddress(address: string): boolean {
  const ip = address.replace(/^\[|\]$/g, "").toLowerCase();
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip.replace(/^::ffff:/, ""));
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  if (ip.includes(":")) {
    return (
      ip === "::" ||
      ip === "::1" ||
      /^fe[89ab]/.test(ip) ||
      /^f[cd]/.test(ip) ||
      /^ff/.test(ip) ||
      /^::ffff:/.test(ip) ||
      /^64:ff9b:/.test(ip) ||
      /^2001:db8:/.test(ip)
    );
  }
  return false;
}

export interface TargetCheck {
  ok: boolean;
  reason?: string;
  /** Allowed only because of an explicit allowlist entry. */
  allowlisted?: boolean;
  url?: URL;
}

export function checkTargetUrl(input: string, { allowHosts = [] as string[] } = {}): TargetCheck {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { ok: false, reason: "Not a valid absolute URL." };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:")
    return { ok: false, reason: `Scheme ${url.protocol} is not allowed; use http or https.` };
  if (url.username || url.password)
    return { ok: false, reason: "URLs with credentials are refused." };
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const hostPort = `${host}:${url.port || (url.protocol === "https:" ? "443" : "80")}`;
  const listed = allowHosts.map((h) => h.toLowerCase()).includes(hostPort);
  const metadata =
    host === "169.254.169.254" || host.startsWith("metadata") || host === "fd00:ec2::254";
  if (metadata) return { ok: false, reason: "Cloud metadata endpoints are always refused." };
  const local =
    BLOCKED_HOSTS.has(host) ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    isPrivateAddress(host);
  if (local && !listed)
    return {
      ok: false,
      reason: `${host} is a local or private host. Allowlist "${hostPort}" to audit your own dev server.`,
    };
  return { ok: true, url, ...(listed ? { allowlisted: true } : {}) };
}
