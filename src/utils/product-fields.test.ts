import { describe, expect, it } from "vitest";
import {
	averageRating,
	parseGallery,
	parseReviews,
	parseVariants,
} from "./product-fields";

describe("parseGallery", () => {
	it("keeps string URLs and drops everything else", () => {
		expect(parseGallery(["/a.jpg", 42, null, "/b.jpg", "  "])).toEqual([
			"/a.jpg",
			"/b.jpg",
		]);
	});

	it("returns an empty array for missing or non-array values", () => {
		expect(parseGallery(undefined)).toEqual([]);
		expect(parseGallery(null)).toEqual([]);
		expect(parseGallery("nope")).toEqual([]);
		expect(parseGallery({ 0: "/a.jpg" })).toEqual([]);
	});
});

describe("parseVariants", () => {
	it("parses well-formed variants", () => {
		expect(parseVariants([{ label: "Size", options: ["S", "M"] }])).toEqual([
			{ label: "Size", options: ["S", "M"] },
		]);
	});

	it("drops a variant missing options rather than throwing", () => {
		// The crash this guards: v.options.filter(...) on an admin-saved
		// variant that never got an options array.
		expect(parseVariants([{ label: "Size" }])).toEqual([]);
		expect(parseVariants([{ label: "Size", options: "S" }])).toEqual([]);
		expect(parseVariants([{ label: "Size", options: [] }])).toEqual([]);
	});

	it("drops a variant with no usable label", () => {
		expect(parseVariants([{ options: ["S"] }])).toEqual([]);
		expect(parseVariants([{ label: "   ", options: ["S"] }])).toEqual([]);
	});

	it("strips the placeholder option the template renders itself", () => {
		expect(
			parseVariants([{ label: "Size", options: ["Choose an option", "S"] }]),
		).toEqual([{ label: "Size", options: ["S"] }]);
	});

	it("skips non-object entries and non-array input", () => {
		expect(parseVariants(["Size", null, 7])).toEqual([]);
		expect(parseVariants({ label: "Size", options: ["S"] })).toEqual([]);
		expect(parseVariants(undefined)).toEqual([]);
	});
});

describe("parseReviews", () => {
	it("parses a full review", () => {
		expect(
			parseReviews([{ author: "Ada", rating: 4, date: "2026-05-09", text: "Great." }]),
		).toEqual([
			{ author: "Ada", rating: 4, date: new Date("2026-05-09"), text: "Great." },
		]);
	});

	it("drops a review with no body text", () => {
		expect(parseReviews([{ author: "Ada", rating: 5 }])).toEqual([]);
		expect(parseReviews([{ author: "Ada", text: "   " }])).toEqual([]);
	});

	it("falls back to Anonymous rather than losing the review", () => {
		expect(parseReviews([{ text: "Great." }])).toEqual([
			{ author: "Anonymous", text: "Great." },
		]);
	});

	it("ignores ratings that are out of range or not finite", () => {
		expect(parseReviews([{ text: "x", rating: 9 }])[0].rating).toBeUndefined();
		expect(parseReviews([{ text: "x", rating: -1 }])[0].rating).toBeUndefined();
		expect(parseReviews([{ text: "x", rating: Number.NaN }])[0].rating).toBeUndefined();
		expect(parseReviews([{ text: "x", rating: "5" }])[0].rating).toBeUndefined();
		expect(parseReviews([{ text: "x", rating: 0 }])[0].rating).toBe(0);
	});

	it("omits a blank or non-string date", () => {
		expect(parseReviews([{ text: "x", date: "  " }])[0].date).toBeUndefined();
		expect(parseReviews([{ text: "x", date: 20260509 }])[0].date).toBeUndefined();
	});

	it("keeps the full ISO form a datetime field round-trips as", () => {
		expect(parseReviews([{ text: "x", date: "2026-05-09T12:00:00.000Z" }])[0].date).toEqual(
			new Date("2026-05-09T12:00:00.000Z"),
		);
	});

	it("omits prose dates rather than letting Date guess a year", () => {
		// The demo's own placeholder, and the shape `new Date()` misreads as 2001.
		expect(parseReviews([{ text: "x", date: "7th June" }])[0].date).toBeUndefined();
		expect(parseReviews([{ text: "x", date: "June 7" }])[0].date).toBeUndefined();
	});

	it("omits an ISO-shaped date that is not a real day", () => {
		expect(parseReviews([{ text: "x", date: "2026-13-45" }])[0].date).toBeUndefined();
	});

	it("drops the blank row the repeater editor adds before it is filled in", () => {
		// "Add Item" seeds strings with "" and numbers with null.
		expect(parseReviews([{ author: "", rating: null, date: "", text: "" }])).toEqual([]);
	});

	it("keeps a partly filled repeater row that has body text", () => {
		expect(parseReviews([{ author: "", rating: null, date: "", text: "Great." }])).toEqual([
			{ author: "Anonymous", text: "Great." },
		]);
	});

	it("skips non-object entries and non-array input", () => {
		expect(parseReviews(["Great.", null])).toEqual([]);
		expect(parseReviews(undefined)).toEqual([]);
	});
});

describe("averageRating", () => {
	const review = (rating?: number) => ({ author: "A", text: "x", ...(rating !== undefined && { rating }) });

	it("averages the reviews that carry a rating", () => {
		expect(averageRating([review(4), review(5), review(5)])).toBe(4.67);
		expect(averageRating([review(4), review(5)])).toBe(4.5);
		expect(averageRating([review(3)])).toBe(3);
	});

	it("reproduces the values the rating field used to store", () => {
		expect(averageRating([review(4), review(3), review(5), review(4)])).toBe(4);
		expect(averageRating([review(5), review(5), review(4), review(5)])).toBe(4.75);
	});

	it("ignores reviews with no rating rather than counting them as zero", () => {
		expect(averageRating([review(5), review(), review(4)])).toBe(4.5);
	});

	it("is undefined when nothing is rated, so no stars render", () => {
		expect(averageRating([])).toBeUndefined();
		expect(averageRating([review(), review()])).toBeUndefined();
	});
});
