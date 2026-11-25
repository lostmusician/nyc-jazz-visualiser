import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CPI_U_ANNUAL,
  RENT_2020_DOLLAR_STOPS,
  RENT_CAP_THRESHOLDS,
  RENT_PERIOD_LABELS,
  isRentCapped,
  rentIn2020Dollars,
  rentValues,
} from '../src/data/rent';

test('rent conversion preserves the nominal value and uses 2020 CPI-U dollars', () => {
  assert.equal(rentIn2020Dollars(100, 1980), Math.round((100 * CPI_U_ANNUAL[2020]) / CPI_U_ANNUAL[1980]));
  assert.deepEqual(rentValues(1422, 2020), {
    nominal: 1422,
    constant2020: 1422,
    year: 2020,
    isCapped: false,
    capThreshold: null,
    displayNominal: '$1,422',
    displayConstant2020: '$1,422',
  });
});

test('capped census estimates are flagged and handled as lower bounds', () => {
  // Census 2010 sentinel code 2001 represents $2,000 or more
  assert.equal(isRentCapped(2001, 2010), true);
  assert.equal(isRentCapped(1999, 2010), false);

  const capped2010 = rentValues(2001, 2010);
  assert.equal(capped2010.isCapped, true);
  assert.equal(capped2010.nominal, 2000); // normalized to lower bound
  assert.equal(capped2010.capThreshold, 2000);
  assert.equal(capped2010.displayNominal, '$2,000+');
  assert.equal(capped2010.displayConstant2020, `$${Math.round(2000 * CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[2010]).toLocaleString()}+`);

  // Census 2020 sentinel code 3501 represents $3,500 or more
  const capped2020 = rentValues(3501, 2020);
  assert.equal(capped2020.isCapped, true);
  assert.equal(capped2020.nominal, 3500);
  assert.equal(capped2020.displayNominal, '$3,500+');
  assert.equal(capped2020.displayConstant2020, '$3,500+');
});

test('the rent legend uses one ordered scale across all mapped decades', () => {
  assert.deepEqual([...RENT_2020_DOLLAR_STOPS], [400, 700, 1000, 1300, 1600, 2000, 2600, 3400]);
});

test('only sentinel codes imply a capped amount; normalized bounds need an explicit flag', () => {
  for (const year of [1980, 1990, 2000, 2010, 2020] as const) {
    const threshold = RENT_CAP_THRESHOLDS[year];
    assert.equal(isRentCapped(threshold, year), false);
    assert.equal(isRentCapped(threshold + 1, year), true);
    assert.equal(isRentCapped(threshold + 2, year), false);
    assert.equal(rentValues(threshold, year, true).displayNominal, `$${threshold.toLocaleString()}+`);
    assert.equal(rentValues(threshold + 1, year, false).nominal, threshold + 1);
  }
  assert.equal(rentValues(514, 1980).nominal, 514);
  assert.equal(rentValues(514, 1980).isCapped, false);
});

test('ACS labels describe the full survey period', () => {
  assert.equal(RENT_PERIOD_LABELS[2010], '2006–2010 estimate');
  assert.equal(RENT_PERIOD_LABELS[2020], '2016–2020 estimate');
});
