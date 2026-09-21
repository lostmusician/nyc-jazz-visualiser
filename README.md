# Fifths & Sevenths, Priced to the Nines

**Fifths & Sevenths, Priced to the Nines** is a scroll-led creative companion about one New York address: 77 Greene Street. It follows the cast-iron building from Rashied Ali’s artist-run loft, Studio 77 and Ali’s Alley, to its present use, then widens into a city archive of jazz venues and residential rent.

The active experience contains three elements:

- an archival visual history of 77 Greene Street;
- one illustrative ten-stub allocation of a sold-out night’s door;
- the existing citywide Mapbox venue and residential-rent archive.

Earlier listening, museum-room, audio, and club-interaction studies remain in the repository as research prototypes, but are not imported by the active route.

## Run locally

Use Node 20 and npm 10 or newer. Vite 6 does not run on older Node releases.

```bash
npm ci
cp .env.example .env
npm run dev
```

Add `VITE_MAPBOX_TOKEN` to `.env` to enable the City Archive. Without it, the story supplies an intentional map fallback.

Useful checks:

```bash
npm test
npm run lint
npm run build
npm run test:browser
```

`npm run build` first regenerates `public/data/nyc_rent_history.geojson` from the NHGIS inputs, then runs TypeScript and the Vite production build. Browser tests cover desktop, mobile emulation, and reduced motion.

## Narrative route

The semantic document is `Address → Room → Allocation → Present → City`.

- `#address`, `#room`, `#allocation`, and `#present` link to individual beats.
- `#map` opens the final City Archive directly.
- Legacy listening, clubs, economics, and `#room/*` links safely return to the beginning.

Mapbox is code-split and loads only as the visitor approaches the final chapter. Only the opening archival image is loaded eagerly; all other images use local desktop and mobile WebP variants.

## Allocation model

Ten ticket stubs represent 100% of an illustrative sold-out night’s door. Each stub is 10%; no unsupported historical dollar values are used.

- Property and rent: two-stub minimum, three-stub target.
- Artists: three-stub target.
- Room and workers: two-stub minimum, three-stub target.
- The next experimental night: two-stub target.

The four targets require eleven stubs, so no allocation protects every priority. The pure calculation and conservation rules live in `src/utils/nightAllocation.ts`; the complete method appears in the Sources drawer.

## Archival material

The active image manifest is `src/data/greeneStreet.ts`. Every asset records local variants, source URL, creator, date, credit, rights note, alt text, focal point, and narrative role.

- The historic tax photograph and present façade come from the NYC Landmarks Preservation Commission’s 77 Greene Street public-hearing record.
- The Ali’s Alley performance photograph and period poster come from Thomas Ager’s musicians portfolio.
- Current-use and dated rental evidence is linked to the StreetEasy building record.
- Background on Ali’s Alley and Survival Records is linked to Rashied Ali’s official biography.

These third-party images are retained locally for classroom scholarship; source metadata remains attached regardless of publication status.

## Data boundaries

- The building date, 1877, follows the NYC Landmarks record.
- The present-day section states current uses without claiming Ali’s Alley alone caused later property appreciation.
- Residential shading uses median contract rent from IPUMS NHGIS for 1980–2020. It is not presented as commercial venue rent or closure evidence.
- Venue histories and closure evidence remain separately sourced in the venue dataset and map drawer.
- The allocation is an interpretive model, not reconstructed bookkeeping.

## Active architecture

```text
src/
  components/AddressJourney.tsx       continuous address narrative
  components/InteractiveDataMap.tsx  lazy-loaded city archive
  data/greeneStreet.ts                archival manifest and beats
  data/venues.ts                      venue research
  styles/address-journey.css          active visual system
  utils/nightAllocation.ts            pure allocation model
public/archive/greene/                responsive archival images
tests/                                assets, model, routing, and browser journeys
```

React 19, TypeScript, Vite 6, Mapbox GL JS, and Playwright. Created for academic research and educational demonstration.
