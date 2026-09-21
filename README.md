# Rooms That Held the Night

An infinite, interactive gallery of New York jazz clubs. Archival club cards drift through a three-dimensional canvas around a translucent city map; the map, card highlights, scene filters, listening selections, and decade timeline share one application state.

The default view opens in the 1970s. Choose a decade from the 1950s through the 2020s to change the featured clubs, each venue's lifecycle state, and the residential-rent layer. Scene filters trace Harlem, Swing Street and the Village, loft jazz, downtown avant-garde music, Brooklyn continuation, and contemporary rooms.

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
- `src/data/venues.ts` and `src/data/villagePreservationVenues.ts` retain the 42 geographic source records.
- `src/data/clubProfiles.ts` is a separate presentation layer for the 16 launch profiles and their listening research.
- `src/gallery/model.ts` owns decade overlap, lifecycle classification, and scene filtering.
- `src/data/nhgis0001_csv/`, `src/data/nyct2010_26c/`, and `src/data/nyct2020_26c/` preserve the rent-generation inputs.

The WebGL experience has a DOM club index for keyboard and screen-reader access and as a usable route when WebGL or Mapbox is unavailable. Detail dialogs trap focus, close with Escape, and restore focus to their opener. Reduced-motion preferences suppress ambient camera drift.

## Data boundaries

- Residential shading uses median contract rent from IPUMS NHGIS. It is not commercial venue rent or proof of why a club closed.
- Pre-1980 map values are an explicit visual extrapolation because the preserved census series begins in 1980.
- Venue closure descriptions remain distinct from the rent layer and retain their source links where available.
- Listening items distinguish recordings made at a venue, documented performance relationships, and representative scene selections.
- Listening links open the cited external source; the interface maintains only one selected record at a time and clears it when the detail closes or the venue is filtered out.

## Infinite Canvas attribution

The canvas engine, deterministic chunk generation, movement model, distance/depth fading, texture approach, controls, touch detection, DPR limits, and render-distance behavior are adapted from [edoardolunardi/infinite-canvas](https://github.com/edoardolunardi/infinite-canvas), pinned to commit `4e710decd0a99b2e312c594668dd2ccc834764ee`.

That source is MIT licensed. The original notice is retained in `THIRD_PARTY_NOTICES/Codrops-Infinite-Canvas-LICENSE.txt`, and adapted source files carry commit-level headers.

## Stack

React 19.2, Three.js 0.182, React Three Fiber 9.4, Drei 10.7, TypeScript 5.9, Vite 7, Mapbox GL JS, and Playwright.
