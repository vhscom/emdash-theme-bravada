/**
 * Marketing blocks → Bravada band props.
 *
 * The Pages `blocks` field stores EmDash marketing blocks (`marketing_*`,
 * plus the theme's own `bravada_*`). Most of them draw with a band that
 * already exists for the Portable Text `bravada.*` types, so instead of
 * a second copy of each band these functions translate a stored block
 * into the props that band takes. Pure and synchronous, so each mapping
 * is unit-tested without rendering anything.
 */
import { sanitizeHref } from "emdash";
import type { PageBlocksBlock } from "../../emdash-env";

type Block<T extends PageBlocksBlock["_type"]> = Extract<PageBlocksBlock, { _type: T }>;
type ImageValue = { src?: string; alt?: string } | null | undefined;

/** The demo's band tints, by the names the block's Tint field offers. */
export const TINTS = {
	warm: "#F9F7F5",
	stone: "#EEEBE9",
	lilac: "#F6F3F6",
	grey: "#EEEEEE",
	mist: "#F8F8F8",
} as const;

export function tintHex(name: string | null | undefined): string | undefined {
	return name && name in TINTS ? TINTS[name as keyof typeof TINTS] : undefined;
}

/** A link or image URL that is safe to render, or undefined. */
export function safeUrl(url: string | null | undefined): string | undefined {
	const trimmed = url?.trim();
	if (!trimmed) return undefined;
	const safe = sanitizeHref(trimmed);
	return safe === "#" && trimmed !== "#" ? undefined : safe;
}

/** Paragraphs from a plain-text field: blank lines separate them. */
export function paragraphs(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
}

/** One entry per non-empty line, for list-shaped text fields. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

function list(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
}

function image(value: ImageValue): { image?: string; imageAlt: string } {
	return { image: safeUrl(value?.src), imageAlt: value?.alt ?? "" };
}

function anchor(id: string | null | undefined): string | undefined {
	return id?.trim() || undefined;
}

function opt<T>(value: T | null | undefined): T | undefined {
	return value ?? undefined;
}

export interface Button {
	label: string;
	url: string;
	style: "primary" | "secondary";
}

/** The primary/secondary button pairs, skipping any without both parts. */
export function ctaButtons(v: {
	primary_cta_label?: string | null;
	primary_cta_url?: string | null;
	secondary_cta_label?: string | null;
	secondary_cta_url?: string | null;
}): Button[] {
	const out: Button[] = [];
	for (const style of ["primary", "secondary"] as const) {
		const label = v[`${style}_cta_label`]?.trim();
		const url = safeUrl(v[`${style}_cta_url`]);
		if (label && url) out.push({ label, url, style });
	}
	return out;
}

export function heroProps(v: Block<"marketing_hero">) {
	return {
		title: v.headline,
		subtitle: opt(v.subheadline),
		...image(v.image),
		buttons: ctaButtons(v),
		effect: opt(v.effect),
		anchorId: anchor(v.anchor_id),
	};
}

export function splitProps(v: Block<"marketing_split">) {
	return {
		title: opt(v.headline),
		paragraphs: paragraphs(v.body),
		...image(v.image),
		imageSide: v.image_first === false ? ("right" as const) : ("left" as const),
		tint: tintHex(v.tint),
		buttons: ctaButtons(v),
		anchorId: anchor(v.anchor_id),
	};
}

export function featuresProps(v: Block<"marketing_features">) {
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		variant: v.variant ?? "light",
		columns: opt(v.columns),
		items: (v.features ?? []).map((f) => ({
			icon: opt(f.icon),
			title: f.title,
			text: opt(f.description),
			url: safeUrl(f.link_url),
		})),
		anchorId: anchor(v.anchor_id),
	};
}

/** Contact options draw as light icon blocks with a visible link. */
export function contactProps(v: Block<"marketing_contact">) {
	const options = v.options ?? [];
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		variant: "light" as const,
		columns: Math.min(Math.max(options.length, 2), 4),
		items: options.map((o) => ({
			icon: opt(o.icon),
			title: o.title,
			text: opt(o.description),
			url: safeUrl(o.link_url),
			linkLabel: o.link_label?.trim() || undefined,
		})),
		anchorId: anchor(v.anchor_id),
	};
}

export function boxesProps(v: Block<"bravada_boxes">) {
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		variant: v.variant ?? "static",
		columns: opt(v.columns),
		accent: opt(v.accent),
		tint: tintHex(v.tint),
		items: (v.items ?? []).map((i) => ({
			...image(i.image),
			title: i.title,
			text: opt(i.description),
			url: safeUrl(i.link_url),
		})),
		anchorId: anchor(v.anchor_id),
	};
}

export function portfolioProps(v: Block<"bravada_portfolio">) {
	const moreUrl = safeUrl(v.more_url);
	const moreLabel = v.more_label?.trim();
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		columns: opt(v.columns),
		items: (v.items ?? []).map((i) => ({
			...image(i.image),
			title: i.title,
			tags: list(i.tags),
			url: safeUrl(i.link_url),
		})),
		more: moreUrl && moreLabel ? { label: moreLabel, url: moreUrl } : undefined,
		anchorId: anchor(v.anchor_id),
	};
}

export function testimonialsProps(v: Block<"marketing_testimonials">) {
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		items: (v.testimonials ?? []).map((t) => {
			const img = image(t.avatar);
			return {
				text: t.quote,
				title: opt(t.author),
				image: img.image,
				imageAlt: img.imageAlt || t.author || "",
			};
		}),
		anchorId: anchor(v.anchor_id),
	};
}

/**
 * The FAQ leads with the ghost section header like its neighbouring bands,
 * so the accordion gets no intro column of its own (that is the About
 * template's layout, sized for a page card).
 */
export function faqProps(v: Block<"marketing_faq">, key: string) {
	return {
		header: { title: opt(v.headline), description: opt(v.subheadline) },
		accordion: {
			items: (v.items ?? []).map((i) => ({ title: i.question, body: i.answer })),
			_key: key,
		},
		anchorId: anchor(v.anchor_id),
	};
}

export function ctaProps(v: Block<"marketing_cta">) {
	return {
		title: v.headline,
		paragraphs: paragraphs(v.body),
		...image(v.image),
		buttons: ctaButtons(v),
		anchorId: anchor(v.anchor_id),
	};
}

export function statsProps(v: Block<"marketing_stats">) {
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		items: (v.stats ?? []).map((s) => ({ value: s.value, label: s.label })),
		tint: tintHex(v.tint),
		anchorId: anchor(v.anchor_id),
	};
}

export function pricingProps(v: Block<"marketing_pricing">) {
	return {
		title: opt(v.headline),
		description: opt(v.subheadline),
		tint: tintHex(v.tint),
		plans: (v.plans ?? []).map((p) => {
			const url = safeUrl(p.cta_url);
			const label = p.cta_label?.trim();
			return {
				name: p.name,
				price: p.price,
				period: p.period?.trim() || undefined,
				description: paragraphs(p.description),
				features: lines(p.features),
				cta: url && label ? { label, url } : undefined,
				highlighted: p.highlighted === true,
				badge: p.badge?.trim() || undefined,
			};
		}),
		anchorId: anchor(v.anchor_id),
	};
}

export function logosProps(v: Block<"marketing_logos">) {
	return {
		title: opt(v.headline),
		tint: tintHex(v.tint),
		items: (v.logos ?? []).map((l) => {
			const img = image(l.logo);
			return { name: l.name, logo: img.image, logoAlt: img.imageAlt || l.name, url: safeUrl(l.link_url) };
		}),
		anchorId: anchor(v.anchor_id),
	};
}

export function textProps(v: Block<"marketing_text">) {
	return {
		title: opt(v.headline),
		body: opt(v.body),
		anchorId: anchor(v.anchor_id),
	};
}

/** The leading hero's image, the page's natural social preview. */
export function leadingHeroImage(blocks: readonly PageBlocksBlock[] | null | undefined): string | undefined {
	const first = blocks?.[0];
	return first?._type === "marketing_hero" ? safeUrl(first.image?.src) : undefined;
}
