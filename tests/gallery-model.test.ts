import assert from 'node:assert/strict';
import test from 'node:test';
import { NYC_JAZZ_VENUES } from '../src/data/venues';
import { JAZZ_ERAS, eraForDecade } from '../src/data/eras';
import { DECADE_STORIES } from '../src/data/decadeStories';
import { GALLERY_VENUE_IDS } from '../src/data/clubProfiles';
import {
  DECADES,
  filterGalleryVenues,
  HISTORICAL_VENUE_MIN_ZOOM,
  isVenueVisibleAtZoom,
  overlapsDecade,
  statusForDecade,
} from '../src/gallery/model';

const venue = (id: string) => {
  const match = NYC_JAZZ_VENUES.find((item) => item.properties.id === id);
  assert.ok(match, `missing venue ${id}`);
  return match;
};

test('preserves all 78 geographic venue records', () => {
  assert.equal(NYC_JAZZ_VENUES.length, 78);
});

test('timeline includes the Harlem Renaissance, Swing Street, and bebop decades', () => {
  const cottonClub = venue('early-cotton-club');
  const hickoryHouse = venue('early-hickory-house');
  const downbeat = venue('early-downbeat-club');
  assert.equal(overlapsDecade(cottonClub, 1920), true);
  assert.equal(overlapsDecade(hickoryHouse, 1930), true);
  assert.equal(overlapsDecade(downbeat, 1940), true);
});

test('every timeline decade has sourced city context', () => {
  assert.deepEqual(Object.keys(JAZZ_ERAS).map(Number), [...DECADES]);
  for (const decade of DECADES) {
    const era = eraForDecade(decade);
    assert.ok(era.summary.length > 120);
    assert.ok(era.cityImpact.length > 80);
    assert.ok(era.sources.length >= 1);
    assert.ok(era.sources.every((source) => source.url.startsWith('https://')));
  }
});

test('every decade has four valid, sourced scrollytelling beats', () => {
  const venueIds = new Set(NYC_JAZZ_VENUES.map((item) => item.properties.id));
  assert.deepEqual(Object.keys(DECADE_STORIES).map(Number), [...DECADES]);
  for (const decade of DECADES) {
    const story = DECADE_STORIES[decade];
    assert.equal(story.beats.length, 4);
    assert.equal(story.decade, decade);
    assert.ok(story.historicalPhase.length > 5);
    for (const beat of story.beats) {
      assert.ok(beat.title.length > 5);
      assert.ok(beat.body.length > 60);
      assert.ok(Number.isFinite(beat.camera.center[0]));
      assert.ok(Number.isFinite(beat.camera.center[1]));
      assert.ok(beat.camera.zoom > 0);
      assert.ok(beat.venueIds.length > 0);
      assert.ok(beat.venueIds.every((id) => venueIds.has(id)), `${decade} references an unknown venue`);
      assert.ok(beat.historicalContext.length > 5);
      assert.ok(beat.role.length > 3);
      assert.equal(beat.rentContext?.state, decade < 1980 ? 'unavailable' : 'available');
      assert.ok(beat.sources?.every((source) => source.url.startsWith('https://')));
      if (beat.pullQuote) {
        assert.ok(beat.pullQuote.speaker);
        assert.ok(beat.pullQuote.source);
        assert.ok(beat.pullQuote.url.startsWith('https://'));
      }
    }
    assert.ok(story.beats.at(-1)?.sources?.every((source) => source.url.startsWith('https://')));
  }
});

test('early chapters distinguish rent parties, wartime New York, and the postwar turn', () => {
  assert.match(DECADE_STORIES[1920].beats.map((beat) => beat.body).join(' '), /rent parties/i);
  assert.match(DECADE_STORIES[1930].beats.map((beat) => beat.body).join(' '), /Depression/);
  assert.equal(DECADE_STORIES[1940].beats[0].role, 'wartime');
  assert.equal(DECADE_STORIES[1940].beats[3].role, 'postwar_change');
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

test('map visibility shows active clubs first and reveals earlier clubs at neighborhood zoom', () => {
  const birdland = venue('0020');
  const tonic = venue('0006');

  assert.equal(isVenueVisibleAtZoom(birdland, 1960, 10.25), true);
  assert.equal(isVenueVisibleAtZoom(birdland, 1970, 10.25), false);
  assert.equal(isVenueVisibleAtZoom(birdland, 1970, HISTORICAL_VENUE_MIN_ZOOM - 0.01), false);
  assert.equal(isVenueVisibleAtZoom(birdland, 1970, HISTORICAL_VENUE_MIN_ZOOM), true);
  assert.equal(isVenueVisibleAtZoom(tonic, 1970, 16), false);
  assert.equal(isVenueVisibleAtZoom(tonic, 1970, 10.25, true), true);
});

test('gallery filtering combines featured, decade, and scene constraints', () => {
  const all1970s = filterGalleryVenues(NYC_JAZZ_VENUES, GALLERY_VENUE_IDS, 1970, 'all');
  const lofts1970s = filterGalleryVenues(NYC_JAZZ_VENUES, GALLERY_VENUE_IDS, 1970, 'loft_jazz');
  assert.ok(all1970s.length > lofts1970s.length);
  assert.ok(all1970s.length >= 20, `expected a dense 1970s gallery, received ${all1970s.length} venues`);
  assert.ok(lofts1970s.length > 0);
  assert.ok(lofts1970s.every((item) => item.properties.scene_movement === 'loft_jazz'));
  assert.ok(lofts1970s.every((item) => GALLERY_VENUE_IDS.has(item.properties.id)));
});
