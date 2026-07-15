/** Resolved media reference from getSiteSettings() */
export interface MediaReference {
	mediaId: string;
	alt?: string;
	url?: string;
}

export interface BlogSiteIdentitySettings {
	title?: string;
	tagline?: string;
	url?: string;
	logo?: MediaReference;
	favicon?: MediaReference;
	seo?: {
		titleSeparator?: string;
	};
}

/**
 * Canonical site origin: the Site URL from EmDash settings when set
 * (trailing slashes stripped), else the request origin. Keeps canonical
 * and OG URLs deterministic behind proxies/previews.
 */
export function resolveSiteOrigin(
	settings: BlogSiteIdentitySettings | undefined,
	fallbackOrigin: string,
) {
	return (
		(typeof settings?.url === "string" && settings.url.replace(/\/+$/, "")) ||
		fallbackOrigin
	);
}

/**
 * One separator everywhere: Base.astro's fallback title and every
 * getSeoMeta call site resolve the separator through this, so the admin
 * setting (Settings → SEO → title separator) wins when set. The pipe
 * default keeps titles compact.
 */
const DEFAULT_TITLE_SEPARATOR = " | ";

export function resolveTitleSeparator(settings?: BlogSiteIdentitySettings) {
	const configured = settings?.seo?.titleSeparator?.trim();
	// Normalise to single surrounding spaces so "|" and " | " behave alike.
	return configured ? ` ${configured} ` : DEFAULT_TITLE_SEPARATOR;
}

const DEFAULT_SITE_TITLE = "My Blog";
const DEFAULT_SITE_TAGLINE = "Thoughts, stories, and ideas.";

export function resolveBlogSiteIdentity(settings?: BlogSiteIdentitySettings) {
	return {
		siteTitle: settings?.title ?? DEFAULT_SITE_TITLE,
		siteTagline: settings?.tagline ?? DEFAULT_SITE_TAGLINE,
		siteLogo: settings?.logo?.url ? settings.logo : null,
	};
}
