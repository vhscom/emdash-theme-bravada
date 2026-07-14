import { defineMiddleware } from "astro:middleware";

/**
 * Opt public pages into route caching wherever a cache provider is
 * configured (the Cloudflare deploy uses the Workers Cache API; the
 * Node build has no provider, so this is a no-op there).
 *
 * Pages already tag themselves via Astro.cache.set(cacheHint), so
 * content edits purge exactly the affected pages. The TTL guards
 * changes the tags can't see (site settings, theme toggles); SWR keeps
 * responses instant while revalidating in the background.
 */
export const onRequest = defineMiddleware((context, next) => {
	const { cache, request, url } = context;
	if (
		cache?.enabled &&
		request.method === "GET" &&
		!url.pathname.startsWith("/_emdash") &&
		!url.pathname.startsWith("/search")
	) {
		cache.set({ maxAge: 300, swr: 3600 });
	}
	return next();
});
