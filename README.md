# The Vanishing Cadence: Mapping NYC Jazz & Spatial Displacement (1950–Present)

> An interactive digital humanities scrollytelling platform and spatial cartography exploring the hyper-gentrification of New York City and the spatial displacement of its historical jazz sanctuaries.

Developed as an **Independent Study Module (ISM)** in Digital Humanities, Urban Sociology, and Spatial Cartography.

---

## 🎷 Overview & Narrative Thesis

From the Harlem ballrooms and 52nd Street speakeasies of the 1940s–50s to the deindustrialized artist-run lofts of 1970s SoHo/NoHo and the contemporary diaspora into Bed-Stuy and Gowanus, live jazz in New York City has always mirrored the shifting economic geography of the metropolis.

**The Vanishing Cadence** moves away from sterile data visualization, adopting a warm, tactile, archival sketchbook aesthetic. It combines qualitative oral histories and hand-drawn musician portraits with quantitative census tract median contract rent data from IPUMS NHGIS (1980–2020) to visualize how real estate rezoning, escalating triple-net commercial leases, and luxury condominium redevelopments systematically priced out cultural sanctuaries.

---

## ✨ Key Features & Architecture

### 1. Tactile Archival Design System
- **Editorial Color Palette**: Aged parchment paper (`#f5efe2`), deep roast espresso ink (`#1c140e`), burnished brass accents (`#c59b4c`), and faded archival crimson (`#a63d2b`).
- **Curated Typography**: Mix of classical editorial serifs (*Fraunces*, *Playfair Display*), hand-lettered survey notes (*Kalam*, *Caveat*), and archival monospace typewriter metadata (*Special Elite*).
- **Organic Skeuomorphism**: Noise grain overlays, washi tape badges, paper stamp seals, and subtle micro-jitter animations.

### 2. Hand-Drawn Geometric & Line-Art Sketches (`rough.js` + SVG)
- **Generative Instrument Art**: Wobbly, hand-sketched wire sculptures of instruments (Saxophone with curled neck and open key cups, Trumpet, Upright Bass, Piano keys, and Drum Kit) rendered dynamically via `rough.js`.
- **Iconic Musician Portraits**: Reference-matched line-art homages to **Miles Davis**, **John Coltrane & Thelonious Monk** (duo), and **Billie Holiday**.

### 3. Minimalist Horizontal Scrollytelling Timeline
- **Pinned Horizontal Flow**: Uses `framer-motion` scroll transforms (`useScroll`, `useTransform`) to pin the viewport and translate horizontally as the user scrolls down, inspired by editorial web experiences like *rewildyourself.com*.
- **Four Historical Eras**:
  1. **1950s — The Golden Epicenter**: Harlem ballrooms and 52nd Street's "Swing Street" density.
  2. **1970s — The Loft Resistance**: Sam Rivers' *Studio Rivbea*, *Ali's Alley*, and artist cooperatives in deindustrialized NoHo/SoHo.
  3. **1990s–2000s — The Rezoning Avalanche**: Downtown hyper-gentrification and the closure of *Tonic*, *Bradley's*, and *55 Bar*.
  4. **2010s–Present — Acoustic Diaspora**: Cross-river migration into Brooklyn (*Sistas' Place*, *Barbès*, *Roulette*).

### 4. Interactive Spatial Displacement & Choropleth Map
- **Historical Rent Choropleth**: 2,165 NYC census tract polygons dynamically shaded according to median contract rent across five decades ($100/mo light archival paper $\rightarrow$ $3,200+/mo deep espresso).
- **Era Slider (1950s–2020s)**: Scrub through time to watch gentrification waves wash over Manhattan and into Brooklyn.
- **▶ Play History Autoplay**: Automated temporal animation that walks through history decade-by-decade.
- **Era-Responsive Venue Lifecycle Pins**:
  - **Active & Thriving**: Glowing brass pin with an animated pulsing sound-wave ring and archival paper label.
  - **Lost / Displaced in Era**: Transforms into a ghost footprint with dashed styling, strike-through name, and a vintage `[LOST IN YEAR]` tombstone badge.
  - **Future / Unfounded**: Cleanly hidden in earlier eras to maintain chronological fidelity.
- **Dual WebGL + DOM Rendering**: Native GPU-accelerated Mapbox circle and symbol layers guarantee zero clipping, while HTML DOM elements provide tactile pulsing halos.
- **Scene Movement Filters**: Filter between *Harlem Jazz*, *Bebop & 52nd St*, *Loft Movement*, *Downtown Avant-Garde*, and *Brooklyn Diaspora*.
- **Archival Detail Drawer**: Interactive modal card displaying venue lifespans, exact street addresses, historical oral history quotes, displacement records, and camera zoom triggers.
- **Census Tract Hover Tooltips**: Real-time inspection of tract number, borough, and exact median rent values for the active decade.

---

## 🗺️ Data Pipeline & Cartographic Methodology

### Spatial Reprojection (`scripts/process_census_data.js`)
- **Census Boundary Source**: NYC Department of City Planning Census Tract Shapefiles (`nyct2010_26c`).
- **Coordinate Conversion**: Raw shapefiles in **EPSG:2263** (New York Long Island State Plane Feet: `[~1,000,000, ~200,000]`) are automatically converted to standard **WGS84 / EPSG:4326** (`[lng, lat]`) using `proj4` and rounded to 6 decimal places.
- **NHGIS Census Harmonization**: Streams and joins 5 decades of IPUMS NHGIS tabular census datasets:
  - **1980**: STF1 Table NT44 (`C8O001` - Median Contract Rent)
  - **1990**: STF1 Table NH32B (`ES6001` - Median Contract Rent)
  - **2000**: SF3 Table NH056A (`GBG001` - Median Contract Rent)
  - **2010**: ACS 5-Year Table B25058 (`JSZE001` - Median Contract Rent)
  - **2020**: ACS 5-Year Table B25058 (`AMVTE001` - Median Contract Rent)
- **Output**: Minified, web-ready GeoJSON stored in `public/data/nyc_rent_history.geojson`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Dev Server** | [Vite 6](https://vite.dev/) |
| **Cartography & WebGL** | [Mapbox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/) |
| **Animation & Transitions** | [Framer Motion](https://www.framer.com/motion/) |
| **Hand-Drawn Graphics** | [Rough.js](https://roughjs.com/) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design System Tokens |
| **GIS & Data Processing** | [`proj4`](https://github.com/proj4js/proj4), [`shapefile`](https://github.com/mbostock/shapefile), [`csv-parser`](https://github.com/mafintosh/csv-parser) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- A free [Mapbox Access Token](https://account.mapbox.com/)

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/ivanchiew/nyc-jazz-visualiser.git
cd nyc-jazz-visualiser
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Mapbox access token:
```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNrdGV4YW1wbGUifQ.example_token
```

### 3. Run Data Preprocessing
Generate the reprojected WGS84 GeoJSON containing census tract geometries and historical rent data:
```bash
npm run build:data
```
*(Note: This step runs automatically prior to `npm run dev` and `npm run build`).*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```text
nyc-jazz-visualiser/
├── public/
│   └── data/
│       └── nyc_rent_history.geojson      # Output reprojected WGS84 choropleth dataset
├── scripts/
│   └── process_census_data.js            # Node script for Shapefile reprojection & NHGIS join
├── src/
│   ├── components/
│   │   ├── sketches/
│   │   │   ├── MusicianSketches.tsx      # Line art portraits (Miles, Coltrane, Monk, Billie)
│   │   │   ├── SaxophoneSketch.tsx       # Wire sculpture rough.js tenor saxophone
│   │   │   ├── SketchDoodles.tsx         # Staff lines, coffee stains, archival stamps
│   │   │   └── TrumpetSketch.tsx         # Hand-drawn rough.js trumpet
│   │   ├── HeroWelcome.tsx               # Opening archival hero section
│   │   ├── HorizontalTimeline.tsx        # Framer-Motion horizontal scrollytelling section
│   │   ├── InteractiveDataMap.tsx        # Full-screen choropleth map & era slider HUD
│   │   ├── MapCanvas.tsx                 # Base Mapbox container
│   │   ├── NarrativeCard.tsx             # Archival chapter card component
│   │   └── Scrollyteller.tsx             # Vertical scrollytelling engine
│   ├── data/
│   │   ├── chapters.ts                   # Narrative era definitions & map camera coordinates
│   │   ├── venues.ts                     # Comprehensive NYC jazz club dataset & lifespans
│   │   ├── nhgis0001_csv/                # Raw IPUMS NHGIS Census tabular data (1980–2020)
│   │   ├── nyct2010_26c/                 # 2010 Census Tract ESRI Shapefiles
│   │   └── nyct2020_26c/                 # 2020 Census Tract ESRI Shapefiles
│   ├── hooks/
│   │   ├── useMapbox.ts                  # Core Mapbox GL hook with WebGL + DOM layers
│   │   └── useScrollObserver.ts          # Viewport intersection & scroll progress tracker
│   ├── types/
│   │   └── index.ts                      # TypeScript definitions (Venues, Chapters, Cameras)
│   ├── App.tsx                           # Root application component
│   ├── index.css                         # Design tokens, fonts, marker CSS & vintage filters
│   └── main.tsx                          # React entrypoint
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 Historical Data Sources & References
- **Institute of Jazz Studies (Rutgers University)**: Oral histories and venue documentation.
- **IPUMS NHGIS (National Historical Geographic Information System)**: US Census tract demographic and median contract rent data (1980, 1990, 2000, 2010, 2020).
- **NYC Department of City Planning (Bytes of the Big Apple)**: Census tract boundary shapefiles.
- **The New York Times & The Village Voice Archives (1955–2022)**: Real estate notices, commercial lease dispute reports, and venue obituaries.
- **Design Inspiration**: *rewildyourself.com* (editorial horizontal motion and tactile typography).

---

## 📄 License
Created for academic research and educational demonstration purposes. Data and oral history quotes remain property of their respective archives and copyright holders.
