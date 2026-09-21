import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { GREENE_ARCHIVAL_ASSETS, GREENE_ARCHIVE_HOTSPOTS, GREENE_FACADE_COMPARISON, GREENE_SOURCES, GREENE_VENUE_RELATIONSHIPS } from '../src/data/greeneStreet.ts';
import { NYC_JAZZ_VENUES } from '../src/data/venues.ts';
import { addressBeatFromHash, clampFacadeReveal } from '../src/utils/addressJourney.ts';

test('all archival assets have a complete source record, alt text, and local variants', () => {
  for (const item of GREENE_ARCHIVAL_ASSETS) {
    assert.match(item.sourceUrl, /^https:\/\//);
    assert.ok(item.creator.length > 2);
    assert.ok(item.alt.length > 15);
    assert.ok(item.rightsNote.length > 10);
    for (const src of [item.src, item.mobileSrc]) {
      assert.ok(existsSync(join(process.cwd(), 'public', src.replace(/^\//, ''))), `${src} is missing`);
    }
  }
});

test('prepared facade variants exist and reveal positions clamp at both edges', () => {
  for (const variant of [GREENE_FACADE_COMPARISON.historic, GREENE_FACADE_COMPARISON.present]) {
    assert.ok(existsSync(join(process.cwd(), 'public', variant.src.replace(/^\//, ''))));
    assert.ok(existsSync(join(process.cwd(), 'public', variant.mobileSrc.replace(/^\//, ''))));
  }
  assert.equal(clampFacadeReveal(-12), 0);
  assert.equal(clampFacadeReveal(48), 48);
  assert.equal(clampFacadeReveal(140), 100);
});

test('every displayed venue relationship is confirmed, resolvable, and sourced', () => {
  const venueIds = new Set(NYC_JAZZ_VENUES.map((venue) => venue.properties.id));
  assert.equal(GREENE_VENUE_RELATIONSHIPS.length, 3);
  for (const relationship of GREENE_VENUE_RELATIONSHIPS) {
    assert.equal(relationship.confirmed, true);
    assert.ok(venueIds.has(relationship.fromVenueId));
    assert.ok(venueIds.has(relationship.toVenueId));
    assert.match(relationship.source.url, /^https:\/\//);
    assert.ok(relationship.source.locator.length > 10);
    assert.ok(relationship.source.evidenceExcerpt.length > 30);
  }
  assert.ok(GREENE_SOURCES.some((source) => source.id === 'heller-loft-era'));
  assert.ok(GREENE_SOURCES.some((source) => source.id === 'abdullah-interview'));
});

test('archive hotspots resolve to an archival object or a source record', () => {
  const knownIds = new Set([
    ...GREENE_ARCHIVAL_ASSETS.map((item) => item.id),
    ...GREENE_SOURCES.map((source) => source.id),
  ]);
  for (const hotspot of GREENE_ARCHIVE_HOTSPOTS) assert.ok(knownIds.has(hotspot.sourceId), hotspot.sourceId);
});

test('legacy museum hashes enter the address while the map hash remains direct', () => {
  for (const hash of ['#listening', '#clubs', '#economics', '#room/listening', '#room/clubs', '#room/economics']) {
    assert.equal(addressBeatFromHash(hash), 'address');
  }
  assert.equal(addressBeatFromHash('#map'), 'city');
  assert.equal(addressBeatFromHash('#allocation'), 'allocation');
  assert.equal(addressBeatFromHash('#present'), 'present');
});
