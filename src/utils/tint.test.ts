import { describe, expect, it } from "vitest";
import { tintStyle } from "./tint";

describe("tintStyle", () => {
	it("pairs a known seed tint with its dark twin", () => {
		expect(tintStyle("#F9F7F5")).toBe(
			"background-color: light-dark(#F9F7F5, #15201f)",
		);
	});

	it("matches tints case-insensitively", () => {
		expect(tintStyle("#f8f8f8")).toBe(
			"background-color: light-dark(#f8f8f8, #131c1b)",
		);
	});

	it("falls back to the default dark twin for unknown tints", () => {
		expect(tintStyle("#ABCDEF")).toBe(
			"background-color: light-dark(#ABCDEF, #15201f)",
		);
	});

	it("returns undefined without a tint", () => {
		expect(tintStyle(undefined)).toBeUndefined();
		expect(tintStyle("")).toBeUndefined();
	});
});
