import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HOLD_READY_PROGRESS,
  getHoldProgress,
  getHoldReleaseOutcome,
  getTurntableSpeed,
  getVisualHoldProgress,
  wrapLoopCursor,
} from '../src/gallery/entry-state';

test('three-and-a-half-second hold progress slows into the finish and includes a forgiving completion threshold', () => {
  assert.equal(getHoldProgress(-100), 0);
  assert.ok(Math.abs(getHoldProgress(1500) - 0.5) < 0.02, 'the halfway mark is reached near 1.5s');
  assert.ok(getHoldProgress(2700) < 0.92, 'the ring should still have a visible final approach');
  assert.equal(getHoldProgress(3500), 1);
  const firstLateStep = getHoldProgress(3000) - getHoldProgress(2500);
  const finalStep = getHoldProgress(3500) - getHoldProgress(3000);
  assert.ok(finalStep < firstLateStep, 'the highlight should decelerate as it completes the ring');
  assert.ok(getVisualHoldProgress(getHoldProgress(2700)) < 1, 'visual stroke is still open before threshold');
  assert.equal(getVisualHoldProgress(HOLD_READY_PROGRESS), 1, 'visual stroke closes precisely at ready threshold');
  assert.equal(getVisualHoldProgress(getHoldProgress(3000)), 1, 'visual stroke is closed at 3000ms');
  assert.equal(getHoldReleaseOutcome(2999), 'drop-and-reset');
  assert.equal(getHoldReleaseOutcome(3000), 'enter');
  assert.equal(getHoldReleaseOutcome(3500), 'enter');
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
