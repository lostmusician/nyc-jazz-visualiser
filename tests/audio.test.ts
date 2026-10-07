import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { DECADE_SOUNDTRACKS, GALLERY_SOUNDTRACK, soundtrackForDecade } from '../src/data/decadeSoundtracks';
import { resolveSoundtrack } from '../src/hooks/useGallerySoundtrack';
import { clamp, crossfadeLevels, formatPlaybackTime, progressForTime, seekTimeForProgress } from '../src/gallery/audio';
import { DECADES } from '../src/gallery/model';
import {
  calculateTonearmGeometry,
  circleIntersections,
  progressForTonearmAngle,
  tonearmAngleForProgress,
} from '../src/gallery/turntable';

test('every gallery decade has one playable soundtrack asset', () => {
  assert.deepEqual(Object.keys(DECADE_SOUNDTRACKS).map(Number), [...DECADES]);
  for (const decade of DECADES) {
    const track = soundtrackForDecade(decade);
    assert.equal(track.decade, decade);
    assert.ok(track.title);
    assert.match(track.src, /^\/audio\/decades\/[a-z0-9-]+\.mp3$/);
    assert.ok(existsSync(`public${track.src}`), track.src);
    assert.ok(track.credit);
    assert.ok(track.sourceFilename.endsWith('.mp3'));
  }
});

test('the gallery keeps Skating in Central Park separate from era soundtracks', () => {
  assert.equal(GALLERY_SOUNDTRACK.title, 'Skating in Central Park');
  assert.equal(GALLERY_SOUNDTRACK.decade, undefined);
  assert.equal(GALLERY_SOUNDTRACK.src, '/audio/skating-in-central-park.mp3');
  assert.ok(existsSync(`public${GALLERY_SOUNDTRACK.src}`));
  assert.ok(Object.values(DECADE_SOUNDTRACKS).every((track) => track.src !== GALLERY_SOUNDTRACK.src));
});

test('soundtrack resolution supports both gallery theme and each individual decade', () => {
  assert.equal(resolveSoundtrack('gallery').title, 'Skating in Central Park');
  assert.equal(resolveSoundtrack(null).title, 'Skating in Central Park');
  assert.equal(resolveSoundtrack(undefined).title, 'Skating in Central Park');
  for (const decade of DECADES) {
    const track = resolveSoundtrack(decade);
    assert.equal(track.decade, decade);
    assert.equal(track.title, DECADE_SOUNDTRACKS[decade].title);
  }
});

test('playback helpers clamp seeking and format long tracks', () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(2), 1);
  assert.equal(clamp(Number.NaN), 0);
  assert.equal(seekTimeForProgress(0.5, 200), 100);
  assert.equal(seekTimeForProgress(2, 200), 200);
  assert.equal(seekTimeForProgress(0.5, Number.NaN), 0);
  assert.equal(progressForTime(50, 200), 0.25);
  assert.equal(progressForTime(250, 200), 1);
  assert.equal(formatPlaybackTime(0), '0:00');
  assert.equal(formatPlaybackTime(934.9), '15:34');
});

test('crossfade levels preserve a single full-volume mix', () => {
  assert.deepEqual(crossfadeLevels(0), { incoming: 0, outgoing: 1 });
  assert.deepEqual(crossfadeLevels(0.35), { incoming: 0.35, outgoing: 0.65 });
  assert.deepEqual(crossfadeLevels(1), { incoming: 1, outgoing: 0 });
});

test('tonearm geometry derives its playable arc from the rendered circles', () => {
  const intersections = circleIntersections({ x: 0, y: 0 }, 10, { x: 10, y: 0 }, 10);
  assert.ok(intersections);
  assert.ok(Math.abs(intersections[0].x - 5) < 0.001);

  const geometry = calculateTonearmGeometry({
    pivot: { x: 274, y: 43 },
    armLength: 139,
    recordCenter: { x: 126, y: 132 },
    outerRadius: 98,
    innerRadius: 34,
  });
  assert.ok(geometry);
  assert.ok(geometry.startAngle > 0);
  assert.ok(geometry.endAngle > geometry.startAngle);
  assert.equal(tonearmAngleForProgress(0, geometry), geometry.startAngle);
  assert.equal(tonearmAngleForProgress(1, geometry), geometry.endAngle);
  assert.ok(Math.abs(progressForTonearmAngle(tonearmAngleForProgress(0.4, geometry), geometry) - 0.4) < 0.0001);
});
