import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import shapefile from 'shapefile';
import proj4 from 'proj4';

// Define NY Long Island State Plane Feet projection
proj4.defs(
  'EPSG:2263',
  '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs'
);

const DATA_DIR = path.resolve('src/data/nhgis0001_csv');
const SHAPEFILE_2010_DIR = path.resolve('src/data/nyct2010_26c');
const OUTPUT_FILE = path.resolve('public/data/nyc_rent_history.geojson');

const DECADE_MAPPINGS = {
  1980: { file: 'nhgis0001_ds104_1980_tract.csv', col: 'C8O001' },
  1990: { file: 'nhgis0001_ds120_1990_tract.csv', col: 'ES6001' },
  2000: { file: 'nhgis0001_ds151_2000_tract.csv', col: 'GBG001' },
  2010: { file: 'nhgis0001_ds176_20105_tract.csv', col: 'JSZE001' }, // 2006-2010 ACS
  2020: { file: 'nhgis0001_ds249_20205_tract.csv', col: 'AMVTE001' }  // 2016-2020 ACS
};

const CPI_U_ANNUAL = { 1980: 82.4, 1990: 130.7, 2000: 172.2, 2010: 218.056, 2020: 258.811 };
const in2020Dollars = (rent, year) => rent ? Math.round(rent * (CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[year])) : null;

const NYC_COUNTIES = ['005', '047', '061', '081', '085'];

function transformCoords(coords) {
  if (typeof coords[0] === 'number') {
    const [lng, lat] = proj4('EPSG:2263', 'WGS84', coords);
    // Round to 6 decimals (~0.1m precision) to keep geojson lightweight and clean
    return [Math.round(lng * 1000000) / 1000000, Math.round(lat * 1000000) / 1000000];
  }
  return coords.map(transformCoords);
}

async function parseCSV(filePath, rentColName) {
  return new Promise((resolve, reject) => {
    const dataMap = new Map();
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
              dataMap.set(geoid, rentVal);
            }
          }
        }
      })
      .on('end', () => resolve(dataMap))
      .on('error', reject);
  });
}

async function processData() {
  console.log('Parsing NHGIS CSV files...');
  const rentDataByDecade = {};

  for (const [year, config] of Object.entries(DECADE_MAPPINGS)) {
    const filePath = path.join(DATA_DIR, config.file);
    if (fs.existsSync(filePath)) {
      console.log(`- Parsing ${year}...`);
      rentDataByDecade[year] = await parseCSV(filePath, config.col);
    } else {
      console.warn(`! Missing data file for ${year}: ${filePath}`);
    }
  }

  console.log('Reading 2010 Shapefile and reprojecting to WGS84...');
  const source2010 = await shapefile.open(
    path.join(SHAPEFILE_2010_DIR, 'nyct2010.shp'),
    path.join(SHAPEFILE_2010_DIR, 'nyct2010.dbf')
  );

  const geojson = {
    type: "FeatureCollection",
    features: []
  };

  const boroMap = {
    '1': '061', // Manhattan
    '2': '005', // Bronx
    '3': '047', // Brooklyn
    '4': '081', // Queens
    '5': '085'  // Staten Island
  };

  let result = await source2010.read();
  while (!result.done) {
    const feature = result.value;
    const boroCode = feature.properties.BoroCode;
    const tractCode = feature.properties.CT2010;
    
    if (boroCode && tractCode && boroMap[boroCode]) {
      const geoid = `36${boroMap[boroCode]}${tractCode}`;
      
      // Reproject coordinates from NY Long Island State Plane to WGS84
      if (feature.geometry && feature.geometry.coordinates) {
        feature.geometry.coordinates = transformCoords(feature.geometry.coordinates);
      }

      const nominalRents = Object.fromEntries(Object.keys(DECADE_MAPPINGS).map((year) => [year, rentDataByDecade[year]?.get(geoid) || null]));
      const props = {
        geoid: geoid,
        boro: feature.properties.BoroName,
        tract: tractCode,
        rent_1980: nominalRents['1980'],
        rent_1990: nominalRents['1990'],
        rent_2000: nominalRents['2000'],
        rent_2010: nominalRents['2010'],
        rent_2020: nominalRents['2020'],
        rent_2020_dollars_1980: in2020Dollars(nominalRents['1980'], 1980),
        rent_2020_dollars_1990: in2020Dollars(nominalRents['1990'], 1990),
        rent_2020_dollars_2000: in2020Dollars(nominalRents['2000'], 2000),
        rent_2020_dollars_2010: in2020Dollars(nominalRents['2010'], 2010),
        rent_2020_dollars_2020: in2020Dollars(nominalRents['2020'], 2020),
      };
      
      feature.properties = props;
      geojson.features.push(feature);
    }
    
    result = await source2010.read();
  }

  if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(geojson));
  console.log(`Successfully reprojected and wrote ${geojson.features.length} tract features to ${OUTPUT_FILE}`);
}

processData().catch(console.error);
