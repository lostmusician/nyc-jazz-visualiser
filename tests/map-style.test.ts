import assert from 'node:assert/strict';
import test from 'node:test';
import { expression, latest, validate } from 'mapbox-gl/dist/style-spec/index.es.js';
import { getHistoricalVenueOpacity } from '../src/hooks/useMapbox';
import { HISTORICAL_VENUE_MIN_ZOOM } from '../src/gallery/model';

test('historical map circles use valid zoom expressions and preserve scene dimming', () => {
  for (const [dimmed, matching] of [[0.04, 0.3], [0.12, 0.9]]) {
    const opacity = getHistoricalVenueOpacity(dimmed, matching);
    assert.deepEqual(validate({
      version: 8,
      sources: { venues: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } } },
      layers: [{ id: 'historical', type: 'circle', source: 'venues', paint: { 'circle-opacity': opacity } }],
    }), []);

    const compiled = expression.createPropertyExpression(opacity, latest.paint_circle['circle-opacity']);
    assert.equal(compiled.result, 'success');
    if (compiled.result !== 'success') continue;
    const evaluate = (zoom: number, sceneMatch?: boolean) => compiled.value.evaluate(
      { zoom }, { type: 1, properties: sceneMatch === undefined ? {} : { scene_match: sceneMatch } },
    );
    assert.equal(evaluate(HISTORICAL_VENUE_MIN_ZOOM, true), 0);
    assert.equal(evaluate(HISTORICAL_VENUE_MIN_ZOOM + 0.75, true), matching);
    assert.equal(evaluate(HISTORICAL_VENUE_MIN_ZOOM + 0.75, false), dimmed);
    assert.equal(evaluate(HISTORICAL_VENUE_MIN_ZOOM + 0.75), matching);
    assert.equal(evaluate(HISTORICAL_VENUE_MIN_ZOOM + 0.375, true), matching / 2);
  }
});
