/**
 * Section-aware navigation highlighting, shared by the desktop nav
 * (Base) and the fullscreen mobile menu (MobileMenu).
 *
 * A nav item is "current" anywhere inside the section its URL owns:
 * /portfolio stays lit on /portfolio/x. Taxonomy archives roll up to
 * the section that owns them (a category page lights the Blog item).
 */

/** Taxonomy roots that roll up to a parent section for highlighting. */
const SECTION_ALIAS: Record<string, string> = {
	"/category": "/posts",
	"/tag": "/posts",
	"/project-type": "/portfolio",
	"/project-tag": "/portfolio",
};

const normUrl = (u?: string) => (u ?? "").replace(/\/$/, "") || "/";

/**
 * Build an `inSection(url)` predicate for the given request path. It
 * returns true when `url` owns the section the current page sits in.
 */
export function createInSection(pathname: string): (url?: string) => boolean {
	const currentPath = pathname.replace(/\/$/, "") || "/";
	const aliasRoot = Object.keys(SECTION_ALIAS).find(
		(k) => currentPath === k || currentPath.startsWith(k + "/"),
	);
	const sectionPath = aliasRoot ? SECTION_ALIAS[aliasRoot] : currentPath;
	return (u?: string) => {
		const n = normUrl(u);
		if (n === "#") return false;
		if (n === "/") return sectionPath === "/";
		return sectionPath === n || sectionPath.startsWith(n + "/");
	};
}

type MenuItemLike = {
	url?: string;
	label?: string;
	target?: string;
	children?: MenuItemLike[];
};

export type AnnotatedItem = Omit<MenuItemLike, "children"> & {
	isCurrent: boolean;
	isAncestor: boolean;
	children: AnnotatedItem[];
};

/**
 * Recursively tag each menu item with `isCurrent` (its URL owns the
 * current section) and `isAncestor` (a descendant is current) so the
 * mobile menu can pre-expand and gold-light the active branch.
 */
export function annotateMenu(
	items: MenuItemLike[] | undefined,
	inSection: (url?: string) => boolean,
): AnnotatedItem[] {
	return (items ?? []).map((item) => {
		const children = annotateMenu(item.children ?? [], inSection);
		return {
			...item,
			children,
			isCurrent: inSection(item.url),
			isAncestor: children.some((c) => c.isCurrent || c.isAncestor),
		};
	});
}
