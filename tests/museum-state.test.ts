import assert from 'node:assert/strict';
import test from 'node:test';
import { parseMuseumRoute, routeHash } from '../src/hooks/useMuseumRouter.ts';
import {
  MUSEUM_VISIT_V1_KEY,
  MUSEUM_VISIT_V2_KEY,
  readMuseumVisit,
  writeMuseumVisit,
} from '../src/utils/museumVisitState.ts';

const memoryStorage = (initial: Record<string, string> = {}) => {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    values,
  };
};

test('museum hashes resolve to stable routes and unknown hashes fail closed', () => {
  assert.equal(parseMuseumRoute(''), 'entrance');
  assert.equal(parseMuseumRoute('#foyer'), 'foyer');
  assert.equal(parseMuseumRoute('#room/listening'), 'listening');
  assert.equal(parseMuseumRoute('#room/clubs'), 'clubs');
  assert.equal(parseMuseumRoute('#room/economics'), 'economics');
  assert.equal(parseMuseumRoute('#room/map'), 'map');
  assert.equal(parseMuseumRoute('#room/unknown'), 'entrance');
  assert.equal(routeHash('map'), '#room/map');
});

test('v1 visit state migrates progress without silently enabling audio', () => {
  const storage = memoryStorage({
    [MUSEUM_VISIT_V1_KEY]: JSON.stringify({
      completedExhibits: ['listening', 'invalid'],
      visitedVenueIds: ['0003'],
      pollChoice: 'b',
      audioMuted: false,
    }),
  });
  assert.deepEqual(readMuseumVisit(storage), {
    completedExhibits: ['listening'],
    visitedVenueIds: ['0003'],
    pollChoice: 'b',
    audioPreference: 'unasked',
  });
});

test('v2 state takes precedence and persists the explicit audio preference', () => {
  const storage = memoryStorage({
    [MUSEUM_VISIT_V1_KEY]: JSON.stringify({ completedExhibits: ['map'] }),
    [MUSEUM_VISIT_V2_KEY]: JSON.stringify({
      completedExhibits: ['clubs'], visitedVenueIds: [], pollChoice: null, audioPreference: 'on',
    }),
  });
  const visit = readMuseumVisit(storage);
  assert.equal(visit.audioPreference, 'on');
  assert.deepEqual(visit.completedExhibits, ['clubs']);
  writeMuseumVisit(storage, { ...visit, audioPreference: 'off' });
  assert.equal(JSON.parse(storage.values.get(MUSEUM_VISIT_V2_KEY) || '{}').audioPreference, 'off');
});

test('corrupt stored data returns a safe empty visit', () => {
  const storage = memoryStorage({ [MUSEUM_VISIT_V2_KEY]: '{broken' });
  assert.deepEqual(readMuseumVisit(storage), {
    completedExhibits: [], visitedVenueIds: [], pollChoice: null, audioPreference: 'unasked',
  });
});
