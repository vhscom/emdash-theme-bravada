import { describe, expect, it } from "vitest";
import {
	boxesProps,
	contactProps,
	ctaButtons,
	faqProps,
	leadingHeroImage,
	lines,
	paragraphs,
	portfolioProps,
	pricingProps,
	safeUrl,
	splitProps,
	testimonialsProps,
	tintHex,
} from "./marketing-blocks";

const base = { _version: 1 as const, _key: "k1" };

describe("safeUrl", () => {
	it("keeps site paths, fragments and mail links", () => {
		expect(safeUrl("/posts")).toBe("/posts");
		expect(safeUrl("#pricing")).toBe("#pricing");
		expect(safeUrl("mailto:hi@example.com")).toBe("mailto:hi@example.com");
	});

	it("drops script URLs and blanks instead of rendering a dead #", () => {
		expect(safeUrl("javascript:alert(1)")).toBeUndefined();
		expect(safeUrl("  ")).toBeUndefined();
		expect(safeUrl(null)).toBeUndefined();
	});

	it("trims stray whitespace an editor pasted around a link", () => {
		expect(safeUrl(" /about-us ")).toBe("/about-us");
	});
});

describe("text helpers", () => {
	it("splits paragraphs on blank lines", () => {
		expect(paragraphs("One.\n\nTwo\nstill two.\n \n")).toEqual(["One.", "Two\nstill two."]);
		expect(paragraphs(undefined)).toEqual([]);
	});

	it("splits a list field one entry per line", () => {
		expect(lines("Prints\n\n  Framing \n")).toEqual(["Prints", "Framing"]);
	});

	it("maps tint names to the demo's band colours", () => {
		expect(tintHex("stone")).toBe("#EEEBE9");
		expect(tintHex("none")).toBeUndefined();
		expect(tintHex(null)).toBeUndefined();
	});
});

describe("ctaButtons", () => {
	it("keeps only buttons with both text and a usable link", () => {
		expect(
			ctaButtons({
				primary_cta_label: "Read more",
				primary_cta_url: "/posts",
				secondary_cta_label: "Dangerous",
				secondary_cta_url: "javascript:void(0)",
			}),
		).toEqual([{ label: "Read more", url: "/posts", style: "primary" }]);
	});

	it("lets a band carry just the secondary button", () => {
		expect(ctaButtons({ secondary_cta_label: "Relax", secondary_cta_url: "/x" })).toEqual([
			{ label: "Relax", url: "/x", style: "secondary" },
		]);
	});
});

describe("splitProps", () => {
	it("puts the photo on the left unless the editor turned that off", () => {
		const v = { ...base, _type: "marketing_split" as const, image: { id: "m", src: "/a.jpg" } };
		expect(splitProps(v).imageSide).toBe("left");
		expect(splitProps({ ...v, image_first: false }).imageSide).toBe("right");
	});
});

describe("boxesProps", () => {
	it("reads the image and alt text from the media value", () => {
		const props = boxesProps({
			...base,
			_type: "bravada_boxes",
			tint: "mist",
			items: [{ title: "Vase", image: { id: "m", src: "/v.jpg", alt: "A straw vase" } }],
		});
		expect(props.items[0]).toMatchObject({ image: "/v.jpg", imageAlt: "A straw vase", title: "Vase" });
		expect(props.tint).toBe("#F8F8F8");
		expect(props.variant).toBe("static");
	});
});

describe("portfolioProps", () => {
	it("turns comma-separated tags into the filter list", () => {
		const props = portfolioProps({
			...base,
			_type: "bravada_portfolio",
			items: [{ title: "Cards", tags: "Brands, Business Cards ,," }],
		});
		expect(props.items[0].tags).toEqual(["Brands", "Business Cards"]);
	});

	it("shows the trailing button only with both its text and link", () => {
		const v = { ...base, _type: "bravada_portfolio" as const, more_label: "All work" };
		expect(portfolioProps(v).more).toBeUndefined();
		expect(portfolioProps({ ...v, more_url: "/portfolio" }).more).toEqual({
			label: "All work",
			url: "/portfolio",
		});
	});
});

describe("testimonialsProps", () => {
	it("falls back to the caption for a portrait without alt text", () => {
		const props = testimonialsProps({
			...base,
			_type: "marketing_testimonials",
			testimonials: [{ quote: "Great!", author: "Best theme", avatar: { id: "m", src: "/p.jpg" } }],
		});
		expect(props.items[0]).toEqual({
			text: "Great!",
			title: "Best theme",
			image: "/p.jpg",
			imageAlt: "Best theme",
		});
	});
});

describe("faqProps", () => {
	it("maps questions onto the accordion and keys its panel group by block", () => {
		const props = faqProps(
			{ ...base, _type: "marketing_faq", items: [{ question: "Q?", answer: "A." }] },
			"k1",
		);
		expect(props.accordion.items).toEqual([{ title: "Q?", body: "A." }]);
		expect(props.accordion._key).toBe("k1");
	});

	it("puts the headline in the section header, not an accordion intro", () => {
		const props = faqProps(
			{ ...base, _type: "marketing_faq", headline: "Questions", subheadline: "Ask us." },
			"k1",
		);
		expect(props.header).toEqual({ title: "Questions", description: "Ask us." });
		expect(props.accordion).not.toHaveProperty("heading");
	});
});

describe("contactProps", () => {
	it("sizes the grid to the number of options, between two and four", () => {
		const option = { title: "Email", link_label: "hi@example.com", link_url: "mailto:hi@example.com" };
		const one = contactProps({ ...base, _type: "marketing_contact", options: [option] });
		expect(one.columns).toBe(2);
		expect(one.items[0].linkLabel).toBe("hi@example.com");
		const five = contactProps({
			...base,
			_type: "marketing_contact",
			options: Array.from({ length: 5 }, () => option),
		});
		expect(five.columns).toBe(4);
	});
});

describe("pricingProps", () => {
	it("lists features one per line and drops a half-filled button", () => {
		const props = pricingProps({
			...base,
			_type: "marketing_pricing",
			plans: [{ name: "Studio", price: "£40", features: "Prints\nFraming\n", cta_label: "Book" }],
		});
		expect(props.plans[0]).toMatchObject({
			features: ["Prints", "Framing"],
			cta: undefined,
			highlighted: false,
		});
	});
});

describe("leadingHeroImage", () => {
	it("returns the image of a hero that opens the page", () => {
		expect(
			leadingHeroImage([
				{ ...base, _type: "marketing_hero", headline: "Hi", image: { id: "m", src: "/h.jpg" } },
			]),
		).toBe("/h.jpg");
	});

	it("ignores a hero further down the page", () => {
		expect(
			leadingHeroImage([
				{ ...base, _type: "marketing_text" },
				{ ...base, _key: "k2", _type: "marketing_hero", headline: "Hi", image: { id: "m", src: "/h.jpg" } },
			]),
		).toBeUndefined();
	});
});
