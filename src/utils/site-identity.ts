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
 * One separator everywhere: Base.astro's fallback title joins with this,
 * so getSeoMeta call sites must pass it as `titleSeparator` instead of
 * accepting the library default " | ".
 */
export const TITLE_SEPARATOR = " — ";

const DEFAULT_SITE_TITLE = "My Blog";
const DEFAULT_SITE_TAGLINE = "Thoughts, stories, and ideas.";

export function resolveBlogSiteIdentity(settings?: BlogSiteIdentitySettings) {
	return {
		siteTitle: settings?.title ?? DEFAULT_SITE_TITLE,
		siteTagline: settings?.tagline ?? DEFAULT_SITE_TAGLINE,
		siteLogo: settings?.logo?.url ? settings.logo : null,
	};
}
