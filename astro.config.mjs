import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { cloudflareCache, d1, kvCache, r2, sandbox } from "@emdash-cms/cloudflare";
import auditLog from "@emdash-cms/plugin-audit-log";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	// Edge-cache rendered pages via the Workers Cache API; the theme's
	// Astro.cache.set(cacheHint) calls tag responses so content edits
	// purge exactly the affected pages. Requires the CF_ZONE_ID and
	// CF_CACHE_PURGE_TOKEN worker secrets.
	cache: {
		provider: cloudflareCache(),
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			// Query results shared across isolates — most page reads hit KV
			// instead of D1.
			objectCache: kvCache({ binding: "CACHE" }),
			// Keep public HTML identical for every visitor so it is safe to
			// cache; logged-in editors get the client-side Edit pill.
			toolbar: "client",
			sandboxRunner: sandbox(),
			plugins: [
				auditLog,
				{
					id: "bravada-theme",
					version: "0.3.0",
					// Absolute file:// URL so the virtual emdash/plugins module
					// can resolve this at build time (relative paths fail because
					// the virtual module has no on-disk location to anchor them).
					entrypoint: new URL("./src/plugins/bravada-theme/index.ts", import.meta.url)
						.href,
				},
			],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Mulish",
			cssVariable: "--font-body",
			weights: [300, 400, 500, 600, 700, 900],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Playfair Display",
			cssVariable: "--font-display",
			// Only the faces the theme renders: 700 carries every
			// heading and menu link (--font-weight-heading/display),
			// 400 the burger-menu search input; nothing sets Playfair
			// italic. Add a face here before styling Playfair at any
			// other weight or style.
			weights: [400, 700],
			styles: ["normal"],
			fallbacks: ["Georgia", "serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			// Code renders at regular only — no rule sets a mono weight
			// or italic.
			weights: [400],
			styles: ["normal"],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
