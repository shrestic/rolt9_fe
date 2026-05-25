import { config } from "@/settings/config";

/**
 * Auth is pinned to a single hostname. The Discord OAuth callback sets the
 * `rolt9_session` cookie for the API's host (and Discord's registered
 * `redirect_uri` uses that same host). Browsers scope cookies per-host and
 * never share them between `localhost`, `127.0.0.1`, and LAN IPs — so opening
 * the dashboard on a different host than the API means the session cookie is
 * never sent, every `/me` returns 401, and you're bounced into an endless
 * Discord login loop.
 *
 * To stay logged in, the app must be served on the same hostname as the API.
 * These helpers detect that host and (in dev) redirect to it.
 */

/** The hostname the API is served on, e.g. "localhost". Null if undeterminable. */
export const apiHostname = (apiBaseUrl = config.apiBaseUrl): string | null => {
	try {
		return new URL(apiBaseUrl).hostname;
	} catch {
		return null;
	}
};

/**
 * If `loc` is on a different host than the API, returns the same URL rewritten
 * to the canonical host (port, path, query, and hash preserved). Returns null
 * when already on the canonical host or when it can't be determined.
 */
export const canonicalHostRedirect = (
	loc: Pick<Location, "hostname" | "href">,
	canonicalHost = apiHostname()
): string | null => {
	if (!canonicalHost || loc.hostname === canonicalHost) return null;
	const url = new URL(loc.href);
	url.hostname = canonicalHost;
	return url.toString();
};
