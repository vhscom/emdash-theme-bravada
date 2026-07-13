import { describe, expect, it } from "vitest";
import { getMediaUrl } from "./media-url";

describe("getMediaUrl", () => {
	it("prefers a direct src", () => {
		expect(getMediaUrl({ src: "/images/demo/a.jpg" })).toBe("/images/demo/a.jpg");
		expect(getMediaUrl({ src: "https://cdn.example.com/a.jpg" })).toBe(
			"https://cdn.example.com/a.jpg",
		);
	});

	it("builds a media-API URL from meta.storageKey", () => {
		expect(getMediaUrl({ meta: { storageKey: "authors/august.png" } })).toBe(
			"/_emdash/api/media/file/authors/august.png",
		);
	});

	it("falls back to the id as storage key", () => {
		expect(getMediaUrl({ id: "media/2026/x.jpg" })).toBe(
			"/_emdash/api/media/file/media/2026/x.jpg",
		);
	});

	it("prefers src over storageKey, and storageKey over id", () => {
		expect(
			getMediaUrl({ src: "/a.jpg", meta: { storageKey: "k" }, id: "i" }),
		).toBe("/a.jpg");
		expect(getMediaUrl({ meta: { storageKey: "k" }, id: "i" })).toBe(
			"/_emdash/api/media/file/k",
		);
	});

	it("returns undefined for empty or non-object values", () => {
		expect(getMediaUrl(undefined)).toBeUndefined();
		expect(getMediaUrl(null)).toBeUndefined();
		expect(getMediaUrl("string")).toBeUndefined();
		expect(getMediaUrl({})).toBeUndefined();
		expect(getMediaUrl({ src: "" })).toBeUndefined();
	});
});
