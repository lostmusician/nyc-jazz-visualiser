import { expect, test } from '@playwright/test';

const enterGallery = async (page: import('@playwright/test').Page, keepTour = false) => {
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
  await enter.hover();
  await page.mouse.down();
  await page.waitForTimeout(5100);
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
  await expect(page.getByRole('button', { name: /Press and hold for five seconds/ })).toBeVisible();
  const startsAtEntrance = ['early release', 'keyboard hold', 'global Spacebar', 'audio is unavailable', 'rapid successive presses', 'continues from the entrance'].some((phrase) => testInfo.title.includes(phrase));
  if (!startsAtEntrance) await enterGallery(page, testInfo.title.includes('guided tutorial'));
});

test('early release slows down and resets the entrance', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
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
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
  await enter.focus();
  await page.keyboard.down('Enter');
  await page.waitForTimeout(5100);
  await page.keyboard.up('Enter');
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('global Spacebar visibly slows through its final second and completes at five seconds', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
  await expect(enter).not.toBeFocused();
  await page.keyboard.down('Space');
  await expect(enter).toHaveAttribute('aria-pressed', 'true');
  await expect(enter).toHaveClass(/is-holding/);
  await page.waitForTimeout(4100);
  await expect(enter).not.toHaveClass(/is-ready/);
  const beforeFinalSecond = Number(await enter.getAttribute('data-hold-progress'));
  expect(beforeFinalSecond).toBeGreaterThan(0.85);
  expect(beforeFinalSecond).toBeLessThan(0.95);
  await page.waitForTimeout(1050);
  await expect(enter).toHaveClass(/is-ready/);
  await expect(enter).toContainText('Release');
  await page.keyboard.up('Space');
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('gallery soundtrack continues from the entrance after the Spacebar hold', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
  await enter.focus();
  await page.keyboard.down('Space');
  await page.waitForTimeout(5100);
  await page.keyboard.up('Space');
  await expect(page.locator('.gallery-app')).toBeVisible();
  const soundtrack = page.locator('.soundtrack-toggle');
  const handoffTime = Number(await soundtrack.getAttribute('data-audio-time'));
  expect(handoffTime).toBeGreaterThan(1);
  await expect.poll(async () => Number(await soundtrack.getAttribute('data-audio-time'))).toBeGreaterThan(handoffTime);
});

test('rapid successive presses replay the tactile Spacebar sound', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
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
  const enter = page.getByRole('button', { name: /Press and hold for five seconds/ });
  await enter.hover();
  await page.mouse.down();
  await expect(status).toContainText('Audio is unavailable');
  await page.waitForTimeout(5100);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('guided tutorial is compulsory, advances, persists, and can be replayed', async ({ page }) => {
  const tour = page.getByRole('dialog', { name: 'Move around' });
  await expect(tour).toBeVisible({ timeout: 3000 });
  await expect(tour.getByRole('button', { name: /Skip|Close/ })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(tour).toBeVisible();
  await expect(page.locator('.gallery-surface')).toHaveAttribute('inert', '');
  await tour.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Follow the city through time' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Find a room' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  const soundtrackTour = page.getByRole('dialog', { name: 'Control the soundtrack' });
  await expect(soundtrackTour).toBeVisible();
  await expect(soundtrackTour).toContainText('spin the music down to mute');
  await expect(page.locator('[data-tour="soundtrack"]')).toBeVisible();
  await soundtrackTour.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Watch the map' })).toBeVisible();
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
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Skating in Central Park/);
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
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Skating in Central Park/);
  await expect(page.getByRole('button', { name: /gallery soundtrack/ })).toBeVisible();
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
  await expect(page.getByRole('button', { name: '1980' })).toHaveClass(/active/);
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
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();
});

test('decade soundtrack failure stays recoverable without blocking the gallery', async ({ page }) => {
  await page.getByRole('button', { name: '1980' }).click();
  await expect(page.getByRole('button', { name: 'Retry 1980s soundtrack' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry 1980s soundtrack' }).click();
  await expect(page.getByRole('button', { name: 'Mute 1980s soundtrack' })).toBeVisible();
  await page.getByRole('button', { name: 'Skip and continue to map' }).click();
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();
  await expect(page.locator('.soundtrack-toggle')).toHaveAttribute('title', /Skating in Central Park/);
});

test('soundtrack control mutes and resumes the looping gallery audio', async ({ page }) => {
  const mute = page.getByRole('button', { name: 'Mute gallery soundtrack' });
  await expect(mute).toBeVisible();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-name', 'record-spin');
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'running');
  await expect(page.locator('.tonearm')).toHaveCSS('animation-name', 'none');
  await mute.hover();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'running');
  await mute.click();
  const play = page.getByRole('button', { name: 'Play gallery soundtrack' });
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
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();
  await expect(page.locator('.vinyl-disc')).toHaveCSS('animation-play-state', 'running');
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
