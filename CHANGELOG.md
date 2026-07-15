# Changelog

All notable changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- Section library: the `icon-blocks` and `portfolio-grid` seed sections
  linked to `/posts/coffee-at-the-office`, a demo post renamed before
  0.1.0 (the home page's inline copies were fixed at the time; the
  library rows were missed). Icon block now links to
  `/posts/printing-your-dreams`, the portfolio card to
  `/portfolio/flyer-presentation`, matching the home page.

## [0.3.0] - 2026-07-15

### Added

- Product gallery: hover zoom lens, click-to-open magnifier lightbox, and
  slide transitions between gallery images (`/product/:slug`).
- `schema.org/Product` JSON-LD on product pages (name, image, description,
  SKU, offer with parsed price/currency and stock availability, aggregate
  rating when reviews exist) and `schema.org/CreativeWork` JSON-LD on
  portfolio pages (name, image, description, date, project types/tags).
- Product pages derive a meta description from the long description when
  the excerpt is empty (same `metaDescription()` snippet fallback pages
  and portfolio already used) — previously they shipped none.

### Changed

- Sitemap now covers every collection: the `pages` collection gained
  `seo` support (it was silently absent from the sitemap index), and all
  four collections carry an explicit `urlPattern` in `seed/seed.json`.
  Notably `products` was defaulting to `/products/{slug}` while the real
  route is `/product/{slug}`, so **every product URL in the live sitemap
  404'd**. Existing databases need the same schema update (seeds don't
  re-apply): set `url_pattern` and `has_seo` per collection, either via
  `PUT /_emdash/api/schema/collections/:slug` (read-modify-write — the
  PUT replaces the whole record) or directly in D1:
  `UPDATE _emdash_collections SET url_pattern='/posts/{slug}' WHERE slug='posts';`
  `UPDATE _emdash_collections SET url_pattern='/{slug}', has_seo=1, supports='["drafts","revisions","search","seo"]' WHERE slug='pages';`
  `UPDATE _emdash_collections SET url_pattern='/portfolio/{slug}' WHERE slug='portfolio';`
  `UPDATE _emdash_collections SET url_pattern='/product/{slug}' WHERE slug='products';`
- Title separator unified and admin-configurable:
  `resolveTitleSeparator()` in `src/utils/site-identity.ts` reads the
  Settings → SEO title separator (normalised to single surrounding
  spaces) and is used by both `Base.astro`'s fallback title and the
  `getSeoMeta()` call on single posts. Default is a compact `" | "`;
  previously posts used `" | "` while everything else hardcoded `" — "`.
- Imagery refresh: `public/images/demo/` — originally flat gradient/abstract
  placeholder artwork — is now real CC0/CC BY photography (heroes, page
  headers, homepage content images, portfolio, and all shop product photos),
  matching the original Bravada demo's photographic identity. Local images
  ship with pre-built AVIF/WebP siblings served through `<picture>` for the
  hero, page headers, portfolio, and project-grid images.
- Shop product photography rebuilt: every T-shirt/hoodie front-back pair,
  poster up/flat pair, and CD angle/flat pair now uses distinct photography
  (previously several pairs were byte-identical duplicates, and two CD
  products shared one photo). Sidebar "Top rated products"/"Recent reviews"
  widgets no longer list overlapping items.
- `CREDITS.md` rewritten: a complete, alphabetically-sorted attribution
  table for every CC BY/CC BY-SA image (author, license, source), a CC0
  category summary, and a note that gallery detail-crop variants inherit
  their parent photo's license.
- README: notes that demo imagery is real photography with a pointer to
  `CREDITS.md`, documents the AVIF/WebP `<picture>` convention and the
  product gallery's zoom/lightbox interactions; screenshot and GitHub
  social preview regenerated against the new hero photography.

### Fixed

- Demo post "Throught the lens" renamed to "Through the lens" — the typo
  was in the title, the slug (`/posts/throught-the-lens`), the featured
  image alt text, and every menu/section/page link to it. Existing
  databases need the equivalent `UPDATE`s on `ec_posts`
  (slug/title/featured_image), `ec_pages.content`, and
  `_emdash_sections.content`; revision history is left as-is.
- Gallery slide getting stuck after switching back to a previously-viewed
  image; zoom-lens stacking, thumbnail keyboard activation, and lightbox
  focus handling.
- Several 404 links on the homepage: featured-box and icon-block items
  pointing at posts that don't exist in this site's smaller seed (carried
  over from the original demo's larger post inventory and never
  reconciled).
- Blockquote overflow: `.page-content`/`.article-content blockquote`
  used `display: table; width: auto` with no `max-width`, so a long
  unbroken word or bare URL could exceed the viewport at narrow
  widths. Added `max-width: 100%` and `overflow-wrap`/`word-break`.
- Injected content (embeds, ads, third-party widgets) pasted into
  posts/pages could carry fixed, oversized dimensions with no theme
  sizing constraint. Added a generic `max-width: 100%` +
  `overflow: hidden` guard on `iframe`/`embed`/`object` inside content
  areas — no ad-network-specific selectors, so it holds regardless of
  provider. Documented the existing `html, body { overflow-x: clip }`
  rule as an intentional last-resort backstop for the same class of
  bug.

## [0.2.0] - 2026-07-14

### Added

- Theme settings plugin (`src/plugins/bravada-theme/`): editors toggle
  post-author attribution and the docked prev/next buttons from a Block
  Kit settings page in the admin (sidebar → Bravada Theme). Changes
  apply live, no restart.
- `seed/seed.minimal.json`: structure-only seed (collections,
  taxonomies, menus, widget areas, sections) for starting a clean site.
- Route-cache support: `src/middleware.ts` opts public pages into
  Astro's route cache (maxAge 300, swr 3600) wherever a cache provider
  is configured; the theme's `Astro.cache.set(cacheHint)` tags enable
  purge-by-tag on content edits. No-op without a provider.
- Vitest suite covering the utility modules (35 tests); `pnpm test`.
- Live demo at [bravada.comfus.io](https://bravada.comfus.io).

### Changed

- emdash 0.28.1 → 0.29.0.
- Post comments render only when the collection has comments enabled
  (previously the form always rendered).
- The setup wizard's "Include sample content" option is now the
  documented first-run path; Node 20+ declared via `engines`.
- Footer Contact Info matches the contact page (Ratsada, Phuket).

### Fixed

- Mobile: boxes bands run flush edge-to-edge like the demo (tint
  strips no longer show between stacked cards); animated boxes reveal
  Read More on hover instead of overflowing the card; text-band
  buttons stack with a real gap; hero buttons stretch full width.
- Mobile: text bands with a right-side image stack the image above the
  card (it previously climbed over the last lines of text or the
  buttons).
- Ghost section headers: the description's overlap pull now applies
  only when a ghost title exists and eases at small viewports —
  description-only headers no longer escape the section top. The dark
  icon-blocks band regained its "Amazing feedback" ghost title from
  the demo.
- Footer About Us spacing: the image no longer double-gaps below the
  widget title.

## [0.1.0] - 2026-07-13

First public release: a faithful port of the Bravada WordPress theme
(Cryout Creations, GPL-3.0-or-later) to Astro on EmDash — landing
sections as Portable Text blocks, demo shop and portfolio, full-text
search, RSS, SEO, dark mode.
