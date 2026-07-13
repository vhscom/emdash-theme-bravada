import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "emdash";
import { getReadingTime, metaDescription } from "./reading-time";

const block = (text: string): PortableTextBlock =>
	({
		_type: "block",
		children: [{ _type: "span", text }],
	}) as unknown as PortableTextBlock;

describe("getReadingTime", () => {
	it("never reports less than a minute", () => {
		expect(getReadingTime(undefined)).toBe(1);
		expect(getReadingTime([block("short post")])).toBe(1);
	});

	it("scales with word count at 200 wpm", () => {
		const words = Array.from({ length: 450 }, (_, i) => `w${i}`).join(" ");
		expect(getReadingTime([block(words)])).toBe(3);
	});

	it("counts CJK characters at their own rate", () => {
		const cjk = "字".repeat(1000);
		expect(getReadingTime([block(cjk)])).toBe(2);
	});
});

describe("metaDescription", () => {
	it("returns short text as-is", () => {
		expect(metaDescription([block("A short excerpt.")])).toBe("A short excerpt.");
	});

	it("clips long text at a word boundary with an ellipsis", () => {
		const long = "word ".repeat(60).trim();
		const meta = metaDescription([block(long)]);
		expect(meta!.length).toBeLessThanOrEqual(156);
		expect(meta!.endsWith("…")).toBe(true);
		expect(meta).not.toMatch(/wor…$/);
	});

	it("returns undefined when there is no usable text", () => {
		expect(metaDescription(undefined)).toBeUndefined();
		expect(metaDescription([])).toBeUndefined();
	});
});
