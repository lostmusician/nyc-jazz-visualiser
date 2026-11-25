import { DECADES, overlapsDecade, type Decade } from './model';
import type { VenueFeature } from '../types';

export type TransitionRole = 'closing' | 'surviving' | 'opening';
export interface DecadeChange {
  from: Decade;
  to: Decade;
  closing: VenueFeature[];
  surviving: VenueFeature[];
  opening: VenueFeature[];
}

// A chapter introduces its selected decade: replay the change leading into it,
// regardless of the visitor's previous timeline selection. Never wrap the ends.
export function getDecadeChange(venues: VenueFeature[], to: Decade): DecadeChange | null {
  const index = DECADES.indexOf(to);
  if (index <= 0) return null;
  const from = DECADES[index - 1];
  const before = venues.filter((venue) => overlapsDecade(venue, from));
  const after = venues.filter((venue) => overlapsDecade(venue, to));
  const beforeIds = new Set(before.map((venue) => venue.properties.id));
  const afterIds = new Set(after.map((venue) => venue.properties.id));
  return {
    from, to,
    closing: before.filter((venue) => !afterIds.has(venue.properties.id)),
    surviving: before.filter((venue) => afterIds.has(venue.properties.id)),
    opening: after.filter((venue) => !beforeIds.has(venue.properties.id)),
  };
}

export const CHANGE_DURATION = 5.2;
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

// A pause separates loss from arrival. Both renderers read the same clock.
export function changeProgress(seconds: number, reducedMotion = false) {
  return {
    closing: clamp01((seconds - (reducedMotion ? 0 : 0.7)) / (reducedMotion ? 0.15 : 1.65)),
    opening: clamp01((seconds - (reducedMotion ? 0.2 : 3.05)) / (reducedMotion ? 0.15 : 1.25)),
    exit: clamp01((seconds - (reducedMotion ? 0.4 : 4.65)) / (reducedMotion ? 0.1 : 0.55)),
  };
}

export interface DecadeTransitionState {
  change: DecadeChange;
  clock: { seconds: number };
  reducedMotion: boolean;
}
