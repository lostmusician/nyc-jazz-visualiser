import type { AddressBeatId } from '../types';

export function addressBeatFromHash(hash: string): AddressBeatId {
  const clean = hash.replace(/^#/, '').replace(/^room\//, '');
  if (clean === 'map' || clean === 'city') return 'city';
  if (clean === 'room' || clean === 'allocation' || clean === 'present' || clean === 'address') return clean;
  return 'address';
}

export function clampFacadeReveal(value: number): number {
  return Math.max(0, Math.min(100, value));
}
