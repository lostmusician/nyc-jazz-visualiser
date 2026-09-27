import assert from 'node:assert/strict';
import test from 'node:test';
import { getHoldProgress, getHoldReleaseOutcome, getTurntableSpeed, wrapLoopCursor } from '../src/gallery/entry-state';

test('five-second hold progress slows into the finish and distinguishes an early release', () => {
  assert.equal(getHoldProgress(-100), 0);
  assert.equal(getHoldProgress(2500), 0.5);
  assert.ok(getHoldProgress(4000) < 0.9, 'the ring should still have a visible final approach after four seconds');
  assert.equal(getHoldProgress(6000), 1);
  const firstLateStep = getHoldProgress(4500) - getHoldProgress(4000);
  const finalStep = getHoldProgress(5000) - getHoldProgress(4500);
  assert.ok(finalStep < firstLateStep, 'the highlight should decelerate as it completes the ring');
  assert.equal(getHoldReleaseOutcome(4999), 'drop-and-reset');
  assert.equal(getHoldReleaseOutcome(5000), 'enter');
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
