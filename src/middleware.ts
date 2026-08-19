import { defineMiddleware } from "astro:middleware";

/**
 * Two request-level concerns, in order.
 *
 * 1. Canonical URL form: no trailing slash. Without this, /posts/ and
 *    /posts both answer 200 with the same page, each pointing its
 *    canonical at itself. Astro's `trailingSlash: "never"` dedupes them
 *    too, but it answers 404 and it runs before middleware, so nothing
 *    can soften it — and that would break every inbound link written the
 *    WordPress way, since WordPress permalinks end in a slash by
 *    default. WordPress redirects those instead (redirect_canonical), so
 *    we do the same: one 301 to the slashless URL, query string intact.
 *    The config option is deliberately left unset. Redirecting first
 *    also keeps redirects out of the route cache.
 *
 * 2. Route caching, wherever a cache provider is configured (the
 *    Cloudflare deploy uses the Workers Cache API; the Node build has no
 *    provider, so this half is a no-op there). Pages already tag
 *    themselves via Astro.cache.set(cacheHint), so content edits purge
 *    exactly the affected pages. The TTL guards changes the tags can't
 *    see (site settings, theme toggles); SWR keeps responses instant
 *    while revalidating in the background.
 *
 * EmDash's own routes are left alone; the admin owns its URL shapes.
 */
export const onRequest = defineMiddleware((context, next) => {
	const { cache, request, url } = context;
	const { pathname, search } = url;

	if (
		pathname !== "/" &&
		pathname.endsWith("/") &&
		!pathname.startsWith("/_emdash/")
	) {
		return context.redirect(`${pathname.slice(0, -1)}${search}`, 301);
	}

	if (
		cache?.enabled &&
		request.method === "GET" &&
		!pathname.startsWith("/_emdash") &&
		!pathname.startsWith("/search")
	) {
		cache.set({ maxAge: 300, swr: 3600 });
	}

	return next();
});
