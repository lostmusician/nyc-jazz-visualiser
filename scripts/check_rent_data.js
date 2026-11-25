import fs from 'node:fs';

const requiredFiles = [
  'nyc_rent_history.geojson',
  ...[1980, 1990, 2000, 2010, 2020].map((year) => `nyc_rent_${year}.geojson`),
  'rent_coverage.json',
];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(new URL(`../public/data/${file}`, import.meta.url)));

if (missingFiles.length) {
  console.error(`Missing generated rent data:\n${missingFiles.map((file) => `  public/data/${file}`).join('\n')}\nRestore these files from Git, or run npm run build:data with the raw census inputs installed (see README.md). Commit the snapshots and coverage report together.`);
  process.exitCode = 1;
}
