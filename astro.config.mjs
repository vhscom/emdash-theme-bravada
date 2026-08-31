import node from "@astrojs/node";
import react from "@astrojs/react";
import auditLog from "@emdash-cms/plugin-audit-log";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	// How long each kind of page may be held, declared next to the routes it
	// applies to rather than in site code. Inert without a cache provider, so
	// the Node build ignores this and the Cloudflare deploy uses it.
	//
	// An hour fresh, ten days stale-while-revalidate: within the hour a reader
	// gets the stored copy outright, and for ten days after they get it
	// immediately while a fresh one is fetched behind them. Publishing clears
	// the pages an entry appears on, so this window only ever bounds what tags
	// cannot see — site settings, menus, the theme itself. Matching the shape
	// EmDash's own demos/cloudflare uses.
	//
	// Two rules cover every route: `/[...slug]` matches at any depth, and
	// Astro sorts by route priority so a more specific rule would win. /search
	// is absent on purpose — it opts itself out in the page, because a cache
	// reads Cloudflare-CDN-Cache-Control and never the Cache-Control we set.
	routeRules: {
		"/": { maxAge: 3_600, swr: 864_000 },
		"/[...slug]": { maxAge: 3_600, swr: 864_000 },
		// Results are built from whatever the reader typed, so this must not be
		// served from cache. maxAge 0 rather than an opt-out in the page: HTML
		// streams, so SiteFooter's cacheHint can run after any set(false) and
		// clear it, and a hint only ever adds tags — it never overwrites
		// maxAge. So this rule survives where an opt-out did not.
		"/search": { maxAge: 0 },
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			// Keep public HTML identical for every visitor so it is safe to
			// cache. A cache in front of the site answers before any of this
			// runs, so it cannot bypass on a cookie and a server-injected
			// toolbar cannot survive a hit; the editor would be handed the
			// cached anonymous page without it. Client mode ships one
			// bootstrap and decides in the browser.
			toolbar: "client",
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [
				auditLog,
				{
					id: "bravada-theme",
					version: "0.10.0",
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
