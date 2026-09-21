import assert from 'node:assert/strict';
import test from 'node:test';
import { NYC_JAZZ_VENUES } from '../src/data/venues';
import { FEATURED_VENUE_IDS } from '../src/data/clubProfiles';
import { filterGalleryVenues, overlapsDecade, statusForDecade } from '../src/gallery/model';

const venue = (id: string) => {
  const match = NYC_JAZZ_VENUES.find((item) => item.properties.id === id);
  assert.ok(match, `missing venue ${id}`);
  return match;
};

test('preserves all 42 geographic venue records', () => {
  assert.equal(NYC_JAZZ_VENUES.length, 42);
});

test('decade overlap includes either boundary year', () => {
  const birdland = venue('0020');
  assert.equal(overlapsDecade(birdland, 1950), true);
  assert.equal(overlapsDecade(birdland, 1960), true);
  assert.equal(overlapsDecade(birdland, 1970), false);
});

test('lifecycle classification distinguishes future, active, and closed venues', () => {
  const tonic = venue('0006');
  assert.equal(statusForDecade(tonic, 1970), 'future');
  assert.equal(statusForDecade(tonic, 2000), 'active');
  assert.equal(statusForDecade(tonic, 2010), 'closed');
});

test('gallery filtering combines featured, decade, and scene constraints', () => {
  const all1970s = filterGalleryVenues(NYC_JAZZ_VENUES, FEATURED_VENUE_IDS, 1970, 'all');
  const lofts1970s = filterGalleryVenues(NYC_JAZZ_VENUES, FEATURED_VENUE_IDS, 1970, 'loft_jazz');
  assert.ok(all1970s.length > lofts1970s.length);
  assert.ok(lofts1970s.length > 0);
  assert.ok(lofts1970s.every((item) => item.properties.scene_movement === 'loft_jazz'));
  assert.ok(lofts1970s.every((item) => FEATURED_VENUE_IDS.has(item.properties.id)));
});
