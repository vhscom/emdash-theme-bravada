/**
 * Probe a page's Portable Text content for a leading bravada.hero block
 * and return its slide image. Centralizes the block-shape knowledge the
 * homepage and the post prev/next fallback both rely on.
 */
export function heroSlideImage(content: unknown): string | undefined {
	const first = Array.isArray(content)
		? (content[0] as { _type?: string; image?: unknown } | undefined)
		: undefined;
	return first?._type === "bravada.hero" && typeof first.image === "string"
		? first.image
		: undefined;
}
