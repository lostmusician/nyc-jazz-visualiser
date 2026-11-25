import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import shapefile from 'shapefile';
import proj4 from 'proj4';

// Define NY Long Island State Plane Feet projection (EPSG:2263)
proj4.defs(
  'EPSG:2263',
  '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs'
);

const DATA_DIR = path.resolve('src/data/nhgis0001_csv');
const SHAPEFILE_1990_DIR = path.resolve('src/data/nyct1990');
const SHAPEFILE_2000_DIR = path.resolve('src/data/nyct2000');
const SHAPEFILE_2010_DIR = path.resolve('src/data/nyct2010_26c');
const SHAPEFILE_2020_DIR = path.resolve('src/data/nyct2020_26c');
const OUTPUT_DIR = path.resolve('public/data');
const OUTPUT_HISTORY_FILE = path.join(OUTPUT_DIR, 'nyc_rent_history.geojson');

const DECADE_MAPPINGS = {
  1980: { file: 'nhgis0001_ds104_1980_tract.csv', col: 'C8O001' },
  1990: { file: 'nhgis0001_ds120_1990_tract.csv', col: 'ES6001' },
  2000: { file: 'nhgis0001_ds151_2000_tract.csv', col: 'GBG001' },
  2010: { file: 'nhgis0001_ds176_20105_tract.csv', col: 'JSZE001' }, // 2006-2010 ACS 5-year
  2020: { file: 'nhgis0001_ds249_20205_tract.csv', col: 'AMVTE001' }, // 2016-2020 ACS 5-year
};

// BLS CPI-U annual averages (City Average, all items)
const CPI_U_ANNUAL = {
  1980: 82.4,
  1990: 130.7,
  2000: 172.2,
  2010: 218.056,
  2020: 258.811,
};

// Official Census top-code thresholds where median contract rent falls into an open-ended upper bracket
// Match exact sentinel codes (threshold + 1), not arbitrary values above a threshold.
// 1980: STF1 median code 501; https://assets.nhgis.org/original-data/modern-census/1980STF1.pdf
// 1990: STF3 Table H032B top bracket was $1,000+ (coded as 1001)
// 2000: SF3 Table H056A top bracket was $2,000+ (coded as 2001)
// 2010: ACS 5-year Table B25058 top bracket was $2,000+ (coded as 2001)
// 2020: ACS 5-year Table B25058 top bracket was $3,500+ (coded as 3501)
const RENT_CAP_THRESHOLDS = {
  1980: 500,
  1990: 1000,
  2000: 2000,
  2010: 2000,
  2020: 3500,
};

const NYC_COUNTIES = ['005', '047', '061', '081', '085'];
const BORO_NAMES = {
  '005': 'Bronx',
  '047': 'Brooklyn',
  '061': 'Manhattan',
  '081': 'Queens',
  '085': 'Staten Island',
};
const BORO_CODE_MAP = {
  '1': '061',
  '2': '005',
  '3': '047',
  '4': '081',
  '5': '085',
};

function transformCoords2263(coords) {
  if (typeof coords[0] === 'number') {
    const [lng, lat] = proj4('EPSG:2263', 'WGS84', coords);
    return [Math.round(lng * 1000000) / 1000000, Math.round(lat * 1000000) / 1000000];
  }
  return coords.map(transformCoords2263);
}

function cleanWgsCoords(coords) {
  if (typeof coords[0] === 'number') {
    return [Math.round(coords[0] * 1000000) / 1000000, Math.round(coords[1] * 1000000) / 1000000];
  }
  return coords.map(cleanWgsCoords);
}

async function parseCSV(filePath, rentColName, year) {
  const dataMap = new Map();
  const capThreshold = RENT_CAP_THRESHOLDS[year];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row['STATEA'] === '36' && NYC_COUNTIES.includes(row['COUNTYA'])) {
          let tracta = row['TRACTA'];
          if (tracta) {
            tracta = tracta.padEnd(6, '0');
            const geoid = `36${row['COUNTYA']}${tracta}`;
            const rentVal = parseInt(row[rentColName], 10);
            if (!isNaN(rentVal) && rentVal > 0) {
              const isCapped = rentVal === capThreshold + 1;
              // For capped open-ended brackets, the numeric observation represents a lower bound
              const lowerBoundNominal = isCapped && rentVal > capThreshold ? capThreshold : rentVal;
              const real2020 = Math.round(lowerBoundNominal * (CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[year]));

              dataMap.set(geoid, {
                nominal: lowerBoundNominal,
                rawRent: rentVal,
                isCapped,
                capThreshold: isCapped ? capThreshold : null,
                real2020,
              });
            }
          }
        }
      })
      .on('end', () => resolve(dataMap))
      .on('error', reject);
  });
}

async function extract1990Tracts(data1980, data1990) {
  const source = await shapefile.open(
    path.join(SHAPEFILE_1990_DIR, 'tr36_d90.shp'),
    path.join(SHAPEFILE_1990_DIR, 'tr36_d90.dbf')
  );

  const features1980 = [];
  const features1990 = [];

  let result = await source.read();
  while (!result.done) {
    const f = result.value;
    const county = f.properties.CO;
    if (f.properties.ST === '36' && NYC_COUNTIES.includes(county)) {
      const tractBase = (f.properties.TRACTBASE || '').padStart(4, '0');
      const tractSuf = (f.properties.TRACTSUF || '').padStart(2, '0');
      const tractCode = `${tractBase}${tractSuf}`;
      const geoid = `36${county}${tractCode}`;
      const boroName = BORO_NAMES[county];
      const coords = cleanWgsCoords(f.geometry.coordinates);

      const d80 = data1980.get(geoid);
      features1980.push({
        type: 'Feature',
        geometry: { type: f.geometry.type, coordinates: coords },
        properties: {
          geoid,
          boro: boroName,
          tract: tractCode,
          year: 1980,
          rent: d80?.nominal ?? null,
          rent_raw: d80?.rawRent ?? null,
          boundary_year: 1990,
          boundary_status: 'approximate',
          rent_is_capped: d80?.isCapped ?? false,
          rent_cap_threshold: d80?.capThreshold ?? null,
          rent_2020_dollars: d80?.real2020 ?? null,
          rent_1980: d80?.nominal ?? null,
          rent_is_capped_1980: d80?.isCapped ?? false,
          rent_2020_dollars_1980: d80?.real2020 ?? null,
        },
      });

      const d90 = data1990.get(geoid);
      features1990.push({
        type: 'Feature',
        geometry: { type: f.geometry.type, coordinates: coords },
        properties: {
          geoid,
          boro: boroName,
          tract: tractCode,
          year: 1990,
          rent: d90?.nominal ?? null,
          rent_raw: d90?.rawRent ?? null,
          boundary_year: 1990,
          rent_is_capped: d90?.isCapped ?? false,
          rent_cap_threshold: d90?.capThreshold ?? null,
          rent_2020_dollars: d90?.real2020 ?? null,
          rent_1990: d90?.nominal ?? null,
          rent_is_capped_1990: d90?.isCapped ?? false,
          rent_2020_dollars_1990: d90?.real2020 ?? null,
        },
      });
    }
    result = await source.read();
  }

  return { features1980, features1990 };
}

async function extract2000Tracts(data2000) {
  const source = await shapefile.open(
    path.join(SHAPEFILE_2000_DIR, 'tl_2010_36_tract00.shp'),
    path.join(SHAPEFILE_2000_DIR, 'tl_2010_36_tract00.dbf')
  );

  const features = [];
  let result = await source.read();
  while (!result.done) {
    const f = result.value;
    const county = f.properties.COUNTYFP00;
    if (f.properties.STATEFP00 === '36' && NYC_COUNTIES.includes(county)) {
      const geoid = f.properties.CTIDFP00;
      const tractCode = f.properties.TRACTCE00;
      const boroName = BORO_NAMES[county];
      const coords = cleanWgsCoords(f.geometry.coordinates);
      const d = data2000.get(geoid);

      features.push({
        type: 'Feature',
        geometry: { type: f.geometry.type, coordinates: coords },
        properties: {
          geoid,
          boro: boroName,
          tract: tractCode,
          year: 2000,
          rent: d?.nominal ?? null,
          rent_raw: d?.rawRent ?? null,
          boundary_year: 2000,
          rent_is_capped: d?.isCapped ?? false,
          rent_cap_threshold: d?.capThreshold ?? null,
          rent_2020_dollars: d?.real2020 ?? null,
          rent_2000: d?.nominal ?? null,
          rent_is_capped_2000: d?.isCapped ?? false,
          rent_2020_dollars_2000: d?.real2020 ?? null,
        },
      });
    }
    result = await source.read();
  }
  return features;
}

async function extract2010Tracts(data1980, data1990, data2000, data2010, data2020) {
  const source = await shapefile.open(
    path.join(SHAPEFILE_2010_DIR, 'nyct2010.shp'),
    path.join(SHAPEFILE_2010_DIR, 'nyct2010.dbf')
  );

  const features2010 = [];
  const featuresHistory = [];

  let result = await source.read();
  while (!result.done) {
    const feature = result.value;
    const boroCode = feature.properties.BoroCode;
    const tractCode = feature.properties.CT2010;

    if (boroCode && tractCode && BORO_CODE_MAP[boroCode]) {
      const county = BORO_CODE_MAP[boroCode];
      const geoid = `36${county}${tractCode}`;
      const boroName = feature.properties.BoroName;
      const coords = transformCoords2263(feature.geometry.coordinates);

      const d10 = data2010.get(geoid);
      features2010.push({
        type: 'Feature',
        geometry: { type: feature.geometry.type, coordinates: coords },
        properties: {
          geoid,
          boro: boroName,
          tract: tractCode,
          year: 2010,
          rent: d10?.nominal ?? null,
          rent_raw: d10?.rawRent ?? null,
          boundary_year: 2010,
          rent_is_capped: d10?.isCapped ?? false,
          rent_cap_threshold: d10?.capThreshold ?? null,
          rent_2020_dollars: d10?.real2020 ?? null,
          rent_2010: d10?.nominal ?? null,
          rent_is_capped_2010: d10?.isCapped ?? false,
          rent_2020_dollars_2010: d10?.real2020 ?? null,
        },
      });

      // Also construct backwards-compatible multi-decade history on 2010 shapes
      const d80 = data1980.get(geoid);
      const d90 = data1990.get(geoid);
      const d00 = data2000.get(geoid);
      const d20 = data2020.get(geoid);

      featuresHistory.push({
        type: 'Feature',
        geometry: { type: feature.geometry.type, coordinates: coords },
        properties: {
          geoid,
          boro: boroName,
          tract: tractCode,
          rent_1980: d80?.nominal ?? null,
          rent_is_capped_1980: d80?.isCapped ?? false,
          rent_2020_dollars_1980: d80?.real2020 ?? null,

          rent_1990: d90?.nominal ?? null,
          rent_is_capped_1990: d90?.isCapped ?? false,
          rent_2020_dollars_1990: d90?.real2020 ?? null,

          rent_2000: d00?.nominal ?? null,
          rent_is_capped_2000: d00?.isCapped ?? false,
          rent_2020_dollars_2000: d00?.real2020 ?? null,

          rent_2010: d10?.nominal ?? null,
          rent_is_capped_2010: d10?.isCapped ?? false,
          rent_2020_dollars_2010: d10?.real2020 ?? null,

          rent_2020: d20?.nominal ?? null,
          rent_is_capped_2020: d20?.isCapped ?? false,
          rent_2020_dollars_2020: d20?.real2020 ?? null,
        },
      });
    }
    result = await source.read();
  }

  return { features2010, featuresHistory };
}

async function extract2020Tracts(data2020) {
  const source = await shapefile.open(
    path.join(SHAPEFILE_2020_DIR, 'nyct2020.shp'),
    path.join(SHAPEFILE_2020_DIR, 'nyct2020.dbf')
  );

  const features = [];
  let result = await source.read();
  while (!result.done) {
    const f = result.value;
    const geoid = f.properties.GEOID;
    const tractCode = f.properties.CT2020;
    const boroName = f.properties.BoroName;
    const coords = transformCoords2263(f.geometry.coordinates);
    const d = data2020.get(geoid);

    features.push({
      type: 'Feature',
      geometry: { type: f.geometry.type, coordinates: coords },
      properties: {
        geoid,
        boro: boroName,
        tract: tractCode,
        year: 2020,
        rent: d?.nominal ?? null,
        rent_raw: d?.rawRent ?? null,
        boundary_year: 2020,
        rent_is_capped: d?.isCapped ?? false,
        rent_cap_threshold: d?.capThreshold ?? null,
        rent_2020_dollars: d?.real2020 ?? null,
        rent_2020: d?.nominal ?? null,
        rent_is_capped_2020: d?.isCapped ?? false,
        rent_2020_dollars_2020: d?.real2020 ?? null,
      },
    });

    result = await source.read();
  }
  return features;
}

async function processData() {
  const requiredInputs = [
    ...Object.values(DECADE_MAPPINGS).map(({ file }) => path.join(DATA_DIR, file)),
    ...[
      [SHAPEFILE_1990_DIR, 'tr36_d90'],
      [SHAPEFILE_2000_DIR, 'tl_2010_36_tract00'],
      [SHAPEFILE_2010_DIR, 'nyct2010'],
      [SHAPEFILE_2020_DIR, 'nyct2020'],
    ].flatMap(([directory, name]) => ['shp', 'dbf'].map((extension) => path.join(directory, `${name}.${extension}`))),
  ];
  const missingInputs = requiredInputs.filter((file) => !fs.existsSync(file));
  if (missingInputs.length) {
    throw new Error(`Cannot regenerate rent snapshots. Missing inputs:\n${missingInputs.map((file) => `  ${path.relative(process.cwd(), file)}`).join('\n')}\nSee README.md for the required boundary files. Normal dev/build commands use the generated public/data snapshots.`);
  }

  console.log('Parsing NHGIS tabular census datasets and applying top-code logic...');
  const data1980 = await parseCSV(path.join(DATA_DIR, DECADE_MAPPINGS[1980].file), DECADE_MAPPINGS[1980].col, 1980);
  const data1990 = await parseCSV(path.join(DATA_DIR, DECADE_MAPPINGS[1990].file), DECADE_MAPPINGS[1990].col, 1990);
  const data2000 = await parseCSV(path.join(DATA_DIR, DECADE_MAPPINGS[2000].file), DECADE_MAPPINGS[2000].col, 2000);
  const data2010 = await parseCSV(path.join(DATA_DIR, DECADE_MAPPINGS[2010].file), DECADE_MAPPINGS[2010].col, 2010);
  const data2020 = await parseCSV(path.join(DATA_DIR, DECADE_MAPPINGS[2020].file), DECADE_MAPPINGS[2020].col, 2020);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('\n--- Building Rent Snapshots (1980 uses approximate 1990 boundaries) ---');

  // 1980 & 1990
  console.log('Extracting 1980 & 1990 on 1990 boundaries (1980 geography is unvalidated)...');
  const { features1980, features1990 } = await extract1990Tracts(data1980, data1990);
  const geo1980 = { type: 'FeatureCollection', features: features1980 };
  const geo1990 = { type: 'FeatureCollection', features: features1990 };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'nyc_rent_1980.geojson'), JSON.stringify(geo1980));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'nyc_rent_1990.geojson'), JSON.stringify(geo1990));
  const m80 = features1980.filter((f) => f.properties.rent !== null).length;
  const m90 = features1990.filter((f) => f.properties.rent !== null).length;
  console.log(`  1980: ${m80} positive polygon features; unique coverage reported below`);
  console.log(`  1990: ${m90} positive polygon features; unique coverage reported below`);

  // 2000
  console.log('Extracting 2000 on period-appropriate boundaries...');
  const features2000 = await extract2000Tracts(data2000);
  const geo2000 = { type: 'FeatureCollection', features: features2000 };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'nyc_rent_2000.geojson'), JSON.stringify(geo2000));
  const m00 = features2000.filter((f) => f.properties.rent !== null).length;
  console.log(`  2000: ${features2000.length} features, ${m00} matched (${data2000.size} in source)`);

  // 2010 & History
  console.log('Extracting 2010 on period-appropriate boundaries...');
  const { features2010, featuresHistory } = await extract2010Tracts(data1980, data1990, data2000, data2010, data2020);
  const geo2010 = { type: 'FeatureCollection', features: features2010 };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'nyc_rent_2010.geojson'), JSON.stringify(geo2010));
  const m10 = features2010.filter((f) => f.properties.rent !== null).length;
  console.log(`  2010: ${features2010.length} features, ${m10} matched (${data2010.size} in source)`);

  // Backwards-compatible history GeoJSON
  const geoHistory = { type: 'FeatureCollection', features: featuresHistory };
  fs.writeFileSync(OUTPUT_HISTORY_FILE, JSON.stringify(geoHistory));
  console.log(`  History file: ${featuresHistory.length} features written to ${OUTPUT_HISTORY_FILE}`);

  // 2020
  console.log('Extracting 2020 on period-appropriate boundaries...');
  const features2020 = await extract2020Tracts(data2020);
  const geo2020 = { type: 'FeatureCollection', features: features2020 };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'nyc_rent_2020.geojson'), JSON.stringify(geo2020));
  const m20 = features2020.filter((f) => f.properties.rent !== null).length;
  console.log(`  2020: ${features2020.length} features, ${m20} matched (${data2020.size} in source)`);

  const coverage = {};
  for (const [year, features, source] of [
    [1980, features1980, data1980], [1990, features1990, data1990],
    [2000, features2000, data2000], [2010, features2010, data2010],
    [2020, features2020, data2020],
  ]) {
    const positive = features.filter((f) => f.properties.rent !== null);
    const ids = new Set(positive.map((f) => f.properties.geoid));
    const missing = [...source.keys()].filter((id) => !ids.has(id)).sort();
    coverage[year] = {
      sourcePositiveTracts: source.size,
      matchedUniqueTracts: ids.size,
      positivePolygonFeatures: positive.length,
      extraPolygonParts: positive.length - ids.size,
      missingTractIds: missing,
      boundaryYear: year === 1980 ? 1990 : year,
      geographyValidated: year !== 1980,
      // Retain anomalies for investigation rather than silently normalizing them.
      aboveThresholdNonSentinel: [...source.entries()]
        .filter(([, d]) => d.rawRent > RENT_CAP_THRESHOLDS[year] && !d.isCapped)
        .map(([geoid, d]) => ({ geoid, rawRent: d.rawRent })),
    };
    console.log(`  ${year}: ${ids.size}/${source.size} unique positive tracts; ${missing.length} unmatched`);
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'rent_coverage.json'), JSON.stringify(coverage, null, 2));
  console.log('\nData pipeline completed; see rent_coverage.json for coverage and limitations.');
}

processData().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
