import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  const path = testInfo.title.includes('WebGL is unavailable') ? '/?webgl=off' : '/';
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Come in. The city’s still playing.' })).toBeVisible();
  await page.getByRole('button', { name: /Enter the gallery/ }).click();
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
  await page.getByRole('button', { name: 'Browse and filter clubs' }).click();
  await expect(page.locator('.club-index-list button').first()).toBeVisible();
});
