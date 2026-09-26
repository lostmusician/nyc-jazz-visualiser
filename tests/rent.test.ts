import assert from 'node:assert/strict';
import test from 'node:test';
import { CPI_U_ANNUAL, RENT_2020_DOLLAR_STOPS, rentIn2020Dollars, rentValues } from '../src/data/rent';

test('rent conversion preserves the nominal value and uses 2020 CPI-U dollars', () => {
  assert.equal(rentIn2020Dollars(100, 1980), Math.round(100 * CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[1980]));
  assert.deepEqual(rentValues(1422, 2020), { nominal: 1422, constant2020: 1422, year: 2020 });
});

test('the rent legend uses one ordered scale across all mapped decades', () => {
  assert.deepEqual([...RENT_2020_DOLLAR_STOPS], [400, 700, 1000, 1300, 1600, 2000, 2600, 3400]);
});
