import type { PageBlocksBlock } from "../../emdash-env";
import { leadingHeroImage } from "./marketing-blocks";

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

/**
 * The image of the hero a page opens with, whichever way the page is
 * built: a leading marketing_hero in its blocks field, or (pages not yet
 * moved to blocks) a leading bravada.hero in its rich text.
 */
export function pageHeroImage(
	data: { blocks?: readonly PageBlocksBlock[] | null; content?: unknown } | null | undefined,
): string | undefined {
	if (data?.blocks?.length) return leadingHeroImage(data.blocks);
	return heroSlideImage(data?.content);
}

/** Whether a page opens with a hero, so the header floats over it. */
export function opensWithHero(
	data: { blocks?: readonly PageBlocksBlock[] | null; content?: unknown } | null | undefined,
): boolean {
	if (data?.blocks?.length) return data.blocks[0]._type === "marketing_hero";
	const first = Array.isArray(data?.content) ? (data.content[0] as { _type?: string }) : undefined;
	return first?._type === "bravada.hero";
}
