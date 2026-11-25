# Rooms That Held the Night

An infinite, interactive gallery of New York jazz clubs. Archival club cards drift through a three-dimensional canvas around a translucent city map; the map, card highlights, scene filters, listening selections, soundtrack, and timeline share one application state. Each decade also has a four-beat, GSAP-powered scrollytelling chapter that guides the Mapbox camera between representative rooms before opening the filtered gallery.

The shared top timeline runs from the 1920s through the 2020s and groups decades into larger periods of New York history. Selecting a decade opens its story; the single “Explore” ending button plays the transition from the preceding decade into the decade just read, then opens its gallery. For example, the 1990s chapter plays 1980 → 1990. The 1920s open directly because no preceding decade is mapped. Skipping a story opens its gallery directly. Scene filters trace Harlem, Swing Street and the Village, loft jazz, downtown avant-garde music, outer-borough networks, and contemporary rooms.

## Run locally

Use Node 20.20 or newer and npm 10 or newer.

```bash
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_MAPBOX_TOKEN` in `.env` to enable the map. Without it, the gallery remains usable through an intentional map fallback and the DOM club index.

Checks:

```bash
npm test
npm run lint
npm run build
npm run test:browser
```

Development and production builds use the generated rent snapshots in `public/data/`; they do not require raw census shapefiles. Keep `nyc_rent_history.geojson`, all five `nyc_rent_1980.geojson` through `nyc_rent_2020.geojson` snapshots, and `rent_coverage.json` in Git together when updating the rent pipeline.

To regenerate the snapshots, run `npm run build:data`. This requires the preserved NHGIS CSV inputs and 2010/2020 boundaries, plus these optional local boundary files (the two folders are ignored by Git):

- `src/data/nyct1990/tr36_d90.shp` and `tr36_d90.dbf`
- `src/data/nyct2000/tl_2010_36_tract00.shp` and `tl_2010_36_tract00.dbf`

Regeneration fails with a list of missing inputs if those files are absent. Review and commit the generated snapshots and coverage report together; raw boundary files are not needed to run or build the app.

## Architecture

- `src/infinite-canvas/` contains the adapted chunk-streaming WebGL gallery. Card slots use a fixed venue catalog so filtering never assigns a surviving club to another club’s position.
- `src/components/DecadeTransition.tsx`, `src/infinite-canvas/ash-material.ts`, and `src/gallery/decade-transition.ts` implement the interlude: a seeded noise dissolve and texture-colored dust for selected closing cards, surviving cards that stay in place, and a quieter reveal for new rooms. The effect runs directly on the infinite gallery’s cards and keeps the same canvas, camera, and venue slots throughout. The gallery pauses behind stories and holds its camera still during transitions; particles are limited to cards near the visible frame. The map follows all dated venue records.
- `src/components/CentralMap.tsx` and `src/hooks/useMapbox.ts` render the synchronized Mapbox venue and rent layers.
- `src/components/DecadeStory.tsx` and `src/data/decadeStories.ts` pair ScrollTrigger-driven narration with curated venue clusters and explicit map cameras.
- `src/data/venues.ts` and its era-specific imports retain 78 sourced geographic records across Manhattan, Brooklyn, Queens, and the Bronx.
- `src/data/clubProfiles.ts` gives every sourced location a gallery card while keeping 16 launch profiles as the richer listening-research tier.
- `src/data/decadeSoundtracks.ts` keeps “Skating in Central Park” for the entrance and first gallery, then maps each selected decade to its representative soundtrack after that decade’s story opens. Playback is exposed through the global soundtrack control.
- `src/gallery/model.ts` owns decade overlap, lifecycle classification, and scene filtering.
- `src/data/nhgis0001_csv/`, `src/data/nyct2010_26c/`, and `src/data/nyct2020_26c/` preserve the rent-generation inputs.

The WebGL experience has a DOM club index for keyboard and screen-reader access and as a usable route when WebGL or Mapbox is unavailable. The first-visit tutorial must be completed before exploration; later replays are dismissible. Detail dialogs trap focus, close with Escape, and restore focus to their opener. Reduced-motion preferences suppress ambient camera drift, scroll scrubbing, and animated story camera flights.

## Data boundaries

- Residential shading uses median contract rent from IPUMS NHGIS, normalized to constant 2020 dollars with annual CPI-U. It is not commercial venue rent or proof of why a club closed.
- Rent snapshots use 1990, 2000, 2010, and 2020 tract boundaries for the corresponding years. **1980 remains approximate:** its values are matched by tract ID to 1990 boundaries, without a validated geographic conversion. Greater ID coverage does not establish boundary agreement. Do not use these snapshots to calculate tract-level changes across decades until geography is standardized.
- `public/data/rent_coverage.json` reports unique positive source tracts, unique matched tracts, extra polygon parts, and unmatched IDs. Multiple polygon features may represent one tract and must not inflate coverage or summary statistics.
- Raw rent values are preserved as `rent_raw`. Only exact upper-interval sentinel codes (`501`, `1001`, `2001`, `2001`, and `3501` respectively) are normalized to lower bounds and shown with `+`. The [1980 STF1 documentation](https://assets.nhgis.org/original-data/modern-census/1980STF1.pdf) identifies `501`; local 1980 values above $500 that do not match that code remain unchanged and are listed in the coverage report for investigation. Their interpretation is unresolved. See also [2010 ACS documentation](https://www2.census.gov/acs2010_SPT_AIAN/SelectedPopulationTables/ACS_SPT_SF_Tech_Doc.pdf) for `2001` and [ACS subject definitions](https://www2.census.gov/programs-surveys/acs/tech_docs/subject_definitions/2021_ACSSubjectDefinitions.pdf) for the `$3,500+` encoding. This handling concerns upper intervals; lower-interval encodings still require a separate audit.
- The 2010 and 2020 snapshots are 2006–2010 and 2016–2020 ACS five-year estimates, not single-year observations. Tooltips label these periods explicitly. No citywide household median is inferred from tract medians; previously added unused citywide benchmarks were removed because they lacked traceable table references.
- The rent layer is absent before 1980 because the preserved comparable census series begins in 1980; earlier housing pressure is conveyed through cited historical narration.
- Venue closure descriptions remain distinct from the rent layer and retain their source links where available.
- Listening items distinguish recordings made at a venue, documented performance relationships, and representative scene selections.
- “Skating in Central Park” plays through the entrance and first gallery view. Once a decade’s story is opened, its representative soundtrack continues when the reader returns to the filtered gallery. The club-detail turntable is currently hidden until unique club tracks are sourced. Club-specific research selections remain labeled external listening links and do not claim that an era soundtrack was recorded in each room.

The interlude uses one shared clock for card erosion and map-marker changes. It pauses in hidden tabs, can be skipped or interrupted by selecting a decade, and uses short opacity changes without particles for reduced motion. Without WebGL, a brief text summary leads to the accessible gallery. The preceding decade’s rent snapshot stays fixed until the interlude ends, and hollow markers retain the most recent closures as discoverable traces. No transition is extrapolated beyond the 2020s.

## Infinite Canvas attribution

The canvas engine, deterministic chunk generation, movement model, distance/depth fading, texture approach, controls, touch detection, DPR limits, and render-distance behavior are adapted from [edoardolunardi/infinite-canvas](https://github.com/edoardolunardi/infinite-canvas), pinned to commit `4e710decd0a99b2e312c594668dd2ccc834764ee`.

That source is MIT licensed. The original notice is retained in `THIRD_PARTY_NOTICES/Codrops-Infinite-Canvas-LICENSE.txt`, and adapted source files carry commit-level headers.

## Record player attribution

The dormant club-detail turntable adapts the circle-intersection tonearm geometry and lift/drag/drop behavior from [Codrops RecordPlayer](https://github.com/codrops/RecordPlayer) to React, TypeScript, and Pointer Events. It remains hidden until unique club tracks are sourced. No visual assets, fonts, effects, or recordings from that experiment are redistributed. The MIT attribution is retained in `THIRD_PARTY_NOTICES/Codrops-RecordPlayer-NOTICE.txt`.

## Stack

React 19.2, Three.js 0.182, React Three Fiber 9.4, Drei 10.7, TypeScript 5.9, Vite 7, Mapbox GL JS, and Playwright.
