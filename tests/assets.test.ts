import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { ASSET_CREDITS, FOYER_SCENE, ROOM_SCENES } from '../src/data/assets.ts';

const scenes = [FOYER_SCENE, ...Object.values(ROOM_SCENES)];

test('every custom museum scene has a local render and credit record', () => {
  for (const scene of scenes) {
    const credit = ASSET_CREDITS.find((entry) => entry.id === scene.id);
    assert.ok(credit, `${scene.id} is missing a credit`);
    assert.equal(scene.status, 'illustrative');

    for (const layer of scene.layers) {
      const file = join(process.cwd(), 'public', layer.src.replace(/^\//, ''));
      assert.ok(existsSync(file), `${layer.src} does not exist`);
      assert.ok(statSync(file).size < 2_000_000, `${layer.src} exceeds the 2 MB scene budget`);
    }
  }
});

test('room art is decorative because the surrounding threshold supplies its meaning', () => {
  for (const scene of scenes) {
    assert.ok(scene.label.length > 20);
    assert.ok(scene.layers.every((layer) => layer.alt === ''));
  }
});

test('web audio stays lightweight and lossless masters stay outside public assets', () => {
  for (const stem of ['bass', 'drums', 'piano', 'sax']) {
    const webFile = join(process.cwd(), 'public', 'audio', 'web', `${stem}.mp3`);
    assert.ok(existsSync(webFile));
    assert.ok(statSync(webFile).size < 2_000_000, `${stem}.mp3 exceeds the 2 MB web-audio budget`);
  }

  assert.equal(existsSync(join(process.cwd(), 'public', 'audio', 'Bass 441_1.wav')), false);
  assert.ok(existsSync(join(process.cwd(), 'art', 'audio-source', 'Bass 441_1.wav')));
});
