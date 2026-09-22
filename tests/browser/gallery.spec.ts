import { expect, test } from '@playwright/test';

const enterGallery = async (page: import('@playwright/test').Page, keepTour = false) => {
  const enter = page.getByRole('button', { name: /Press and hold for four seconds/ });
  await enter.hover();
  await page.mouse.down();
  await page.waitForTimeout(4100);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toBeVisible();
  if (!keepTour) {
    const tour = page.getByRole('dialog', { name: 'Move around' });
    await expect(tour).toBeVisible({ timeout: 3000 });
    await tour.getByRole('button', { name: 'Skip' }).click();
  }
};

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes('audio is unavailable')) {
    await page.route('**/audio/skating-in-central-park.mp3', (route) => route.abort());
  }
  const path = testInfo.title.includes('WebGL is unavailable') ? '/?webgl=off' : '/';
  await page.goto(path);
  await expect(page.getByRole('button', { name: /Press and hold for four seconds/ })).toBeVisible();
  const startsAtEntrance = ['early release', 'keyboard hold', 'audio is unavailable'].some((phrase) => testInfo.title.includes(phrase));
  if (!startsAtEntrance) await enterGallery(page, testInfo.title.includes('guided tutorial'));
});

test('early release slows down and resets the entrance', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold for four seconds/ });
  await enter.hover();
  await page.mouse.down();
  await page.waitForTimeout(450);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toHaveCount(0);
  await expect(enter).toContainText('press and hold');
});

test('keyboard hold completes the gallery transition', async ({ page }) => {
  const enter = page.getByRole('button', { name: /Press and hold for four seconds/ });
  await enter.focus();
  await page.keyboard.down('Enter');
  await page.waitForTimeout(4100);
  await page.keyboard.up('Enter');
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('hold-to-enter remains available when audio is unavailable', async ({ page }) => {
  const status = page.getByRole('status');
  const enter = page.getByRole('button', { name: /Press and hold for four seconds/ });
  await enter.hover();
  await page.mouse.down();
  await expect(status).toContainText('Audio is unavailable');
  await page.waitForTimeout(4100);
  await page.mouse.up();
  await expect(page.locator('.gallery-app')).toBeVisible();
});

test('guided tutorial advances, persists, and can be replayed', async ({ page }) => {
  const tour = page.getByRole('dialog', { name: 'Move around' });
  await expect(tour).toBeVisible({ timeout: 3000 });
  await tour.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Move through time' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Find a room' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Watch the map' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('nyc-jazz-gallery-tour-v1'))).toBe('complete');
  await page.getByRole('button', { name: 'Show gallery tour' }).click();
  await expect(page.getByRole('dialog', { name: 'Move around' })).toBeVisible();
});

test('decade and scene controls filter the accessible club index', async ({ page }) => {
  await expect(page.locator('.loading-readout')).toHaveCount(0);
  await expect(page.getByText('Rooms That Held the Night')).toHaveCount(0);
  await expect(page.getByText('The Night Map')).toHaveCount(0);
  await expect(page.getByText('Move through the city’s club ecology')).toHaveCount(0);
  await page.getByRole('button', { name: 'Browse and filter clubs' }).click();
  const index = page.locator('.club-index');
  await expect(index.locator('.club-index-list button')).not.toHaveCount(0);

  await page.getByRole('button', { name: 'Downtown' }).click();
  const downtownCount = await index.locator('.club-index-list button').count();
  expect(downtownCount).toBeGreaterThan(0);

  const decade2020 = page.getByRole('button', { name: '2020' });
  await decade2020.click();
  await expect(decade2020).toHaveClass(/active/);
  await expect(page.getByRole('region', { name: /New York jazz-club map in the 2020s/ })).toBeVisible();
});

test('club details manage focus, listening state, and Escape dismissal', async ({ page }) => {
  await page.getByRole('button', { name: 'Browse and filter clubs' }).click();
  const opener = page.locator('.club-index-list button').first();
  await opener.focus();
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close club details' })).toBeFocused();

  const record = dialog.locator('.record').first();
  await record.evaluate((element) => {
    element.addEventListener('click', (event) => event.preventDefault(), { once: true });
    (element as HTMLElement).click();
  });
  await expect(record).toHaveClass(/is-playing/);
  await expect(page.getByRole('button', { name: 'Play gallery soundtrack' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();
});

test('soundtrack control mutes and resumes the looping gallery audio', async ({ page }) => {
  const mute = page.getByRole('button', { name: 'Mute gallery soundtrack' });
  await expect(mute).toBeVisible();
  await mute.click();
  const play = page.getByRole('button', { name: 'Play gallery soundtrack' });
  await expect(play).toBeVisible();
  await play.click();
  await expect(page.getByRole('button', { name: 'Mute gallery soundtrack' })).toBeVisible();
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
