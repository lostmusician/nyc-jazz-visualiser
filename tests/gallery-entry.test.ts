import assert from 'node:assert/strict';
import test from 'node:test';
import { getHoldProgress, getHoldReleaseOutcome, getTurntableSpeed, shouldSoundtrackBeAudible, wrapLoopCursor } from '../src/gallery/entry-state';

test('four-second hold progress clamps and distinguishes an early release', () => {
  assert.equal(getHoldProgress(-100), 0);
  assert.equal(getHoldProgress(2000), 0.5);
  assert.equal(getHoldProgress(5000), 1);
  assert.equal(getHoldReleaseOutcome(3999), 'drop-and-reset');
  assert.equal(getHoldReleaseOutcome(4000), 'enter');
});

test('manual mute, record playback, and hidden pages override soundtrack playback', () => {
  const base = { status: 'playing', manualMuted: false, recordPaused: false, pageHidden: false };
  assert.equal(shouldSoundtrackBeAudible(base), true);
  assert.equal(shouldSoundtrackBeAudible({ ...base, manualMuted: true }), false);
  assert.equal(shouldSoundtrackBeAudible({ ...base, recordPaused: true }), false);
  assert.equal(shouldSoundtrackBeAudible({ ...base, pageHidden: true }), false);
  assert.equal(shouldSoundtrackBeAudible({ ...base, status: 'dropping' }), false);
});

test('soundtrack cursor wraps rather than ending at the final sample', () => {
  assert.equal(wrapLoopCursor(25, 100), 25);
  assert.equal(wrapLoopCursor(100, 100), 0);
  assert.equal(wrapLoopCursor(127, 100), 27);
});

test('turntable speed eases down to silence and back up to full speed', () => {
  assert.equal(getTurntableSpeed(1, 0, 0), 1);
  assert.equal(getTurntableSpeed(1, 0, 1), 0);
  assert.equal(getTurntableSpeed(0, 1, 0), 0);
  assert.equal(getTurntableSpeed(0, 1, 1), 1);
  assert.ok(getTurntableSpeed(1, 0, 0.5) < 0.5);
  assert.ok(getTurntableSpeed(0, 1, 0.5) > 0.5);
  const partiallyCooled = getTurntableSpeed(1, 0, 0.4);
  assert.ok(getTurntableSpeed(partiallyCooled, 1, 0.25) > partiallyCooled);
});
