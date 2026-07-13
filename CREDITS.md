# Credits & Attribution

© 2026 vhs. A port of Bravada, © 2020–25 Cryout Creations
([cryoutcreations.eu](https://www.cryoutcreations.eu)). Licensed under GPLv3.

This project is an EmDash/Astro port of the **Bravada** WordPress theme by
Cryout Creations. It derives its CSS and layout structure from Bravada, which
is licensed under the GNU General Public License v3 (or, at your option, any
later version). As a derivative work, this project is distributed under the
same licence — see [LICENSE](./LICENSE).

- **Bravada** — © 2020–25 Cryout Creations, GPL-3.0-or-later.
  <https://www.cryoutcreations.eu/wordpress-themes/bravada>

## Third-party components

None of the third-party components bundled with the upstream WordPress theme
(TGM-Plugin-Activation, html5shiv, FitVids.js, prepareTransition, IcoMoon,
Entypo, Feather, CSS social buttons, Bootstrap Icons) are included in this
port, so their licence terms do not attach here — with one exception: the
fallback link glyph in `src/components/SocialIcon.astro` is adapted from
Feather Icons (MIT, © Cole Bemis).

Webfonts (Mulish, Playfair Display, JetBrains Mono) are fetched at build time
via Astro's font pipeline; all three are licensed under the SIL Open Font
License 1.1.

## Images

All images in this repository — `public/images/demo/`, the seeded media
library, and the author avatar — are original generated artwork created for
this port (2026) and dedicated to the public domain (CC0). No upstream or
third-party imagery ships with this port.
