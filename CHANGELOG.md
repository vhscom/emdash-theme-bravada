# Changelog

All notable changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/).

## [0.4.3] - 2026-07-19

### Fixed

- Stacked hero buttons rendered edge-to-edge (93% of viewport at
  390px) instead of hugging the lede's measure. The demo's stacked
  buttons aren't edge-to-edge either: its `.staticslider-caption-buttons`
  has no explicit width rule at all (`display: table; margin: ... auto`)
  — the ~80%-of-container result comes from table auto-layout sizing a
  `width: 100%` child within a shrink-wrapped table, an emergent effect
  of the display: table mechanism, not a width rule to copy literally.
  Confirmed via a clean, popup-free, cache-busted re-measurement of the
  demo (292.1px / 74.9% of viewport / 80.2% of `.staticslider-caption-inside`
  at 390px, stable across reloads) — the port's flex-based stacking
  instead defaulted to filling 100% of its container, which is why it
  read as edge-to-edge. Capped `.staticslider-caption-buttons` at
  `max-width: 80%` (centered) in the stacked breakpoint, matching the
  demo's measured proportions and the lede's own 80% cap for a
  consistent column. Side-by-side buttons above 480px are unaffected
  (unchanged, still intrinsic width — verified at 600px).

## [0.4.2] - 2026-07-19

### Fixed

- Hero button stacking breakpoint: `.staticslider-caption-buttons`
  switched to stacked, full-width buttons at `max-width: 800px`, but
  the demo only does this below `480px` (`a.staticslider-button {
  width: 100% }` at `max-width: 480px`) — above that its buttons stay
  side-by-side at their intrinsic (label-hugging) width. Between
  ~480–800px the port was stacking/stretching buttons the demo keeps
  compact and inline. Moved the stacking rule to its own `480px`
  media query. At 390px the buttons genuinely are near full-width and
  stacked on the demo too (344px / 88% of viewport there) — that part
  was already correct and is unchanged; verified 390px, 480px, 600px,
  and 800px against the demo's computed button widths after the fix.

## [0.4.1] - 2026-07-19

### Fixed

- Hero lede width: `.staticslider-caption-inside` was pinned at a flat
  `max-width: 85%` on every viewport, which compounded with the lede's
  own `80%` to squeeze the paragraph to ~57% of the caption instead of
  the demo's proportions. Matched the demo's actual breakpoints:
  `.staticslider-caption-inside` is `90%` above 900px and `100%` at or
  below it; `.staticslider-caption` itself caps at `85%` above 1024px
  (previously unbounded, making the desktop hero column wider than the
  original) and its side padding tapers at 1152px/640px. Verified
  against computed widths on the demo at 390px and 1440px — the port's
  lede now matches the source to the pixel at both.

## [0.4.0] - 2026-07-16

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
- The burger-menu search is a plain search form again, submitting to
  the results page — the live-suggestions dropdown didn't suit the
  fullscreen menu.
- The search results page now matches the original theme: the title
  reads "Search Results for: …", the breadcrumb names the query, the
  form is the theme's white square input with a gold square submit
  button, and results display as the same article cards the blog uses
  — on phones and desktop, paginated ten to a page with the theme's
  numeric page links. A fruitless search gets the theme's Nothing
  Found page: the message, a search form, and fallback columns of
  recent posts, recent comments (a tag cloud when comments are off or
  silent), and categories.
- Inner-page headers now show the theme's bouncing chevron that
  scrolls readers down to the content; the homepage chevron adopts the
  theme's exact glyph and placement too.
- The fixed navigation bar slides in from above once you scroll past
  the header, at the theme's own scroll threshold.
- Archive pages share the same sidebar as single posts instead of
  carrying their own variant.

### Fixed

- Text no longer clips in the burger-menu search field while typing (a
  display bug the original theme also has; not ported).
- Two section-library entries linked to a demo post that no longer
  exists; they now point at live content, matching the home page.
- Full-screen heroes now use the large viewport height on phones, so
  the hero fills the screen edge-to-edge like the theme instead of
  stopping short at the browser bars.
- Hero captions are vertically centred in the image again — on small
  screens the caption group sat low enough for the scroll chevron to
  overlap the buttons, and the search page's title and search box rode
  below centre.

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
