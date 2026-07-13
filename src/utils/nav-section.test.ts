import { describe, expect, it } from "vitest";
import { createInSection } from "./nav-section";

describe("createInSection", () => {
	it("matches the exact page", () => {
		expect(createInSection("/posts")("/posts")).toBe(true);
	});

	it("stays lit inside a section", () => {
		expect(createInSection("/portfolio/new-york-vol-27")("/portfolio")).toBe(true);
		expect(createInSection("/posts/some-coffee-art")("/posts")).toBe(true);
	});

	it("rolls taxonomy archives up to their section", () => {
		expect(createInSection("/category/coffee")("/posts")).toBe(true);
		expect(createInSection("/tag/amet")("/posts")).toBe(true);
		expect(createInSection("/project-type/print")("/portfolio")).toBe(true);
		expect(createInSection("/project-tag/paper")("/portfolio")).toBe(true);
	});

	it("does not light unrelated items", () => {
		expect(createInSection("/posts/x")("/portfolio")).toBe(false);
		expect(createInSection("/about-us")("/posts")).toBe(false);
	});

	it("home only matches home", () => {
		expect(createInSection("/")("/")).toBe(true);
		expect(createInSection("/posts")("/")).toBe(false);
	});

	it("ignores '#' dropdown parents and trailing slashes", () => {
		expect(createInSection("/posts")("#")).toBe(false);
		expect(createInSection("/posts/")("/posts")).toBe(true);
		expect(createInSection("/posts")("/posts/")).toBe(true);
	});
});
