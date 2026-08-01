import { describe, expect, it } from "vitest";
import { parseGallery, parseReviews, parseVariants } from "./product-fields";

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
		).toEqual([{ author: "Ada", rating: 4, date: "2026-05-09", text: "Great." }]);
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

	it("skips non-object entries and non-array input", () => {
		expect(parseReviews(["Great.", null])).toEqual([]);
		expect(parseReviews(undefined)).toEqual([]);
	});
});
