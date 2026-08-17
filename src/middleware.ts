import { defineMiddleware } from "astro:middleware";

/**
 * Canonical URL form: no trailing slash.
 *
 * `trailingSlash: "never"` in astro.config.mjs states the rule — it stops
 * /posts/ and /posts from both answering 200 with the same page under two
 * self-canonical URLs — but Astro enforces it with a 404, which would
 * break every inbound link written the WordPress way (WordPress's default
 * permalinks end in a slash). WordPress redirects those instead
 * (redirect_canonical), so we do too: one 301 to the slashless URL, query
 * string intact.
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
