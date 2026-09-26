import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { CLUB_PROFILES, GALLERY_PROFILES } from '../src/data/clubProfiles';
import { NYC_JAZZ_VENUES } from '../src/data/venues';
import { VILLAGE_PRESERVATION_IMPORT } from '../src/data/villagePreservationVenues';

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

test('all 78 sourced locations have distinct gallery records', () => {
  assert.equal(GALLERY_PROFILES.length, 78);
  assert.equal(new Set(GALLERY_PROFILES.map((profile) => profile.venueId)).size, 78);
  assert.ok(GALLERY_PROFILES.every((profile) => profile.description.length > 40));
  assert.ok(GALLERY_PROFILES.every((profile) => existsSync(`public${decodeURIComponent(profile.image)}`)));
});

test('outer-borough additions cover Brooklyn, Queens, and the Bronx with source provenance', () => {
  const outerBoroughVenues = NYC_JAZZ_VENUES.filter((venue) => venue.properties.id.startsWith('outer-'));
  assert.equal(outerBoroughVenues.length, 12);
  assert.deepEqual(new Set(outerBoroughVenues.map((venue) => venue.properties.borough)), new Set(['Brooklyn', 'Queens', 'Bronx']));
  assert.ok(outerBoroughVenues.every((venue) => venue.properties.source_url?.startsWith('https://')));
  assert.ok(outerBoroughVenues.every((venue) => venue.properties.source_publisher));
  assert.ok(outerBoroughVenues.every((venue) => venue.properties.open_year !== null));
  assert.equal(outerBoroughVenues.find((venue) => venue.properties.id === 'outer-845-club')?.properties.status, 'closed');
  assert.equal(outerBoroughVenues.find((venue) => venue.properties.id === 'outer-flushing-town-hall')?.properties.venue_type, 'cultural_center');
});

test('contemporary additions retain source provenance and active status', () => {
  const currentVenues = NYC_JAZZ_VENUES.filter((venue) => venue.properties.id.startsWith('current-'));
  assert.equal(currentVenues.length, 15);
  assert.ok(currentVenues.every((venue) => venue.properties.source_url?.startsWith('https://')));
  assert.ok(currentVenues.every((venue) => venue.properties.source_publisher));
  assert.ok(currentVenues.every((venue) => venue.properties.status === 'open'));
  assert.ok(currentVenues.every((venue) => venue.properties.open_year !== null));
});

test('early-era additions retain source provenance and document only researched closure causes', () => {
  const earlyVenues = NYC_JAZZ_VENUES.filter((venue) => venue.properties.id.startsWith('early-'));
  assert.equal(earlyVenues.length, 9);
  assert.ok(earlyVenues.every((venue) => venue.properties.source_url?.startsWith('https://')));
  assert.ok(earlyVenues.every((venue) => venue.properties.source_publisher));
  for (const id of ['early-connies-inn', 'early-smalls-paradise', 'early-savoy-ballroom', 'early-royal-roost']) {
    assert.ok(earlyVenues.find((venue) => venue.properties.id === id)?.properties.closing_reason);
  }
});

test('researched Village closures retain reasons and direct source provenance', () => {
  const researchedIds = [
    'vp-bottom-line',
    'vp-cafe-society',
    'vp-cookery',
    'vp-eddie-condons',
    'vp-lush-life',
    'vp-nicks-tavern',
  ];

  for (const id of researchedIds) {
    const venue = NYC_JAZZ_VENUES.find((entry) => entry.properties.id === id);
    assert.ok(venue?.properties.closing_reason);
    assert.ok(venue?.properties.source_url?.startsWith('https://'));
    assert.notEqual(venue?.properties.source_publisher, VILLAGE_PRESERVATION_IMPORT.sourcePublisher);
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
