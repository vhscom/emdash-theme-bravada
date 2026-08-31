import node from "@astrojs/node";
import react from "@astrojs/react";
import auditLog from "@emdash-cms/plugin-audit-log";
import { defineConfig, fontProviders, memoryCache } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	// Route caching for the Node build. The rules below declare the policy;
	// without a provider nothing enforces them, which is what this template
	// shipped through v0.10.0 — the Cloudflare deploy branch swaps in
	// cacheCloudflare() and was the only build that honoured them.
	//
	// memoryCache() holds rendered pages in the server process: up to 1000 by
	// default, and publishing invalidates the pages an entry appears on, so
	// editors are not waiting out the hour below. Being in-process is the
	// whole trade — it costs nothing to adopt and needs no platform, but each
	// instance keeps its own copy, so a multi-instance deploy will see them
	// diverge until each expires. Put a shared cache in front if you run more
	// than one.
	//
	// It also drops tracking parameters (utm_*, fbclid, gclid and the rest)
	// from the cache key by default, so a link shared with campaign tags hits
	// the same entry as the clean URL. Worth knowing that this is a property
	// of THIS provider, not of route caching: it can normalise the key because
	// it is the cache and runs inside the app. A CDN cache in front of the app
	// computes the key before any of your code runs, so it cannot.
	cache: {
		provider: memoryCache(),
	},
	// How long each kind of page may be held, declared next to the routes it
	// applies to rather than in site code.
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
