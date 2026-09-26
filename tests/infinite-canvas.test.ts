import assert from 'node:assert/strict';
import test from 'node:test';
import { CHUNK_OFFSETS, CHUNK_SIZE, RENDER_DISTANCE } from '../src/infinite-canvas/constants';
import { generateChunkPlanes, generateChunkPlanesCached, getChunkUpdateThrottleMs, getPlaneCacheSize, shouldThrottleUpdate } from '../src/infinite-canvas/utils';

test('chunk generation is deterministic and spatially bounded', () => {
  const first = generateChunkPlanes(2, -1, 3);
  const second = generateChunkPlanes(2, -1, 3);
  assert.deepEqual(first.map((plane) => plane.position.toArray()), second.map((plane) => plane.position.toArray()));
  assert.equal(first.length, 5);
  assert.ok(first.every((plane) => plane.position.x >= 2 * CHUNK_SIZE && plane.position.x < 3 * CHUNK_SIZE));
});

test('chunk and plane caches remain bounded during long travel', () => {
  for (let index = 0; index < 400; index += 1) generateChunkPlanesCached(index, -index, index % 9);
  assert.ok(getPlaneCacheSize() <= 256);
  assert.equal(CHUNK_OFFSETS.length, (RENDER_DISTANCE + 1 + RENDER_DISTANCE + 2) ** 3);
});

test('camera update throttling retains upstream zoom behavior', () => {
  assert.equal(getChunkUpdateThrottleMs(false, 0), 100);
  assert.equal(getChunkUpdateThrottleMs(true, 0.5), 400);
  assert.equal(getChunkUpdateThrottleMs(true, 1.1), 500);
  assert.equal(shouldThrottleUpdate(100, 400, 499), false);
  assert.equal(shouldThrottleUpdate(100, 400, 500), true);
});
