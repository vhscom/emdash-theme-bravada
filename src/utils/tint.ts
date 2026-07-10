/**
 * Landing bands carry their tint as a hex from the seed (the demo's
 * customizer values). Wrap it in light-dark() with a matched dark
 * twin so bands don't stay pastel when the site is in dark mode.
 */
const DARK_TINTS: Record<string, string> = {
	"#F9F7F5": "#15201f",
	"#F8F8F8": "#131c1b",
	"#F6F3F6": "#171f21",
	"#EEEBE9": "#1a1f1d",
	"#EEEEEE": "#141a19",
};

export function tintStyle(tint?: string): string | undefined {
	if (!tint) return undefined;
	const dark = DARK_TINTS[tint.toUpperCase()] ?? "#15201f";
	return `background-color: light-dark(${tint}, ${dark})`;
}
