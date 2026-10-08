import { expect, test } from '@playwright/test';

const enterGallery = async (page: import('@playwright/test').Page, keepTour = false) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await enter.hover();
  await page.mouse.down();
  await page.waitForTimeout(3600);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toBeVisible();
  if (!keepTour) {
    const tour = page.getByRole('dialog', { name: 'Move around' });
    await expect(tour).toBeVisible({ timeout: 3000 });
    await tour.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('[data-story-decade="1920"]')).toBeVisible();
    await page.getByRole('button', { name: 'Skip and continue to map' }).click();
  }
};

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes('audio lifecycle')) {
    await page.addInitScript(() => {
      const trackedWindow = window as Window & {
        __audioProbe?: {
          created: number;
          disconnected: number;
          sampleCount: number;
          lastNode: AudioWorkletNode | null;
          setHidden: (hidden: boolean) => void;
        };
      };
      let forcedHidden = false;
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => forcedHidden });
      const probe = { created: 0, disconnected: 0, sampleCount: 0, lastNode: null as AudioWorkletNode | null, setHidden: (hidden: boolean) => {
        forcedHidden = hidden;
        document.dispatchEvent(new Event('visibilitychange'));
      } };
      trackedWindow.__audioProbe = probe;
      const OriginalNode = window.AudioWorkletNode;
      window.AudioWorkletNode = class extends OriginalNode {
        constructor(...args: ConstructorParameters<typeof AudioWorkletNode>) {
          super(...args);
          probe.created += 1;
          probe.lastNode = this;
          const originalPost = this.port.postMessage.bind(this.port);
          this.port.postMessage = ((message: unknown, transfer?: Transferable[]) => {
            if (message && typeof message === 'object' && 'leftBuffer' in message && message.leftBuffer instanceof ArrayBuffer) {
              probe.sampleCount = message.leftBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT;
            }
            return originalPost(message, transfer ?? []);
          }) as MessagePort['postMessage'];
        }
        disconnect(...args: Parameters<AudioWorkletNode['disconnect']>) {
          probe.disconnected += 1;
          return super.disconnect(...args);
        }
      };
    });
  }
  if (testInfo.title.includes('audio lifecycle delayed start')) {
    await page.route('**/audio/skating-in-central-park.mp3', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      await route.continue();
    });
    await page.route('**/audio/pitch-dropper-processor.js', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await route.continue();
    });
  }
  if (testInfo.title.includes('audio lifecycle delayed decade')) {
    await page.route('**/audio/decades/1980-cherokee-live.mp3', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1600));
      await route.continue();
    });
  }
  if (testInfo.title.includes('rapid successive presses')) {
    await page.addInitScript(() => {
      const trackedWindow = window as Window & { __spacebarPlayCalls?: number };
      trackedWindow.__spacebarPlayCalls = 0;
      const originalPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function play() {
        if (this.src.includes('spacebar-click.mp3')) trackedWindow.__spacebarPlayCalls = (trackedWindow.__spacebarPlayCalls ?? 0) + 1;
        return originalPlay.call(this);
      };
    });
  }
  if (testInfo.title.includes('audio is unavailable')) {
    await page.route('**/audio/skating-in-central-park.mp3', (route) => route.abort());
  }
  if (testInfo.title.includes('decade soundtrack failure')) {
    await page.route('**/audio/decades/1980-cherokee-live.mp3', (route) => route.abort(), { times: 1 });
  }
  const path = testInfo.title.includes('WebGL is unavailable') ? '/?webgl=off' : '/';
  await page.goto(path);
  await expect(page.getByRole('button', { name: /Press and hold/ })).toBeVisible();
  const startsAtEntrance = ['early release', 'keyboard hold', 'global Spacebar', 'audio is unavailable', 'rapid successive presses', 'continues from the entrance', 'audio lifecycle delayed start'].some((phrase) => testInfo.title.includes(phrase));
  if (!startsAtEntrance) await enterGallery(page, testInfo.title.includes('guided tutorial'));
});

test('audio lifecycle delayed start cancels an early release and starts once on the next hold', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await enter.hover();
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.waitForTimeout(2200);
  const probe = () => page.evaluate(() => (window as Window & { __audioProbe: { created: number } }).__audioProbe.created);
  expect(await probe()).toBe(0);
  await page.mouse.down();
  await expect.poll(probe).toBe(1);
  await page.waitForTimeout(3100);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toBeVisible();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('data-audio-status', 'playing');
  expect(await probe()).toBe(1);
});

test('audio lifecycle delayed decade ignores an obsolete track request', async ({ page }) => {
  await page.getByRole('button', { name: '1980' }).click();
  await page.getByRole('button', { name: '1990' }).click();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Work Song/);
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('data-audio-status', 'playing');
  await page.waitForTimeout(1900);
  const probe = await page.evaluate(() => (window as Window & { __audioProbe: { created: number } }).__audioProbe.created);
  expect(probe).toBe(2);
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Work Song/);
});

test('audio lifecycle delayed decade resumes after a hidden load and honors a later pause', async ({ page }) => {
  const setHidden = (hidden: boolean) => page.evaluate((nextHidden) => (window as Window & {
    __audioProbe: { setHidden: (value: boolean) => void };
  }).__audioProbe.setHidden(nextHidden), hidden);
  await page.getByRole('button', { name: '1980' }).click();
  await setHidden(true);
  const toggle = page.locator('.soundtrack-toggle');
  await expect(toggle).toHaveAttribute('data-audio-status', 'paused');
  const hiddenTime = Number(await toggle.getAttribute('data-audio-time'));
  await page.waitForTimeout(400);
  expect(Number(await toggle.getAttribute('data-audio-time'))).toBe(hiddenTime);
  await setHidden(false);
  await expect(toggle).toHaveAttribute('data-audio-status', 'playing');
  await expect.poll(async () => Number(await toggle.getAttribute('data-audio-time'))).toBeGreaterThan(hiddenTime);
  await page.getByRole('button', { name: 'Mute 1980s soundtrack' }).click();
  await expect(toggle).toHaveAttribute('data-audio-status', 'paused');
  await setHidden(true);
  await setHidden(false);
  await expect(toggle).toHaveAttribute('data-audio-status', 'paused');
});

test('audio lifecycle crossfade settles while hidden and resumes the selected track', async ({ page }) => {
  const setHidden = (hidden: boolean) => page.evaluate((nextHidden) => (window as Window & {
    __audioProbe: { setHidden: (value: boolean) => void };
  }).__audioProbe.setHidden(nextHidden), hidden);
  await page.getByRole('button', { name: '1990' }).click();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('data-audio-status', 'playing');
  await setHidden(true);
  const probe = await page.evaluate(() => (window as Window & {
    __audioProbe: { disconnected: number };
  }).__audioProbe.disconnected);
  expect(probe).toBeGreaterThan(0);
  await setHidden(false);
  const toggle = page.locator('.soundtrack-toggle');
  await expect(toggle).toHaveAttribute('data-audio-status', 'playing');
  const cursor = Number(await toggle.getAttribute('data-audio-time'));
  await expect.poll(async () => Number(await toggle.getAttribute('data-audio-time'))).toBeGreaterThan(cursor);
});

test('audio lifecycle mute during a crossfade pauses and resumes the selected track', async ({ page }) => {
  await page.getByRole('button', { name: '1990' }).click();
  const toggle = page.locator('.soundtrack-toggle');
  await expect(toggle).toHaveAttribute('data-audio-status', 'playing');
  await page.getByRole('button', { name: 'Mute 1990s soundtrack' }).click();
  await expect(toggle).toHaveAttribute('data-audio-status', 'paused');
  const pausedAt = Number(await toggle.getAttribute('data-audio-time'));
  await page.waitForTimeout(400);
  expect(Number(await toggle.getAttribute('data-audio-time'))).toBe(pausedAt);
  await page.getByRole('button', { name: 'Play 1990s soundtrack' }).click();
  await expect(toggle).toHaveAttribute('data-audio-status', 'playing');
  await expect.poll(async () => Number(await toggle.getAttribute('data-audio-time'))).toBeGreaterThan(pausedAt);
});

test('audio lifecycle worklet loops after reaching the last sample', async ({ page }) => {
  const toggle = page.locator('.soundtrack-toggle');
  await expect(toggle).toHaveAttribute('data-audio-status', 'playing');
  await expect.poll(async () => Number(await toggle.getAttribute('data-audio-time'))).toBeGreaterThan(1);
  await page.evaluate(() => {
    const probe = (window as Window & { __audioProbe: {
      lastNode: AudioWorkletNode | null;
      sampleCount: number;
    } }).__audioProbe;
    const sampleRate = probe.lastNode?.context.sampleRate ?? 0;
    probe.lastNode?.port.postMessage({ seekCursor: probe.sampleCount - sampleRate * 0.05 });
  });
  await expect.poll(async () => Number(await toggle.getAttribute('data-audio-time')), { timeout: 3000 }).toBeLessThan(1);
  await expect.poll(async () => Number(await toggle.getAttribute('data-audio-time'))).toBeGreaterThan(0.2);
});

test('early release slows down and resets the entrance', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await expect(page.locator('.launch-prompt')).toContainText('HoldSpacebarto launch gallery');
  await expect(page.locator('audio[src="/audio/spacebar-click.mp3"]')).toHaveAttribute('preload', 'auto');
  await enter.hover();
  await page.mouse.down();
  await expect(enter).toHaveClass(/is-holding/);
  await expect(enter).not.toHaveCSS('transform', 'none');
  await expect.poll(() => page.locator('audio[src="/audio/spacebar-click.mp3"]').evaluate((audio) => (audio as HTMLAudioElement).currentTime)).toBeGreaterThan(0);
  await page.waitForTimeout(450);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toHaveCount(0);
  await expect(enter).toContainText('Spacebar');
  await expect(enter).not.toHaveClass(/is-holding/);
});

test('keyboard hold completes the gallery transition', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await enter.focus();
  await page.keyboard.down('Enter');
  await page.waitForTimeout(3600);
  await page.keyboard.up('Enter');
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('global Spacebar visibly slows into completion and enters within the forgiving threshold', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await expect(enter).not.toBeFocused();
  await page.keyboard.down('Space');
  await expect(enter).toHaveAttribute('aria-pressed', 'true');
  await expect(enter).toHaveClass(/is-holding/);
  await page.waitForTimeout(2700);
  await expect(enter).not.toHaveClass(/is-ready/);
  const beforeThreshold = Number(await enter.getAttribute('data-hold-progress'));
  expect(beforeThreshold).toBeGreaterThan(0.75);
  expect(beforeThreshold).toBeLessThan(0.95);
  await page.waitForTimeout(400);
  await expect(enter).toHaveClass(/is-ready/);
  await expect(enter).toContainText('Release');
  await page.keyboard.up('Space');
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('gallery soundtrack continues from the entrance after the Spacebar hold', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await enter.focus();
  await page.keyboard.down('Space');
  await page.waitForTimeout(3600);
  await page.keyboard.up('Space');
  await expect(page.locator('.gallery-app')).toBeVisible();
  const soundtrack = page.locator('.soundtrack-toggle');
  const handoffTime = Number(await soundtrack.getAttribute('data-audio-time'));
  expect(handoffTime).toBeGreaterThan(0.5);
  await expect.poll(async () => Number(await soundtrack.getAttribute('data-audio-time'))).toBeGreaterThan(handoffTime);
});

test('rapid successive presses replay the tactile Spacebar sound', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await enter.hover();
  for (let press = 0; press < 4; press += 1) {
    await page.mouse.down();
    await page.waitForTimeout(45);
    await page.mouse.up();
    await page.waitForTimeout(20);
  }
  await expect.poll(() => page.evaluate(() => (window as Window & { __spacebarPlayCalls?: number }).__spacebarPlayCalls ?? 0)).toBe(4);
});

test('hold-to-enter remains available when audio is unavailable', async ({ page }) => {
  const status = page.getByRole('status');
  const enter = page.getByRole('button', { name: /Press and hold/ });
  await enter.hover();
  await page.mouse.down();
  await expect(status).toContainText('Audio is unavailable');
  await page.waitForTimeout(3600);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('guided tutorial is compulsory, advances, persists, and can be replayed', async ({ page }) => {
  const tour = page.getByRole('dialog', { name: 'Move around' });
  await expect(tour).toBeVisible({ timeout: 3000 });
  await expect(tour.getByRole('button', { name: /Skip|Close/ })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(tour).toBeVisible();
  await tour.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Find a room' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  const soundtrackTour = page.getByRole('dialog', { name: 'Control the soundtrack' });
  await expect(soundtrackTour).toBeVisible();
  await expect(soundtrackTour).toContainText('spin the music down to mute');
  await expect(page.locator('[data-tour="soundtrack"]')).toBeVisible();
  await soundtrackTour.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Watch the map' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Follow the city through time' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('nyc-jazz-gallery-tour-v2'))).toBe('complete');
  await expect(page.locator('[data-story-decade="1920"]')).toBeVisible();
  await expect(page.locator('[data-story-beat="1920-overview"]')).toHaveAttribute('data-active', 'true');
  await page.getByRole('button', { name: 'Skip and continue to map' }).click();
  await page.getByRole('button', { name: 'Show gallery tour' }).click();
  await expect(page.getByRole('dialog', { name: 'Move around' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('decade and scene controls filter the accessible club index', async ({ page }) => {
  await expect(page.locator('.loading-readout')).toHaveCount(0);
  await expect(page.getByText('Rooms That Held the Night')).toHaveCount(0);
  await expect(page.getByText('The Night Map')).toHaveCount(0);
  await expect(page.getByText('Move through the city’s club ecology')).toHaveCount(0);
  await page.getByRole('button', { name: '1970' }).click();
  await page.getByRole('button', { name: 'Skip and continue to map' }).click();
  await page.getByRole('button', { name: 'Browse and filter clubs' }).click();
  const index = page.locator('.club-index');
  await expect(index.locator('.club-index-list button')).not.toHaveCount(0);

  await page.getByRole('button', { name: 'Downtown' }).click();
  const downtownCount = await index.locator('.club-index-list button').count();
  expect(downtownCount).toBeGreaterThan(0);

  const decade2020 = page.getByRole('button', { name: '2020' });
  const gallerySoundtrackPosition = await page.locator('.soundtrack-toggle').boundingBox();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Bitches Brew/);
  await decade2020.click();
  const story = page.locator('[data-story-decade="2020"]');
  await expect(story).toBeVisible();
  await expect(page.getByRole('button', { name: /2020s soundtrack/ })).toBeVisible();
  const storySoundtrackPosition = await page.locator('.soundtrack-toggle').boundingBox();
  const storySkipPosition = await story.getByRole('button', { name: 'Skip and continue to map' }).boundingBox();
  expect(storySoundtrackPosition?.x).toBe(gallerySoundtrackPosition?.x);
  expect(storySkipPosition && storySoundtrackPosition && storySkipPosition.y).toBeGreaterThan(storySoundtrackPosition!.y + storySoundtrackPosition!.height);
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Linger Awhile/);
  await expect(story).toContainText('The pandemic empties the rooms');
  await expect(page.locator('[data-map-mode="story"]')).toBeVisible();
  await story.getByRole('button', { name: 'Skip and continue to map' }).click();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Linger Awhile/);
  await expect(page.getByRole('button', { name: /2020s soundtrack/ })).toBeVisible();
  await expect(page.getByRole('button', { name: '2020' })).toHaveClass(/active/);
  await expect(page.getByRole('region', { name: /New York jazz-club map in the 2020s/ })).toBeVisible();
});

test('decade story activates beats in both scroll directions and exits to the filtered gallery', async ({ page }) => {
  await page.getByRole('button', { name: '1980' }).click();
  const story = page.locator('[data-story-decade="1980"]');
  const scroller = story.locator('[data-story-scroller]');
  const finalBeat = story.locator('[data-story-beat="1980-impact"]');
  await finalBeat.scrollIntoViewIfNeeded();
  await expect(finalBeat).toHaveAttribute('data-active', 'true');
  const firstBeat = story.locator('[data-story-beat="1980-overview"]');
  await firstBeat.scrollIntoViewIfNeeded();
  await expect(firstBeat).toHaveAttribute('data-active', 'true');
  await finalBeat.scrollIntoViewIfNeeded();
  await finalBeat.getByRole('button', { name: 'Explore the 1980s' }).click();
  await expect(story).toHaveCount(0);
  await expect(page.getByRole('button', { name: '1980', exact: true })).toHaveClass(/active/);
  await expect(scroller).toHaveCount(0);
});

test('club details keep the record player hidden and restore focus on dismissal', async ({ page }) => {
  await page.getByRole('button', { name: 'Browse and filter clubs' }).click();
  const opener = page.locator('.club-index-list button').first();
  await opener.focus();
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close club details' })).toBeFocused();

  await expect(dialog.getByRole('region', { name: /record player/ })).toHaveCount(0);
  await expect(dialog.getByRole('heading', { name: 'Further listening' }).or(dialog.getByText(/Further listening research/))).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mute 1920s soundtrack' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.getByRole('button', { name: 'Mute 1920s soundtrack' })).toBeVisible();
});

test('decade soundtrack failure stays recoverable without blocking the gallery', async ({ page }) => {
  await page.getByRole('button', { name: '1980' }).click();
  await expect(page.getByRole('button', { name: 'Retry 1980s soundtrack' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry 1980s soundtrack' }).click();
  await expect(page.getByRole('button', { name: 'Mute 1980s soundtrack' })).toBeVisible();
  await page.getByRole('button', { name: 'Skip and continue to map' }).click();
  await expect(page.getByRole('button', { name: 'Mute 1980s soundtrack' })).toBeVisible();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Cherokee/);
});

test('soundtrack control mutes and resumes the looping gallery audio', async ({ page }) => {
  const mute = page.getByRole('button', { name: 'Mute 1920s soundtrack' });
  await expect(mute).toBeVisible();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-name', 'record-spin');
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'running');
  await expect(page.locator('.tonearm')).toHaveCSS('animation-name', 'none');
  await mute.hover();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'running');
  await mute.click();
  const play = page.getByRole('button', { name: 'Play 1920s soundtrack' });
  await expect(play).toBeVisible();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('data-audio-status', 'dropping');
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('data-audio-status', 'paused', { timeout: 2500 });
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-name', 'record-spin');
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'paused');
  await expect(page.locator('.tonearm')).not.toHaveCSS('transform', 'none');
  await page.mouse.move(0, page.viewportSize()!.height / 2);
  await play.hover();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'paused');
  await play.click();
  await expect(page.getByRole('button', { name: 'Mute 1920s soundtrack' })).toBeVisible();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'running');
});

test('record player allows switching between era music and Skating in Central Park', async ({ page }) => {
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Ain't Misbehavin'/);
  await page.locator('.soundtrack-unit').hover();
  const playTheme = page.getByRole('button', { name: 'Play NYC Theme' });
  await expect(playTheme).toBeVisible();
  await playTheme.click();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Skating in Central Park/);
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();

  await page.locator('.soundtrack-unit').hover();
  const playEra = page.getByRole('button', { name: 'Play 1920s' });
  await expect(playEra).toBeVisible();
  await playEra.click();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Ain't Misbehavin'/);
  await expect(page.getByRole('button', { name: 'Mute 1920s soundtrack' })).toBeVisible();
});

test('canvas accepts keyboard navigation and the layout does not overflow', async ({ page }) => {
  const canvas = page.locator('.infinite-canvas canvas');
  await expect(canvas).toBeVisible();
  await canvas.click({ position: { x: 20, y: page.viewportSize()!.height / 2 } });
  await page.keyboard.press('KeyW');
  await page.keyboard.press('ArrowRight');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const controls = await page.locator('[data-tour="controls"]').boundingBox();
  const timeline = await page.locator('[data-tour="timeline"]').boundingBox();
  expect(controls && timeline && timeline.y + timeline.height < controls.y).toBeTruthy();
  const map = await page.locator('[data-tour="map"]').boundingBox();
  expect(map?.x).toBeLessThan(page.viewportSize()!.width / 2);
});

test('club index remains usable when WebGL is unavailable', async ({ page }) => {
  await expect(page.locator('.canvas-loading')).toContainText('WebGL unavailable');
  await page.getByRole('button', { name: 'Browse and filter clubs' }).click();
  await expect(page.locator('.club-index-list button').first()).toBeVisible();
});
