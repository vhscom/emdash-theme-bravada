/**
 * Derived from Bravada (frontend.js, cryoutSliderTitleBreakUp),
 * © 2020–25 Cryout Creations, GPL-3.0-or-later.
 * Modifications © 2026 vhs. Distributed under the same licence; see LICENSE.
 *
 * Bravada cryoutSliderTitleBreakUp (client-side): splits a title's
 * letters into stacked cry-single/cry-double copies; every ~3.5s a
 * random handful gain .animated-letter — they turn gold and the
 * visible copy slides out while the double slides in. Shared by the
 * landing slider (Hero.astro) and inner-page headers (PageHeader.astro);
 * the letter CSS lives in theme.css under .breakup-title.
 */
export function initTitleBreakup(selector = ".breakup-title") {
	for (const el of document.querySelectorAll<HTMLElement>(selector)) {
		if (el.dataset.breakup) continue;
		el.dataset.breakup = "1";
		const text = (el.textContent ?? "").trim();
		const words = text.split(/\s+/);
		el.textContent = "";
		for (const [wi, word] of words.entries()) {
			const em = document.createElement("em");
			em.className = "caption-title-word";
			for (const ch of word) {
				const outer = document.createElement("span");
				for (const cls of ["cry-single", "cry-double"]) {
					const copy = document.createElement("span");
					copy.className = cls;
					copy.textContent = ch;
					outer.appendChild(copy);
				}
				em.appendChild(outer);
			}
			el.appendChild(em);
			if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
		}
		el.classList.add("animated-title");

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
			continue;

		const clearLen = text.replace(/\s+/g, "").length;
		let n = Math.max(2, Math.floor(clearLen / 4));
		n = Math.min(n, 7);
		const singles = [...el.querySelectorAll("span.cry-single")];
		const doubles = [...el.querySelectorAll("span.cry-double")];

		const titleAnimation = () => {
			for (const sp of [...singles, ...doubles])
				sp.classList.remove("animated-letter");
			// force reflow so re-added animations restart
			void el.offsetWidth;
			for (let i = 0; i < n; i++) {
				const k = Math.floor(Math.random() * singles.length);
				singles[k].classList.add("animated-letter");
				doubles[k].classList.add("animated-letter");
			}
		};
		setTimeout(titleAnimation, 1000);
		setInterval(titleAnimation, 3500);
	}
}
