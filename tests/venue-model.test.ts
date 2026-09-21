import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateVenueModel } from '../src/utils/venueModel.ts';
import type { VenueSimulationPreset } from '../src/types/index.ts';

const preset: VenueSimulationPreset = {
  id: 'test', label: 'Test room', place: 'NYC', year: '2000', capacity: 100,
  monthlyRent: 5000, fixedOperatingCost: 3000, attendanceRate: .7, note: 'Test only',
  sources: [],
};

test('venue model calculates a transparent monthly ledger', () => {
  const result = calculateVenueModel(preset, { ticketPrice: 20, performancesPerWeek: 4, attendanceRate: .5, artistShare: .5 });
  assert.equal(result.monthlyRevenue, 17_320);
  assert.equal(result.artistPay, 8_660);
  assert.equal(result.operatingCosts, 12_156.8);
  assert.equal(result.monthlyBalance, -3_496.7999999999993);
  assert.equal(result.experimentalNights, 0);
});

test('higher attendance improves the balance', () => {
  const quiet = calculateVenueModel(preset, { ticketPrice: 15, performancesPerWeek: 3, attendanceRate: .4, artistShare: .4 });
  const full = calculateVenueModel(preset, { ticketPrice: 15, performancesPerWeek: 3, attendanceRate: 1, artistShare: .4 });
  assert.ok(full.monthlyBalance > quiet.monthlyBalance);
});

test('experimental nights never become negative', () => {
  const result = calculateVenueModel(preset, { ticketPrice: 5, performancesPerWeek: 1, attendanceRate: .3, artistShare: .75 });
  assert.equal(result.experimentalNights, 0);
});
