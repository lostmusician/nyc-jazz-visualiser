import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { CLUB_PROFILES } from '../src/data/clubProfiles';
import { NYC_JAZZ_VENUES } from '../src/data/venues';

test('launch collection contains 16 complete, uniquely linked profiles', () => {
  assert.equal(CLUB_PROFILES.length, 16);
  assert.equal(new Set(CLUB_PROFILES.map((profile) => profile.venueId)).size, 16);
  const venueIds = new Set(NYC_JAZZ_VENUES.map((venue) => venue.properties.id));
  for (const profile of CLUB_PROFILES) {
    assert.ok(venueIds.has(profile.venueId));
    assert.ok(profile.description.length > 40);
    assert.ok(profile.imageAlt.length > 10);
    assert.ok(profile.imageSourceUrl.startsWith('http'));
    assert.ok(existsSync(`public${decodeURIComponent(profile.image)}`), profile.image);
    assert.ok(profile.tracks.length >= 1 && profile.tracks.length <= 3);
  }
});

test('every listening selection carries playback, evidence, and relationship metadata', () => {
  const tracks = CLUB_PROFILES.flatMap((profile) => profile.tracks);
  assert.equal(new Set(tracks.map((track) => track.id)).size, tracks.length);
  for (const track of tracks) {
    assert.match(track.listenUrl, /^https:\/\//);
    assert.match(track.evidenceUrl, /^https:\/\//);
    assert.ok(track.artist && track.title && track.note);
    assert.ok(['recorded-at-venue', 'documented-performance', 'representative-of-scene'].includes(track.relationship));
  }
});
