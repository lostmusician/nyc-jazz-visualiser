import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateNightOutcome, isValidNightAllocation, moveNightStub, NIGHT_MINIMUMS } from '../src/utils/nightAllocation.ts';
import type { NightAllocation } from '../src/types/index.ts';

test('all valid allocations conserve ten stubs and respect non-bypassable claims', () => {
  let combinations = 0;
  for (let property = 2; property <= 8; property += 1) {
    for (let room = 2; room <= 8; room += 1) {
      for (let artists = 0; artists <= 6; artists += 1) {
        const future = 10 - property - room - artists;
        if (future < 0) continue;
        const allocation = { property, artists, room, future };
        if (!isValidNightAllocation(allocation)) continue;
        combinations += 1;
        const outcome = calculateNightOutcome(allocation);
        assert.equal(outcome.protectedPriorities.length + outcome.sacrificedPriorities.length, 4);
        assert.ok(outcome.resultSentence.length > 20);
      }
    }
  }
  assert.ok(combinations > 30);
});

test('a move never bypasses property or room minimums and never creates a stub', () => {
  const initial: NightAllocation = { property: 2, artists: 4, room: 2, future: 2 };
  assert.equal(moveNightStub(initial, 'property', 'artists'), initial);
  assert.equal(moveNightStub(initial, 'room', 'future'), initial);
  const moved = moveNightStub(initial, 'artists', 'future');
  assert.deepEqual(moved, { property: 2, artists: 3, room: 2, future: 3 });
  assert.equal(Object.values(moved).reduce((sum, count) => sum + count, 0), 10);
  assert.deepEqual(NIGHT_MINIMUMS, { property: 2, artists: 0, room: 2, future: 0 });
});

test('each interpretive result is reachable without inventing dollar values', () => {
  assert.match(calculateNightOutcome({ property: 2, room: 2, artists: 4, future: 2 }).resultSentence, /musicians are paid/);
  assert.match(calculateNightOutcome({ property: 3, room: 3, artists: 4, future: 0 }).resultSentence, /nothing remains/);
  assert.match(calculateNightOutcome({ property: 3, room: 3, artists: 1, future: 3 }).resultSentence, /artists carry the cost/);
  assert.match(calculateNightOutcome({ property: 4, room: 4, artists: 1, future: 1 }).resultSentence, /cannot sustain/);
  assert.throws(() => calculateNightOutcome({ property: 1, room: 2, artists: 4, future: 3 }));
});
