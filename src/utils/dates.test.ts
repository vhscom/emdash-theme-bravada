import { describe, expect, it } from "vitest";
import { heroDate, longDate, monthDay, widgetDate } from "./dates";

const d = new Date("2026-05-09T12:00:00Z");

describe("dates", () => {
	it("longDate renders the card/article format", () => {
		expect(longDate(d)).toBe("May 9, 2026");
	});

	it("monthDay renders the related-card format", () => {
		expect(monthDay(d)).toBe("May 9");
	});

	it("widgetDate renders day-first", () => {
		expect(widgetDate(d)).toBe("9 May");
	});

	it("heroDate renders the demo's ordinal format", () => {
		expect(heroDate(d)).toBe("9th May 2026");
		expect(heroDate(new Date("2026-05-01T12:00:00Z"))).toBe("1st May 2026");
		expect(heroDate(new Date("2026-05-02T12:00:00Z"))).toBe("2nd May 2026");
		expect(heroDate(new Date("2026-05-03T12:00:00Z"))).toBe("3rd May 2026");
		expect(heroDate(new Date("2026-05-11T12:00:00Z"))).toBe("11th May 2026");
		expect(heroDate(new Date("2026-05-12T12:00:00Z"))).toBe("12th May 2026");
		expect(heroDate(new Date("2026-05-13T12:00:00Z"))).toBe("13th May 2026");
		expect(heroDate(new Date("2026-05-21T12:00:00Z"))).toBe("21st May 2026");
		expect(heroDate(new Date("2026-05-22T12:00:00Z"))).toBe("22nd May 2026");
		expect(heroDate(new Date("2026-05-23T12:00:00Z"))).toBe("23rd May 2026");
	});

	it("all formatters return null for missing dates", () => {
		expect(longDate(null)).toBeNull();
		expect(longDate(undefined)).toBeNull();
		expect(monthDay(null)).toBeNull();
		expect(widgetDate(undefined)).toBeNull();
		expect(heroDate(null)).toBeNull();
	});
});
