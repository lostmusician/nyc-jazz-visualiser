# Rooms That Held the Night: NYC Jazz Visualiser

> An interactive, infinite 3D visual archive and spatial cartography of over a century of New York City's jazz ecosystem—from 1920s Harlem speakeasies to modern outer-borough lofts.

Archival club photography drifts through a three-dimensional WebGL space surrounding an interactive city map. The 3D canvas, map clusters, neighborhood rent heatmaps, synchronized decade soundtracks, and chronological timeline share a unified reactive state.

---

## Motivation & Story Behind the Project

This project was born out of a personal love for music—especially jazz—and a memorable school trip to New York City.

During the trip, wandering through historical venues and experiencing live jazz events across Manhattan and Brooklyn revealed how deeply intertwined the music is with the geography and socioeconomic history of the city. Visiting the interactive music exhibit at the **Museum of the City of New York (MCNY)** left a lasting impression: seeing how multimedia, archival storytelling, and spatial geography could come together to make cultural history feel alive and tactile.

*Rooms That Held the Night* was built to capture that experience:
- How jazz in NYC was never static in one neighborhood—it moved from Harlem during Prohibition and the Renaissance, to the fever pitch of 52nd Street swing, into Greenwich Village basements and Lower East Side lofts, and out to modern community hubs in Brooklyn, Queens, and the Bronx.
- How changing urban realities—from historical cabarets and blue laws to rising residential rents and gentrification—continually displaced and reshaped where artists could play.

---

## Key Features

### 1. Infinite 3D Archival Canvas
- **Immersive 3D Space**: Built on WebGL / Three.js, club cards and historical imagery drift through coordinate space.
- **Fluid Multi-Modal Navigation**: Navigate using keyboard controls (**WASD** to pan up/down/left/right, **E/Q** to move through depth) or natural mouse gestures (click & drag to pan, wheel/pinch to travel through depth).

### 2. Synchronized Cartography & Rent Economics
- **Interactive 5-Borough Map**: Powered by Mapbox GL JS, visualising 78 researched historical and contemporary venues across Manhattan, Brooklyn, Queens, and the Bronx.
- **Historical Census Rent Layer**: Visualizes U.S. Census median contract rent data from IPUMS NHGIS across census tracts, normalized to constant 2020 dollars via annual CPI-U. Illustrates how rising rents correlated with neighborhood displacement and rebirth across decades.

### 3. Synchronized Vinyl Soundtrack with Physics & Equal Loudness
- **Authentic Decade Soundtracks**: Each era features a curated signature track—from 1920s King Oliver to 1950s Miles Davis, 1970s loft fusion, and modern revivals.
- **Balanced Loudness Mastering**: Track volumes are normalized using ITU-R BS.1770 / EBU R128 (-19.7 LUFS baseline) with custom Web Audio API gain adjustment to eliminate jarring volume spikes across recordings.
- **Realistic Vinyl Spin-Down**: Turntable button incorporates realistic deceleration physics and tonearm mechanics when muting or unmuting.

### 4. Guided Scrollytelling Stories (1920s–2020s)
- **11 Curated Eras**: Traverse from the 1920s Harlem Renaissance to the 2020s modern scene.
- **Camera-Driven Chapters**: Each decade features four-beat narrative chapters that guide the map camera through representative clubs before returning to the filtered canvas.

---

## Quick Start (Run Locally)

Prerequisites: Node 20.20+ and npm 10+.

```bash
# Install dependencies
npm ci

# Configure environment variables
cp .env.example .env

# Run local development server
npm run dev
```

> **Note**: Add a Mapbox access token as `VITE_MAPBOX_TOKEN` in your `.env` to enable the interactive map tiles. If omitted, the app gracefully falls back to an accessible token-free mode and the DOM club browser.

### Quality Checks & Testing

```bash
# Run unit and integration tests (30 test suites)
npm test

# Run ESLint
npm run lint

# Compile and verify production build
npm run build

# Run Playwright browser automation tests
npm run test:browser
```

The production build script automatically re-processes and validates the NHGIS census rent datasets into `public/data/nyc_rent_history.geojson` before compiling the bundle.

---

## Architecture & Codebase

- `src/infinite-canvas/`: WebGL canvas engine with chunk-streaming, depth attenuation, and multi-input navigation.
- `src/components/CentralMap.tsx` & `src/hooks/useMapbox.ts`: Synchronized Mapbox choropleth rent shading and venue marker layers.
- `src/components/DecadeStory.tsx` & `src/data/decadeStories.ts`: GSAP ScrollTrigger-driven decade scrollytelling beats with choreographed map camera targets.
- `src/data/venues.ts`: Sourced geographic coordinates, operational years, neighborhood scenes, and historical closure records for 78 NYC jazz venues.
- `src/data/clubProfiles.ts`: Comprehensive venue cards and archival research tiers.
- `src/data/decadeSoundtracks.ts` & `src/hooks/useGallerySoundtrack.ts`: Curated decade audio tracks with Web Audio gain calibration and spin-down physics.
- `src/gallery/model.ts`: Decade boundaries, lifecycle filtering (`active`, `closed`, `future`), and scene taxonomies.
- `scripts/process_census_data.js`: IPUMS NHGIS census data processing script.

---

## Historical Data & Sourcing Boundaries

- **Residential Rent vs Commercial Rent**: Residential rent shading uses median contract rent from IPUMS NHGIS, normalized to 2020 dollars with annual CPI-U. This represents neighborhood residential cost trends rather than commercial venue leases, providing historical context on community displacement.
- **Census Boundaries**: The comparable census tract series begins in 1980; earlier housing pressures and redlining are conveyed through cited historical narration and documentation.
- **Venue Closure Records**: Venue histories and closure descriptions document researched historical records and preserve source citations.
- **Listening Selections**: Track selections distinguish between recordings captured live at a venue, documented performer relationships, and era-representative listening pieces.

---

## Credits & Attributions

- **Infinite Canvas Engine**: Adapted from [edoardolunardi/infinite-canvas](https://github.com/edoardolunardi/infinite-canvas) (MIT License, preserved in `THIRD_PARTY_NOTICES/Codrops-Infinite-Canvas-LICENSE.txt`).
- **Tonearm & Turntable Geometry**: Adapted from [Codrops RecordPlayer](https://github.com/codrops/RecordPlayer) (MIT License, preserved in `THIRD_PARTY_NOTICES/Codrops-RecordPlayer-NOTICE.txt`).
- **Census & Demographic Data**: U.S. Census Bureau data retrieved via [IPUMS NHGIS](https://www.nhgis.org/).
- **Archival Imagery & Music**: Sourced from public domain archives, Library of Congress, and historical collections.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber (R3F), Drei
- **Mapping & GIS**: Mapbox GL JS, GeoJSON
- **Animation & Audio**: GSAP (ScrollTrigger), Web Audio API
- **Testing**: Node Test Runner, Playwright
