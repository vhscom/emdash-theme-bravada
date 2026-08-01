/**
 * Focus containment for the theme's two fullscreen layers (the burger
 * menu and the search overlay).
 *
 * Both layers cover the page and declare `aria-modal`, but a modal that
 * doesn't contain focus is worse than no modal at all: Tab walks out
 * into the page underneath, which is still in the tab order and now
 * invisible behind the layer. Marking everything outside the layer
 * `inert` removes it from the tab order, hit-testing and the a11y tree
 * in one go, so Tab wraps inside the layer without a hand-rolled trap.
 *
 * `keep` can name more than one element because the burger menu's close
 * control is the header's hamburger, which lives outside the menu and
 * has to stay reachable — the walk keeps a kept element's ancestors
 * alive and inerts only their other children.
 */
export function inertOutside(keep: Element[]): () => void {
	const alive = new Set<Element>();
	for (const el of keep) {
		let node: Element | null = el;
		while (node && node !== document.body) {
			alive.add(node);
			node = node.parentElement;
		}
	}

	const marked: HTMLElement[] = [];
	const walk = (parent: Element) => {
		for (const child of Array.from(parent.children)) {
			if (!(child instanceof HTMLElement)) continue;
			if (keep.includes(child)) continue;
			// An ancestor of something we're keeping: descend instead of
			// inerting the whole branch.
			if (alive.has(child)) {
				walk(child);
				continue;
			}
			// Already inert — someone else owns it; don't clear it on release.
			if (child.inert) continue;
			child.inert = true;
			marked.push(child);
		}
	};
	walk(document.body);

	return () => {
		for (const el of marked) el.inert = false;
	};
}
