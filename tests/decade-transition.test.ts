import assert from 'node:assert/strict';
import test from 'node:test';
import { NYC_JAZZ_VENUES } from '../src/data/venues';
import { changeProgress, getDecadeChange } from '../src/gallery/decade-transition';
import { DECADES, overlapsDecade } from '../src/gallery/model';

test('a decade transition partitions the real venue records without losing survivors', () => {
  for (const decade of DECADES.slice(1)) {
    const change = getDecadeChange(NYC_JAZZ_VENUES, decade)!;
    const ids = [...change.closing,...change.surviving,...change.opening].map((v) => v.properties.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(change.closing.every((v) => v.properties.close_year !== null && v.properties.close_year < change.to));
    assert.ok(change.opening.every((v) => v.properties.open_year !== null && v.properties.open_year >= change.to));
    assert.equal(change.to, decade);
    assert.equal(change.from, decade - 10);
    assert.equal(change.closing.length+change.surviving.length, NYC_JAZZ_VENUES.filter((v) => overlapsDecade(v,change.from)).length);
    assert.equal(change.opening.length+change.surviving.length, NYC_JAZZ_VENUES.filter((v) => overlapsDecade(v,change.to)).length);
  }
  assert.equal(getDecadeChange(NYC_JAZZ_VENUES,1920),null);
  assert.equal(getDecadeChange(NYC_JAZZ_VENUES,1990)?.from,1980);
  assert.equal(getDecadeChange(NYC_JAZZ_VENUES,2020)?.from,2010);
});

test('Tonic closes in the 2000s transition and surviving rooms are retained', () => {
  const change = getDecadeChange(NYC_JAZZ_VENUES,2010)!;
  assert.ok(change.closing.some((v) => v.properties.id === '0006'));
  assert.ok(change.surviving.some((v) => v.properties.id === '0004'));
  assert.ok(!change.opening.some((v) => v.properties.id === '0006'));
});

test('loss and arrival are separated by a pause and reduced motion finishes quickly', () => {
  assert.deepEqual(changeProgress(0), { closing:0, opening:0, exit:0 });
  assert.deepEqual(changeProgress(2.8), { closing:1, opening:0, exit:0 });
  assert.deepEqual(changeProgress(6), { closing:1, opening:1, exit:1 });
  assert.deepEqual(changeProgress(.6,true), { closing:1, opening:1, exit:1 });
});
