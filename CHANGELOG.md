# Changelog

All notable changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/).

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
