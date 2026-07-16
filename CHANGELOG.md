# Changelog

All notable changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Burger menu fidelity pass against the original Bravada theme:
  layout, spacing, and animations now match the source, the search bar
  uses the original's own magnifier icon and type metrics, and the
  header hides on scroll and slides back on mobile like the original.
  One deliberate improvement: parent menu items without a link toggle
  their submenu instead of doing nothing.
- Webfonts trimmed to the faces the theme actually renders: Playfair
  Display ships regular and bold only (no italics), JetBrains Mono a
  single regular face. Mulish is unchanged — all its weights and
  italics are in use.

### Fixed

- Two section-library entries linked to a demo post that no longer
  exists; they now point at live content, matching the home page.

## [0.3.0] - 2026-07-15

### Added

- Product gallery interactions: hover zoom, a full-size lightbox, and
  slide transitions between images.
- Structured data for search engines: product pages emit
  `schema.org/Product` (with price, availability, and ratings) and
  portfolio pages emit `schema.org/CreativeWork`.
- Product pages now always have a meta description — when there's no
  excerpt, one is derived from the product's description.

### Changed

- The sitemap now covers every content type. Pages were missing
  entirely, and every product URL in the sitemap pointed at a route
  that didn't exist. **Sites created from an earlier seed need a
  one-time schema update** (seeds don't re-apply to existing
  databases): give each collection the URL pattern and SEO flag it has
  in `seed/seed.json`, via the admin's content-type settings or the
  schema API.
- Page titles use one separator everywhere (a compact `|` by default),
  and it's now editable under Settings → SEO in the admin.
- Demo imagery is now real photography (CC0/CC BY, credited in
  `CREDITS.md`) instead of placeholder artwork, with AVIF/WebP
  variants for the heavy images. Shop products each get distinct
  photos — several previously shared one. README and screenshots
  refreshed to match.

### Fixed

- The demo post "Throught the lens" is now "Through the lens" — title,
  URL, and every link to it. Existing databases need the same rename
  applied to their content.
- Product gallery glitches: a slide getting stuck when revisiting an
  image, plus zoom, keyboard, and lightbox-focus issues.
- Several homepage links pointed at posts that don't exist in this
  seed.
- Long unbroken words or URLs in blockquotes could overflow the screen
  on narrow viewports.
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
