import { describe, expect, it } from "vitest";
import { heroSlideImage, opensWithHero, pageHeroImage } from "./hero";

describe("heroSlideImage", () => {
	it("returns the image of a leading bravada.hero block", () => {
		expect(
			heroSlideImage([{ _type: "bravada.hero", image: "/images/demo/hero.jpg" }]),
		).toBe("/images/demo/hero.jpg");
	});

	it("ignores heroes that are not the first block", () => {
		expect(
			heroSlideImage([
				{ _type: "block" },
				{ _type: "bravada.hero", image: "/x.jpg" },
			]),
		).toBeUndefined();
	});

	it("returns undefined for a hero without a string image", () => {
		expect(heroSlideImage([{ _type: "bravada.hero" }])).toBeUndefined();
		expect(heroSlideImage([{ _type: "bravada.hero", image: 42 }])).toBeUndefined();
	});

	it("handles non-array and empty content", () => {
		expect(heroSlideImage(undefined)).toBeUndefined();
		expect(heroSlideImage(null)).toBeUndefined();
		expect(heroSlideImage("not blocks")).toBeUndefined();
		expect(heroSlideImage([])).toBeUndefined();
	});
});

describe("pageHeroImage / opensWithHero", () => {
	const hero = {
		_type: "marketing_hero" as const,
		_version: 1 as const,
		_key: "h",
		headline: "Hi",
		image: { id: "m", src: "/images/demo/static.jpg" },
	};

	it("reads a page built from blocks", () => {
		expect(pageHeroImage({ blocks: [hero] })).toBe("/images/demo/static.jpg");
		expect(opensWithHero({ blocks: [hero] })).toBe(true);
	});

	it("falls back to the rich-text hero on a page not yet moved to blocks", () => {
		const content = [{ _type: "bravada.hero", image: "/x.jpg" }];
		expect(pageHeroImage({ blocks: [], content })).toBe("/x.jpg");
		expect(opensWithHero({ blocks: [], content })).toBe(true);
	});

	it("lets the blocks decide once a page has any", () => {
		const content = [{ _type: "bravada.hero", image: "/x.jpg" }];
		const text = { _type: "marketing_text" as const, _version: 1 as const, _key: "t" };
		expect(pageHeroImage({ blocks: [text], content })).toBeUndefined();
		expect(opensWithHero({ blocks: [text], content })).toBe(false);
	});
});
