# Rooms That Held the Night

An infinite, interactive gallery of New York jazz clubs. Archival club cards drift through a three-dimensional canvas around a translucent city map; the map, card highlights, scene filters, listening selections, and decade timeline share one application state. Each decade also has a four-beat, GSAP-powered scrollytelling chapter that guides the Mapbox camera between representative rooms before opening the filtered gallery.

The shared top timeline runs from the 1920s through the 2020s and groups decades into larger periods of New York history. Selecting a decade opens its story; finishing or skipping restores the gallery filtered to that decade. Scene filters trace Harlem, Swing Street and the Village, loft jazz, downtown avant-garde music, outer-borough networks, and contemporary rooms.

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

The production build regenerates `public/data/nyc_rent_history.geojson` from the preserved NHGIS source inputs before compiling the app.

## Architecture

- `src/infinite-canvas/` contains the adapted chunk-streaming WebGL gallery.
- `src/components/CentralMap.tsx` and `src/hooks/useMapbox.ts` render the synchronized Mapbox venue and rent layers.
- `src/components/DecadeStory.tsx` and `src/data/decadeStories.ts` pair ScrollTrigger-driven narration with curated venue clusters and explicit map cameras.
- `src/data/venues.ts` and its era-specific imports retain 78 sourced geographic records across Manhattan, Brooklyn, Queens, and the Bronx.
- `src/data/clubProfiles.ts` gives every sourced location a gallery card while keeping 16 launch profiles as the richer listening-research tier.
- `src/gallery/model.ts` owns decade overlap, lifecycle classification, and scene filtering.
- `src/data/nhgis0001_csv/`, `src/data/nyct2010_26c/`, and `src/data/nyct2020_26c/` preserve the rent-generation inputs.

The WebGL experience has a DOM club index for keyboard and screen-reader access and as a usable route when WebGL or Mapbox is unavailable. The first-visit tutorial must be completed before exploration; later replays are dismissible. Detail dialogs trap focus, close with Escape, and restore focus to their opener. Reduced-motion preferences suppress ambient camera drift, scroll scrubbing, and animated story camera flights.

## Data boundaries

- Residential shading uses median contract rent from IPUMS NHGIS, normalized to constant 2020 dollars with annual CPI-U. It is not commercial venue rent or proof of why a club closed.
- The rent layer is absent before 1980 because the preserved comparable census series begins in 1980; earlier housing pressure is conveyed through cited historical narration.
- Venue closure descriptions remain distinct from the rent layer and retain their source links where available.
- Listening items distinguish recordings made at a venue, documented performance relationships, and representative scene selections.
- Listening links open the cited external source; the interface maintains only one selected record at a time and clears it when the detail closes or the venue is filtered out.

## Infinite Canvas attribution

The canvas engine, deterministic chunk generation, movement model, distance/depth fading, texture approach, controls, touch detection, DPR limits, and render-distance behavior are adapted from [edoardolunardi/infinite-canvas](https://github.com/edoardolunardi/infinite-canvas), pinned to commit `4e710decd0a99b2e312c594668dd2ccc834764ee`.

That source is MIT licensed. The original notice is retained in `THIRD_PARTY_NOTICES/Codrops-Infinite-Canvas-LICENSE.txt`, and adapted source files carry commit-level headers.

## Stack

React 19.2, Three.js 0.182, React Three Fiber 9.4, Drei 10.7, TypeScript 5.9, Vite 7, Mapbox GL JS, and Playwright.
