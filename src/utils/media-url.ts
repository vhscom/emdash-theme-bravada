/** Resolve an EmDash image field value to a displayable URL. */
export function getMediaUrl(img: unknown): string | undefined {
	if (!img || typeof img !== "object") return undefined;
	const image = img as Record<string, unknown>;
	if (typeof image.src === "string" && image.src) return image.src;
	const meta = image.meta as Record<string, unknown> | undefined;
	const storageKey =
		(typeof meta?.storageKey === "string" ? meta.storageKey : undefined) ||
		(typeof image.id === "string" ? image.id : undefined);
	return storageKey ? `/_emdash/api/media/file/${storageKey}` : undefined;
}
