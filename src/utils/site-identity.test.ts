import { describe, expect, it } from "vitest";
import {
	resolveBlogSiteIdentity,
	resolveSiteOrigin,
	resolveTitleSeparator,
} from "./site-identity";

describe("resolveBlogSiteIdentity", () => {
	it("uses configured title and tagline", () => {
		const r = resolveBlogSiteIdentity({ title: "Bravada for Astro", tagline: "T" });
		expect(r.siteTitle).toBe("Bravada for Astro");
		expect(r.siteTagline).toBe("T");
	});

	it("falls back to defaults when settings are missing", () => {
		const r = resolveBlogSiteIdentity(undefined);
		expect(r.siteTitle).toBe("My Blog");
		expect(r.siteTagline).toBe("Thoughts, stories, and ideas.");
		expect(r.siteLogo).toBeNull();
	});

	it("only exposes a logo that has a resolved URL", () => {
		expect(
			resolveBlogSiteIdentity({ logo: { mediaId: "m1" } }).siteLogo,
		).toBeNull();
		expect(
			resolveBlogSiteIdentity({ logo: { mediaId: "m1", url: "/logo.png" } })
				.siteLogo,
		).toEqual({ mediaId: "m1", url: "/logo.png" });
	});
});

describe("resolveSiteOrigin", () => {
	it("prefers the settings URL, stripping trailing slashes", () => {
		expect(resolveSiteOrigin({ url: "https://example.com/" }, "http://req")).toBe(
			"https://example.com",
		);
		expect(resolveSiteOrigin({ url: "https://example.com//" }, "http://req")).toBe(
			"https://example.com",
		);
	});

	it("falls back to the request origin", () => {
		expect(resolveSiteOrigin(undefined, "http://localhost:4321")).toBe(
			"http://localhost:4321",
		);
		expect(resolveSiteOrigin({}, "http://localhost:4321")).toBe(
			"http://localhost:4321",
		);
		expect(resolveSiteOrigin({ url: "" }, "http://req")).toBe("http://req");
	});
});

describe("resolveTitleSeparator", () => {
	it("defaults to a spaced pipe", () => {
		expect(resolveTitleSeparator(undefined)).toBe(" | ");
		expect(resolveTitleSeparator({})).toBe(" | ");
		expect(resolveTitleSeparator({ seo: {} })).toBe(" | ");
	});

	it("normalises the admin setting to single surrounding spaces", () => {
		expect(resolveTitleSeparator({ seo: { titleSeparator: "—" } })).toBe(" — ");
		expect(resolveTitleSeparator({ seo: { titleSeparator: " — " } })).toBe(" — ");
		expect(resolveTitleSeparator({ seo: { titleSeparator: "|" } })).toBe(" | ");
	});

	it("falls back to the default when the setting is blank", () => {
		expect(resolveTitleSeparator({ seo: { titleSeparator: "" } })).toBe(" | ");
		expect(resolveTitleSeparator({ seo: { titleSeparator: "   " } })).toBe(" | ");
	});
});
