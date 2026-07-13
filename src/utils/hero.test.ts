import { describe, expect, it } from "vitest";
import { heroSlideImage } from "./hero";

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
