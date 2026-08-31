import { defineMiddleware } from "astro:middleware";

/**
 * Two request-level concerns: the canonical URL form, and a browser cache
 * policy for HTML.
 *
 * Canonical URL form: no trailing slash.
 *
 * Without this, /posts/ and /posts both answer 200 with the same page,
 * each pointing its canonical at itself. Astro's `trailingSlash: "never"`
 * dedupes them too, but it answers 404 and it runs before middleware, so
 * nothing can soften it — and that would break every inbound link written
 * the WordPress way, since WordPress permalinks end in a slash by default.
 * WordPress redirects those instead (redirect_canonical), so we do the
 * same: one 301 to the slashless URL, query string intact. The config
 * option is deliberately left unset.
 *
 * EmDash's own routes are left alone; the admin owns its URL shapes.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const { cache } = context;
	const { pathname, search } = context.url;

	if (
		pathname !== "/" &&
		pathname.endsWith("/") &&
		!pathname.startsWith("/_emdash/")
	) {
		return context.redirect(`${pathname.slice(0, -1)}${search}`, 301);
	}

	const response = await next();

	// Keep non-200s out of the cache. A 404 is the one answer that becomes
	// wrong the moment that address is published, and it carries no tag for a
	// publish to purge.
	//
	// Best-effort, and worth knowing why: HTML streams, so a component's
	// frontmatter can still run after this does. SiteFooter sets a cacheHint
	// on every page, and AstroCache.set() with an object clears a previous
	// set(false) — so an opt-out here can be undone by a component that has
	// not rendered yet. It holds for error pages in practice; a route that
	// MUST stay out uses a maxAge-0 route rule instead, which a cacheHint
	// cannot overwrite because hints carry tags and never maxAge. /search
	// does exactly that.
	if (cache?.enabled && response.status !== 200) {
		cache.set(false);
	}

	// State a browser cache policy on public HTML. Without one the host
	// decides: on Cloudflare the zone's Browser Cache TTL is stamped onto
	// every page, which on this demo is four hours — so a reader who has been
	// to a page keeps the old copy for four hours after an edit, and no purge
	// reaches a browser. That is the layer that CANNOT be cleared holding
	// content longer than the layer that can (the route cache, at five
	// minutes). Anything with a policy of its own, or that sets a cookie, is
	// left alone.
	//
	// The header alone is not enough on Cloudflare: the zone serves whichever
	// of its Browser Cache TTL and this value is HIGHER, so the setting must
	// also be "Respect Existing Headers" or 300 is silently rewritten to
	// 14400 on the way out. It shows only on cached responses, which is what
	// makes it look like it is working.
	//
	// 404s get a shorter policy of their own. They are the one response that
	// becomes wrong the moment that slug is published, and nothing purges a
	// browser.
	if (
		!pathname.startsWith("/_emdash") &&
		!response.headers.has("cache-control") &&
		!response.headers.has("set-cookie") &&
		(response.headers.get("content-type") ?? "").includes("text/html")
	) {
		if (response.status === 200) {
			response.headers.set("Cache-Control", "public, max-age=300, must-revalidate");
		} else if (response.status === 404) {
			response.headers.set("Cache-Control", "public, max-age=60, must-revalidate");
		}
	}

	return response;
});
