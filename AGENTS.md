This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
pnpm dev              # Start dev server (runs migrations, seeds, generates types)
npx emdash types      # Regenerate TypeScript types from schema
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).

## Changelog

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and SemVer. New work goes under `## [Unreleased]` in an `### Added` / `### Changed` / `### Fixed` / `### Documentation` subsection -- one of each per section, never a second heading of the same name.

- **Write it for humans, not for the diff.** Each entry says what changed for someone using the site and, where it isn't obvious, why it matters. No file paths, function names, table names, SQL, or how it was investigated -- that detail belongs in the commit message body, which is where the reasoning and the measurements go.
- **Only the most recent section is editable.** Released sections are a record. Don't reword, re-punctuate, or "fix" them; a change in style applies from the top section onward, otherwise the file looks inconsistent.
- **Match the punctuation already there.** Em dashes are fine and the file uses them -- roughly one per section, as a single dash setting off a consequence or an aside. Don't bracket a phrase with a pair of them; use parentheses. Don't stack several into one section.
- **Wrap around 72 characters**, continuation lines indented two spaces under the bullet.
- **Say "the theme"**, not "the demo", when referring to the Bravada source being ported.

## Releases

Releases are cut from `main` and tagged `vX.Y.Z`.

- **Three version strings move together**, because this theme ships a plugin: `package.json`, the plugin entry's `version` in `astro.config.mjs`, and `version` in `src/plugins/bravada-theme/index.ts`. Missing one has shipped before -- v0.5.0 had to correct a plugin declaring `0.4.0` against a `0.4.5` package.
- `CHANGELOG.md`: `## [Unreleased]` becomes `## [X.Y.Z] - YYYY-MM-DD`.
- Commit as `Release X.Y.Z`, tag `vX.Y.Z`, push both.
- **Cut the GitHub release only after CI is green and the demo has been redeployed and smoke tested**, in that order. The demo deploys from the `deploy/cloudflare` branch, which merges `main`.
- **The release title takes an en dash, never an em dash**, with lowercase comma-separated themes after it: `v0.6.0 – SEO audit pass, canonical redirects, EmDash 0.33.0`.
- Release body: a one-line intro, `### Heads up` for breaking changes and manual steps, then `### Added` / `### Fixed` / `### Changed` / `### Documentation` with each bullet leading in **bold**, closing with `**Full changelog:** <compare link>`. Keep em dashes to a minimum here, unlike the changelog.

## This Template

A blog with posts, pages, categories, tags, full-text search, and RSS, restyled as a port of the Bravada WordPress theme (Cryout Creations): magazine-style landing sections and a real article structure with bylines and reading time.

## Visual character

Two faces carry the Bravada pairing: **Playfair Display** on `--font-display` for headings (`theme.css` aliases `--font-heading` to it) and **Mulish** on `--font-body` for body text -- the display/body contrast carries the hierarchy. **JetBrains Mono** on `--font-mono` for inline code and code blocks.

The brand colour is Bravada's gold `#E9B44C` (`--color-brand`) -- links, buttons, highlights -- with teal `#0F8B8D` on `--color-brand-hover` (lightened to `#3db9bb` in dark mode). The palette deliberately follows the original Bravada demo, not WCAG adjustments -- read the notes at the top of `theme.css` before "fixing" contrast.

Single posts use Bravada's blog layout: the article body sits on a white card (`--color-surface`) over the page tint, paired with a right sidebar rendered by `SidebarWidgets` from the `sidebar-b` widget area (Search, Recent Posts, and a tabbed widget -- the same Bravada widgets the two-sidebar layout pages use, so the post and page sidebars share styling and content). Author and date run inline in the article header (no separate meta column); body copy is `--font-size-base` (16px); a gold-strip **Related Posts** heading leads into the full-bleed image previous/next band that meets the footer. This deliberately mirrors the Bravada demo -- do not reintroduce the base template's three-column reading view.

## Customisation

Design tokens live in `src/styles/tokens.css` with their default values. To restyle the site, override tokens in `src/styles/theme.css` -- declarations there are unlayered, so they always beat the `@layer base` defaults. Don't edit `tokens.css` or `Base.astro` for visual changes.

Colours are defined with `light-dark(<light>, <dark>)`, so each token carries both modes. Overriding with a plain colour changes light and dark at once; use `light-dark()` in the override to keep them distinct. There is no separate dark palette to maintain.

Webfonts are configured in `astro.config.mjs` under `fonts:` -- Mulish is bound to `cssVariable: "--font-body"`, Playfair Display to `--font-display`, and JetBrains Mono to `--font-mono`. To swap a face, change the `name:` on the corresponding entry; to restyle without touching the font pipeline, override `--font-heading` or `--font-body` in `theme.css`. All three shipped faces are SIL OFL 1.1 (credited in `CREDITS.md`) -- if you substitute a commercial face, make sure you hold a webfont licence for it.

CSS variables worth knowing (see `tokens.css` for the full list):

- `--color-brand`, `--color-brand-hover`, `--color-on-brand`, `--color-brand-ring`
- `--color-bg`, `--color-bg-subtle`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-muted`, `--color-border`, `--color-border-subtle`
- `--font-body`, `--font-heading`, `--font-display`, `--font-mono`
- `--font-weight-heading` / `--font-weight-display` -- heading weights (Playfair runs at 700)
- `--tracking-tight` / `--tracking-snug` / `--tracking-wide` / `--tracking-wider` -- letter-spacing tokens used across headings and meta labels
- `--content-width` (680px) -- article body column (single-post card content)
- `--wide-width` (1200px) -- max container
- `--sidebar-width` (320px) -- the blog/page right sidebar (`SidebarWidgets`)
- `--avatar-size-{xs,sm,md,lg}` -- byline avatar sizes at different scales

## What not to do

- Don't add accents beyond Bravada's pair -- gold `#E9B44C` and teal `#0F8B8D` -- and don't "correct" the palette for WCAG contrast; fidelity to the original demo wins here.
- Don't replace the Playfair Display / Mulish pairing with novelty faces. The serif-display-over-sans contrast is the Bravada signature.
- Don't reintroduce the base template's three-column article layout (left meta column + centred body + right gutter); single posts follow the Bravada blog layout (white card + right `sidebar-b`).
- Don't use stock blog copy ("Welcome to my blog", "Stay tuned for more"). Write a real tagline that says what this blog is about.
- Don't seed the home page with three identical placeholder posts. If you only have one real post, show one real post.
- Don't enable comments without a plan to moderate them. The template doesn't ship a comments system by default for a reason.
