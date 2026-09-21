import type { NightAllocation, NightAllocationCategory, NightOutcome } from '../types';

export const NIGHT_STUBS = 10;
export const NIGHT_MINIMUMS: NightAllocation = {
  property: 2,
  artists: 0,
  room: 2,
  future: 0,
};

export const NIGHT_TARGETS: NightAllocation = {
  property: 3,
  artists: 3,
  room: 3,
  future: 2,
};

const CATEGORIES: NightAllocationCategory[] = ['property', 'artists', 'room', 'future'];

export function isValidNightAllocation(allocation: NightAllocation): boolean {
  const total = CATEGORIES.reduce((sum, category) => sum + allocation[category], 0);
  return total === NIGHT_STUBS
    && CATEGORIES.every((category) => Number.isInteger(allocation[category]) && allocation[category] >= NIGHT_MINIMUMS[category]);
}

export function calculateNightOutcome(allocation: NightAllocation): NightOutcome {
  if (!isValidNightAllocation(allocation)) {
    throw new Error('A night must conserve ten stubs and meet the property and room minimums.');
  }

  const protectedPriorities = CATEGORIES.filter((category) => allocation[category] >= NIGHT_TARGETS[category]);
  const sacrificedPriorities = CATEGORIES.filter((category) => allocation[category] < NIGHT_TARGETS[category]);
  const artistsProtected = protectedPriorities.includes('artists');
  const futureProtected = protectedPriorities.includes('future');

  let resultSentence = 'The room opens, but the scene cannot sustain another night.';
  if (artistsProtected && futureProtected) {
    resultSentence = 'The musicians are paid and another night remains possible, but the room runs without a cushion.';
  } else if (artistsProtected) {
    resultSentence = 'Tonight’s artists are paid, but nothing remains for the next experimental night.';
  } else if (futureProtected) {
    resultSentence = 'Another night remains possible, but tonight’s artists carry the cost.';
  }

  return { protectedPriorities, sacrificedPriorities, resultSentence };
}

export function moveNightStub(
  allocation: NightAllocation,
  from: NightAllocationCategory,
  to: NightAllocationCategory,
): NightAllocation {
  if (from === to || allocation[from] <= NIGHT_MINIMUMS[from]) return allocation;
  return { ...allocation, [from]: allocation[from] - 1, [to]: allocation[to] + 1 };
}
