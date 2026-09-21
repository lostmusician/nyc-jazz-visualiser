import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  const path = testInfo.title.includes('WebGL is unavailable') ? '/?webgl=off' : '/';
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Rooms That Held the Night' })).toBeVisible();
});

test('decade and scene controls filter the accessible club index', async ({ page }) => {
  await expect(page.locator('.loading-readout')).toHaveText(/archive 100%/);
  const index = page.locator('.club-index');
  await index.locator('summary').click();
  await expect(index.locator('.club-index-list button')).not.toHaveCount(0);

  await page.getByRole('button', { name: 'Downtown' }).click();
  const downtownCount = await index.locator('.club-index-list button').count();
  expect(downtownCount).toBeGreaterThan(0);

  await page.getByRole('button', { name: '2020' }).click();
  await expect(page.getByText('2020s', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('region', { name: /New York jazz-club map in the 2020s/ })).toBeVisible();
});

test('club details manage focus, listening state, and Escape dismissal', async ({ page }) => {
  await page.locator('.club-index summary').click();
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

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('canvas accepts keyboard navigation and the layout does not overflow', async ({ page }) => {
  const canvas = page.locator('.infinite-canvas canvas');
  await expect(canvas).toBeVisible();
  await canvas.click({ position: { x: 20, y: 20 } });
  await page.keyboard.press('KeyW');
  await page.keyboard.press('ArrowRight');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('club index remains usable when WebGL is unavailable', async ({ page }) => {
  await expect(page.locator('.canvas-loading')).toContainText('WebGL unavailable');
  await page.locator('.club-index summary').click();
  await expect(page.locator('.club-index-list button').first()).toBeVisible();
});
