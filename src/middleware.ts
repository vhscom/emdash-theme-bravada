import { defineMiddleware } from "astro:middleware";

/**
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
export const onRequest = defineMiddleware((context, next) => {
	const { pathname, search } = context.url;

	if (
		pathname !== "/" &&
		pathname.endsWith("/") &&
		!pathname.startsWith("/_emdash/")
	) {
		return context.redirect(`${pathname.slice(0, -1)}${search}`, 301);
	}

	return next();
});
