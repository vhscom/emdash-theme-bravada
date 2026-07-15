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

## Base template

This port was scaffolded from the EmDash blog starter
([`@emdash-cms/template-blog`](https://github.com/emdash-cms/templates)),
which is distributed for scaffolding new sites via `create-astro`. At the
time of writing the templates repository declares no explicit licence
(the EmDash CMS itself is MIT); template-derived structure is included
here on the basis of that intended scaffolding use.

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

`public/images/demo/` originally shipped flat gradient/abstract placeholder
artwork (CC0, generated for this port). The 2026 imagery refresh replaced
most of these files with real photography sourced from Wikimedia Commons,
Openverse, and StockSnap, matching the original Bravada demo's photographic
identity. The seeded media library and author avatar are unaffected and
remain CC0.

### CC BY / CC BY-SA — attribution required

Most replacement photos are CC0 and need no credit (see below). The ones
in this table are CC BY, CC BY-SA, or public domain and **do** require
attribution — keep it current when swapping any of these files. Sorted by
filename.

| File(s) | Description | Author | License | Source |
|---|---|---|---|---|
| `about-header.jpg`, `featured-boxes-06*.jpg` | Glacial valley, Tierra del Fuego, Argentina | Godot13 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:ARG-2016-Aerial-Tierra_del_Fuego_(Ushuaia)%E2%80%93Valle_Carbajal_01.jpg) |
| `about-intro.jpg` | Aerial panorama over a fjord at golden hour, Flakstad, Lofoten, Norway | Ximonic (Simo Räsänen) | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Wide_view_over_Hovdanvika,_Selfjorden_and_Torsfjorden_at_Fredvang_in_Flakstad,_Nordland,_Norway,_2022_June.jpg) |
| `contact-header.jpg`, `demo-image-09.jpg` | Sandy lagoon, Havelock Island, Andaman Islands | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Havelock_Island,_Sandy_lagoon,_Andaman_Islands.jpg) |
| `demo-image-02*.jpg` ("Throught the lens") | Monte Averau at sunset, Dolomites, Italy | Ximonic (Simo Räsänen) | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Averau_from_Fedare_at_Passo_Giau,_Belluno,_Veneto,_Italy,_2025_October.jpg) |
| `demo-image-04*.jpg` ("A bird's eye view") | Hot-air balloons over Cappadocia at sunrise | Benh LIEU SONG | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Cappadocia_Aerial_View_Landscape.jpg) |
| `demo-image-07.jpg` ("Without looking both ways") | Shibuya Scramble Crossing, Tokyo | Benh LIEU SONG | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg) |
| `featured-boxes-01*.jpg` | Mountain lake, Western Caucasus, Russia | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Karachay-Cherkessia,_Western_Caucasus,_Mountain_Lake,_Clouds.jpg) |
| `featured-boxes-02*.jpg` | Misty forest path at Viševnik, Slovenia | Dreamy Pixel | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Walking_on_a_misty_forest_path_at_Vi%C5%A1evnik.jpg) |
| `featured-boxes-03*.jpg`, `mirrorlake.jpg` | Misty mountain lake, Adirondacks, NY | Anne LaBastille / U.S. National Archives | Public Domain | [Commons](https://commons.wikimedia.org/wiki/File:EARLY_FALL_MORNING_WITH_MIST_BELOW_COLVIN_MOUNTAIN_AT_LITTLE_MOOSE_LAKE,_NEAR_INDIAN_LAKE_AND_CEDAR_RIVER_FLOW_-_NARA_-_554752.jpg) |
| `featured-boxes-07*.jpg` | Aerial view of the Himalayas, Himachal Pradesh, India | Timothy A. Gonsalves | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Shivaliks_Himalayas_Aerial_Dehaze_Himachal_Feb20_R16_02827.jpg) |
| `featured-boxes-08*.jpg`, `square_house.jpg` | Machu Picchu, Peru | Diego Delso | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Machu_Picchu,_Per%C3%BA,_2015-07-30,_DD_47.JPG) |
| `static.jpg` (site-wide hero/header) | Karst peaks over a sea of clouds at sunrise, Vang Vieng, Laos | Basile Morin | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Karst_peaks_with_sea_of_clouds_at_sunrise,_South_view_from_the_top_of_Mount_Nam_Xay,_Vang_Vieng,_Laos.jpg) |
| `wheel_phone.jpg` | Hot-air balloon silhouette at sunrise, Luxor, Egypt | Marcosleal; derivative by Pro2 | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Balloon_over_Luxor_-_Egypt_denoised.jpg) |

### CC0 / public domain — no attribution required

Everything else in `public/images/demo/` is CC0 or public domain:

- **Homepage content images** — `square_forest.jpg`, `square_presentation.jpg`
  (laptop and coffee, "Never put it down" text band), `square_presentation-300x300.jpg`
  (letterpress wood type blocks, footer/homepage "About Us" widget).
- **Portfolio pieces** — `portfolio-01.jpg` / `portfolio-01-512x512.jpg`
  (Manhattan skyline aerial, "New York vol. 27") and `portfolio-02.jpg`
  through `portfolio-12.jpg`.
- **Shop apparel** — `T_1.jpg` through `T_7.jpg` and `hoodie_1.jpg` through
  `hoodie_7.jpg` (front/back pairs), sourced from a Wikimedia Commons
  Philippines retail photoset, rawpixel, and Flickr/StockSnap.
- **Shop posters and CD/vinyl** — `poster_1_up.jpg` through `poster_5_up.jpg`
  and `cd_1_angle.jpg` through `cd_6_angle.jpg` (with their flat-detail
  pairs), sourced from StockSnap and Wikimedia Commons.
- **Post thumbnails not listed in the table above** — the remaining
  `demo-image-*.jpg` files.

Every gallery's second product image (`*_back`, `*_flat`) is a cropped
detail of the same source photo as its `*_front`/`*_up`/`*_angle`
counterpart, not a separate photo — it carries the same licence as its
parent and isn't listed as its own row.

The three testimonial avatar images (`team-member02/03/04.jpeg`) remain the
original CC0 gradient placeholder artwork — deliberately not replaced with
real people's photos, since these back fictional customer testimonials.
