# Bravada·Astro

Bravada for Astro: a port of the
[Bravada](https://www.cryoutcreations.eu/wordpress-themes/bravada) WordPress
theme (Cryout Creations) to [Astro](https://astro.build), powered by
[EmDash](https://emdashcms.com) and built on the EmDash blog template. Runs on
any Node.js server with SQLite and local file storage.

The port carries Bravada's visual language — Playfair Display headings over
Mulish body text, the teal/gold palette, the gold-ribbon wordmark, highlighter
title sweeps, ghost section headers, the slow zoom-under-teal image hover, the
dark footer — and rebuilds its **landing page as EmDash sections**: reusable
blocks editors drop into any Portable Text field with the `/section` command.

## Landing-page sections

Bravada's front-page elements map to four custom Portable Text block types,
each seeded as a section:

| Section (`/section`) | Block type | Bravada original |
|---|---|---|
| Hero banner | `bravada.hero` | LP slider / static slider |
| Icon blocks | `bravada.blocks` | LP blocks |
| Featured boxes | `bravada.boxes` | LP boxes (animated) |
| Text band | `bravada.text` | LP text areas |

The homepage renders the page with slug `home` full-width above the latest
posts — the seed ships one assembled from the four sections. Edit, reorder or
delete bands there like any other content; delete the page to fall back to a
plain blog front page. Sections work in posts and pages too, on any site the
schema grows into (the CMS content model is data, so extra collections scale
without theme changes).

Block components live in `src/components/blocks/` and are registered in
`src/components/RichText.astro` (use it wherever editor content renders).
Image fields on hero/boxes blocks take a URL — a media-library file URL or an
external one.

## Structure

- `seed/seed.json` — collections (posts, pages), category/tag taxonomies,
  primary + social menus, sidebar/footer widget areas, the Bravada sections,
  and sample content (a `home` landing page + demo posts).
- `src/styles/theme.css` — the Bravada design tokens and signature styles.
  All colors use `light-dark()`; dark mode is automatic.
- `src/styles/tokens.css` — template defaults (don't edit; override in theme.css).

## Pages

| Page | Route |
|---|---|
| Homepage (landing + latest) | `/` |
| All posts | `/posts` |
| Single post | `/posts/:slug` |
| Category / tag archive | `/category/:slug`, `/tag/:slug` |
| Search | `/search` |
| Static pages | `/pages/:slug` |

## Run

```bash
pnpm install
npx emdash dev            # localhost:4321, admin at /_emdash/admin
npx emdash seed seed/seed.json   # apply sample content without the setup wizard
```

Full-text search, RSS, SEO/JSON-LD, comments-ready routes, dark/light mode and
the audit-log plugin come from the underlying blog template.

## License

© 2026 vhs. A port of Bravada, © 2020–25
[Cryout Creations](https://www.cryoutcreations.eu). Licensed under
GPL-3.0-or-later — see [LICENSE](./LICENSE) for the full text and
[CREDITS.md](./CREDITS.md) for attribution details.
