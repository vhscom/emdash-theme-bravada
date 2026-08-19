/**
 * Runtime parsers for the products collection's JSON-backed fields.
 *
 * EmDash types `gallery` and `variants` as `unknown` because they are raw
 * JSON with no schema behind them. Casting them straight to a shape is a
 * server-side crash waiting to happen: a variant saved without `options`
 * takes down the whole product page with a 500. These parsers coerce
 * whatever is stored into the shape the template renders, dropping
 * entries that can't be rendered rather than throwing.
 *
 * `reviews` is a repeater, so it arrives typed — but the type describes
 * the schema, not what is in the column. Rows written before the field
 * became a repeater, and rows the editor added but left half-filled
 * (empty strings, null ratings), both still reach us, so parseReviews
 * stays as defensive as the other two.
 */

export interface ProductVariant {
	label: string;
	options: string[];
}

export interface ProductReview {
	author: string;
	rating?: number;
	date?: Date;
	text: string;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

const strings = (v: unknown): string[] =>
	Array.isArray(v) ? v.filter((o): o is string => typeof o === "string") : [];

/**
 * The product's star rating, averaged from the reviews that carry one.
 *
 * This used to be a `rating` field the editor typed by hand, which only
 * stayed truthful as long as whoever added a review remembered to
 * recompute it. Deriving it means the stars, the "(N customer reviews)"
 * link and the aggregateRating in the page's structured data cannot
 * disagree with the reviews listed underneath them.
 *
 * Rounded to two decimals: the demo's own values (4.67, 4.33, 4.75) are
 * thirds and quarters, and an unrounded 4.666666666666667 would read as
 * a bug in both the markup and the tooltip.
 */
export const averageRating = (reviews: ProductReview[]): number | undefined => {
	const rated = reviews.filter((r): r is ProductReview & { rating: number } =>
		typeof r.rating === "number",
	);
	if (rated.length === 0) return undefined;
	return Math.round((rated.reduce((sum, r) => sum + r.rating, 0) / rated.length) * 100) / 100;
};

/** Date-only or full ISO 8601, the two shapes an EmDash datetime round-trips as. */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/;

/**
 * Review dates are ISO-only on purpose. `new Date()` accepts a lot of prose,
 * and it guesses badly: "7th June" is rejected outright but "June 7" silently
 * becomes the year 2001, which would render a plausible-looking wrong date and
 * emit it as `datePublished` in the product's JSON-LD. Anything that isn't an
 * ISO date drops out and the review renders without one.
 */
const parseDate = (v: unknown): Date | undefined => {
	if (typeof v !== "string" || !ISO_DATE_PATTERN.test(v.trim())) return undefined;
	const d = new Date(v.trim());
	return Number.isNaN(d.getTime()) ? undefined : d;
};

/** Image URLs; anything non-string (or empty) is dropped. */
export const parseGallery = (value: unknown): string[] =>
	Array.isArray(value)
		? value.filter((v): v is string => typeof v === "string" && v.trim() !== "")
		: [];

/**
 * Variant rows. A variant needs a label and at least one option to render
 * a usable <select>, so incomplete rows are dropped instead of rendering
 * an empty dropdown.
 */
export const parseVariants = (value: unknown): ProductVariant[] => {
	if (!Array.isArray(value)) return [];
	return value.flatMap((v) => {
		if (!isRecord(v)) return [];
		const label = typeof v.label === "string" ? v.label.trim() : "";
		const options = strings(v.options).filter((o) => o !== "Choose an option");
		return label && options.length > 0 ? [{ label, options }] : [];
	});
};

/**
 * Reviews. The body text is the one field with no sensible fallback, so a
 * review without it is dropped; a missing author degrades to "Anonymous"
 * rather than losing the review. Ratings outside 0–5 are ignored so the
 * star component never renders a broken row.
 */
export const parseReviews = (value: unknown): ProductReview[] => {
	if (!Array.isArray(value)) return [];
	return value.flatMap((r) => {
		if (!isRecord(r)) return [];
		const text = typeof r.text === "string" ? r.text.trim() : "";
		if (!text) return [];
		const rating =
			typeof r.rating === "number" && Number.isFinite(r.rating) && r.rating >= 0 && r.rating <= 5
				? r.rating
				: undefined;
		const date = parseDate(r.date);
		return [
			{
				text,
				author: typeof r.author === "string" && r.author.trim() ? r.author.trim() : "Anonymous",
				...(rating !== undefined && { rating }),
				...(date && { date }),
			},
		];
	});
};
