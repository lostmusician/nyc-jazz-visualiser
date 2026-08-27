import shapefile from 'shapefile';

async function inspect() {
  const source = await shapefile.open('src/data/nyct2020_26c/nyct2020.shp', 'src/data/nyct2020_26c/nyct2020.dbf');
  const result = await source.read();
  console.log(JSON.stringify(result.value.properties, null, 2));
}

inspect().catch(console.error);
