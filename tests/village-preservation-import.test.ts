import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VILLAGE_PRESERVATION_IMPORT,
  VILLAGE_PRESERVATION_VENUES,
} from '../src/data/villagePreservationVenues.ts';

test('Village Preservation import stays scoped and traceable', () => {
  assert.equal(VILLAGE_PRESERVATION_VENUES.length, VILLAGE_PRESERVATION_IMPORT.importedCount);
  assert.match(VILLAGE_PRESERVATION_IMPORT.sourceUrl, /^https:\/\//);

  const ids = VILLAGE_PRESERVATION_VENUES.map((venue) => venue.properties.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const venue of VILLAGE_PRESERVATION_VENUES) {
    assert.equal(venue.properties.source_url, VILLAGE_PRESERVATION_IMPORT.sourceUrl);
    assert.equal(venue.properties.source_publisher, VILLAGE_PRESERVATION_IMPORT.sourcePublisher);
    assert.match(venue.properties.notes ?? '', /date label:/i);
    assert.equal(venue.properties.closing_reason, null);
    assert.equal(venue.properties.borough, 'Manhattan');
    assert.equal(venue.geometry.coordinates.length, 2);
    assert.ok(Number.isFinite(venue.geometry.coordinates[0]));
    assert.ok(Number.isFinite(venue.geometry.coordinates[1]));
  }
});

test('approximate source labels remain visible after year normalization', () => {
  const approximateIds = ['vp-east-village-in', 'vp-hot-feet-club', 'vp-open-door', 'vp-pepper-pot', 'vp-stuyvesant-casino'];
  for (const id of approximateIds) {
    const venue = VILLAGE_PRESERVATION_VENUES.find((candidate) => candidate.properties.id === id);
    assert.ok(venue, `missing ${id}`);
    assert.match(venue.properties.notes ?? '', /normalized|approximately/i);
  }
});
