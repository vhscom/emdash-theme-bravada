/**
 * The port's date treatments, named for where the demo uses them so the
 * conventions stay greppable instead of scattered inline formats.
 *
 * Every formatter pins the calendar to UTC. Publish dates are stored as
 * UTC instants, so formatting in the server's local zone would render a
 * post published at 02:00Z as the previous day on any host west of
 * Greenwich — and the rendered date would change if the site moved
 * hosts. UTC keeps the output a property of the content, not the box.
 */

const UTC = "UTC" as const;

/** "May 9, 2026" — post cards and the article header. */
export const longDate = (d?: Date | null) =>
	d?.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: UTC,
	}) ?? null;

/** "May 9" — the related-posts cards under the article. */
export const monthDay = (d?: Date | null) =>
	d?.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: UTC }) ??
	null;

/** "9 May" — the sidebar posts/tabs widget meta (demo uses day-first). */
export const widgetDate = (d?: Date | null) =>
	d?.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: UTC }) ??
	null;

const ordinal = (n: number) =>
	n +
	(["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : Math.min(n % 10, 4)] ??
		"th");

/** "9th May 2026" — the demo's post-hero date. */
export const heroDate = (d?: Date | null) =>
	d
		? `${ordinal(d.getUTCDate())} ${d.toLocaleDateString("en-US", { month: "long", timeZone: UTC })} ${d.getUTCFullYear()}`
		: null;
