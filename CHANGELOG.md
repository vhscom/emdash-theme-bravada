# Changelog

All notable changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Product pages now describe each customer review to search engines
  individually, not just the average score. Results can show a star
  rating with the number of reviews behind it, which search engines
  ask for before they will display either.
- The content lists in the admin show more at a glance — pages carry
  their layout, and products their price, SKU and stock state.

### Changed

- EmDash 0.33.0 to 0.34.0. Database migrations run the first time you
  start the site after updating.
- Portfolio project dates are real dates now, picked from a calendar
  instead of typed as free text. They read the same on the site as
  before, but the admin can sort and filter projects by them.
- Every product now has its own SKU. Six had none and three shared
  placeholders ("N/A", "SKU-1"), which search engines read as one
  product listed several times.
- Product reviews are edited as a proper list now, rather than by
  hand-writing JSON. Each review is a row with its own author, rating,
  date and body, and rows can be dragged into a new order. If your
  site already has reviews, save a copy before updating: EmDash
  refuses to change a field's type while content sits in it, so the
  field has to be removed and recreated, which clears what was there.
- Customer reviews on product pages now carry a real date. They all
  read "7th June" before, with no year, so search engines got no
  review date at all; each review now shows the day it was written
  and reports it alongside the rest of its details.
- Category, tag, project-type and project-tag archives now ask search
  engines to index the posts they list rather than the list itself.
  These pages repeat titles and excerpts that already appear on the
  posts, so leaving them out of the index keeps the real pages from
  competing with thin copies. Links on them are still followed.

### Documentation

- The README explains how to keep uploaded images visible to search
  engines. EmDash's stock robots.txt blocks the path its media proxy
  serves uploads from, which is where social preview images always
  come from — so link previews are hidden from crawlers until you
  replace that file. The README gives you the text to paste and notes
  when on-page images are affected too; the Bravada Theme settings
  page points at it.

## [0.7.0] - 2026-08-18

### Fixed

- The sidebar under a post now lines up with the article above it. On
  screens narrow enough for it to drop below the white card, its
  search box and recent-post thumbnails sat flush against the right
  edge — they now keep the same margin the article has.
- Posts use the full width of a phone screen, the way the theme does.
  The article sat inside a margin and then indented its text again,
  so the words ran in a column about three quarters as wide as the
  theme gives them.
- The portfolio and testimonial sections of the landing page kept
  their desktop indent on a phone, leaving both noticeably narrower
  than the sections above and below. They now step their margins down
  on smaller screens like the rest of the page.
- Section headings on the landing page sit over their large faded
  title again on smaller screens. The two had been drifting apart as
  the screen narrowed until the heading cleared the faded title
  almost entirely, losing the overlap the pairing is built on.
- Content with a stray `</script>` in it can no longer break the
  structured data on project and product pages. The data search
  engines read is now escaped on its way into the page, so an
  unlucky character in a description can't cut the block short.

### Added

- Search engines now get the trail of links above a page title as
  structured data, so results can show where the page sits in the
  site rather than just its address.

## [0.6.0] - 2026-08-17

### Changed

- EmDash 0.31.1 to 0.33.0. Two database migrations run the first time
  you start the site after updating. Taxonomy terms keep the order they
  appear in today, now stored explicitly, so you can rearrange them
  from the Taxonomies screen instead of renaming things to sort them.
- Start the dev server with `pnpm dev`. The `npx emdash dev` form the
  setup instructions used is deprecated in EmDash 0.33.0; it still
  runs, but warns.

### Fixed

- Blog posts can now show a large preview image in search results.
  Posts were the only pages on the site missing the line that permits
  it, so the one page type built around a photograph was the one
  shown with a small thumbnail.
- The landing page now carries a top-level heading — the site title,
  where the original theme puts it. Its headings previously started
  one level down, leaving the site's most important page without one.
- The landing page is no longer served at a second address. `/home`
  now sends visitors to the site root instead of answering with the
  same page again, so the two can't compete with each other.
- Posts now name their author in the information search engines read.
  The byline was on the page but missing from the data behind it.
  Sites that turn author attribution off stay anonymous there too.
- Addresses written with a trailing slash (`/about/` rather than
  `/about`) now redirect to the one correct address instead of
  serving a second copy of the page. Links from an old WordPress site,
  where that trailing slash was the norm, keep working.
- The SEO panel in the admin now takes effect on pages, projects and
  products, not just posts. A custom title, description, social image
  or canonical set there was ignored. "Hide from search engines" was
  worse than ignored: it dropped the page from the sitemap while the
  page itself kept inviting search engines in.
- Later pages of the blog archive no longer describe themselves as
  copies of page one, and their titles say which page you are on.

## [0.5.0] - 2026-08-01

### Changed

- The theme now requires Node 22 or newer. The pinned pnpm version
  already refused to run on Node 20, so the previous "Node 20+" claim
  could not be honoured.
- emdash 0.29.0 → 0.31.1, and the Cloudflare adapter alongside it on the
  `deploy/cloudflare` branch. No template changes were needed.

### Added

- A "Skip to content" link, the first stop when you tab into any page,
  so reaching the article no longer means tabbing through the whole
  header and menu.
- The blog now shows ten posts per page with the theme's numbered
  pager, the same one the search results use. Previously every post on
  the site was rendered on one page.

### Fixed

- The fullscreen search overlay and the burger menu now keep the
  keyboard inside them while open. Tabbing off the end used to walk
  invisibly into the page behind the layer.
- The sidebar tabs widget and the product page's tabs now respond to
  the arrow, Home and End keys, and the tab strip is a single stop
  instead of one per tab. Screen readers are told which tab belongs to
  which panel.
- The footer's light/dark/system buttons now announce which one is
  active. They previously sounded like three identical buttons.
- Turning on the system's "reduce motion" setting now also calms
  in-page scrolling, the back-to-top jump, the header's slide-down and
  the burger menu's item-by-item entrance.
- Post dates no longer shift by a day depending on where the site is
  hosted.
- Editing a page, or publishing a post, now refreshes the footer
  navigation and the recent-posts widgets instead of leaving stale
  copies on cached pages.
- Products whose options or reviews were saved in an unexpected shape
  no longer take the whole product page down.
- Archive pages no longer nest one main region inside another, and
  widget areas no longer render a stray heading for widget types the
  theme does not handle.
- Restored the intended hover colour on portfolio meta links in dark
  mode.
- The skip link now appears whenever it receives focus. It was gated on
  `:focus-visible`, a browser heuristic that withheld it in Safari, so
  the link stayed off-screen for the people who needed it. Note that
  Safari only tabs to links at all once "Press Tab to highlight each
  item on a webpage" is enabled in its Advanced settings; without it,
  Option+Tab reaches them.

### Documentation

- The README now carries the design-token cheat sheet and the note that
  the palette deliberately reproduces the original demo rather than
  meeting WCAG contrast — previously only in the agent-facing
  `AGENTS.md`.
- Documented the Cloudflare Workers deployment path and the bundler pin
  it depends on.
- Added EmDash version, supported Node, CI, and licence badges.

## [0.4.5] - 2026-07-20

### Fixed

- The large translucent section headings (e.g. "A glorious title") now
  wrap and space themselves against their description the way the
  original theme does on mobile, and reveal with the same subtle
  animation on scroll.
- Photos that overlap the card above them no longer crowd the section
  edge — restored the breathing room the original theme gives them.
- Text inside image/text cards no longer runs narrower than the
  original theme on mobile.

## [0.4.4] - 2026-07-19

### Fixed

- The light/dark mode toggle in the footer now actually switches the
  site's colors instead of silently doing nothing and leaving it on
  whatever the system preference was.

## [0.4.3] - 2026-07-19

### Fixed

- Stacked hero buttons on mobile no longer stretch edge-to-edge;
  they match the original theme's proportions.

## [0.4.2] - 2026-07-19

### Fixed

- Hero buttons now stay side-by-side at their natural size until the
  screen is narrow enough to stack, matching the original theme
  instead of stacking too early.

## [0.4.1] - 2026-07-19

### Fixed

- Hero text now matches the original theme's width and proportions on
  mobile and desktop — it was running noticeably narrower than
  intended.

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
