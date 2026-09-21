import { expect, test } from '@playwright/test';

test('the address story stays singular and the city archive remains lazy', async ({ page }, testInfo) => {
  const errors: string[] = [];
  const mapRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => { if (/mapbox-gl|InteractiveDataMap/.test(request.url())) mapRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '77 Greene Street' })).toBeVisible();
  expect(mapRequests).toEqual([]);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-greene-historic.png` });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('ten stubs can be moved by keyboard but essential claims stay fixed', async ({ page }, testInfo) => {
  await page.goto('/#allocation');
  await expect(page.locator('#allocation')).toBeInViewport();
  const artistsStub = page.getByRole('button', { name: /Movable 10% ticket stub for Artists/ }).first();
  await artistsStub.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.allocation-artists .allocation-row-label b')).toHaveText('30%');
  await expect(page.locator('.allocation-outcome')).toContainText('another night remains possible');
  const claimed = page.getByRole('button', { name: /Claimed 10% ticket stub for Property/ }).first();
  await expect(claimed).toHaveClass(/is-claimed/);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-allocation.png` });
});

test('legacy links return to the address and the direct map link survives refresh', async ({ page }) => {
  await page.goto('/#room/clubs');
  await expect(page.getByRole('heading', { name: '77 Greene Street' })).toBeInViewport();
  await page.goto('/#map');
  await expect(page.locator('#city')).toBeInViewport();
  await page.reload();
  await expect(page.locator('#city')).toBeInViewport();
});

test('sources disclose the illustrative model and image provenance', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sources' }).click();
  const dialog = page.getByRole('dialog', { name: 'Sources & method' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('illustrative, not a reconstruction');
  await expect(dialog.getByRole('link')).toHaveCount(14);
  await page.getByRole('button', { name: 'Close sources' }).click();
  await expect(dialog).not.toBeVisible();
});

test('the same windows comparison responds to keyboard controls', async ({ page }, testInfo) => {
  await page.goto('/#present');
  const seam = page.getByRole('slider', { name: 'Compare the historic and present façade' });
  await expect(seam).toBeVisible();
  await seam.focus();
  await page.keyboard.press('Home');
  await expect(seam).toHaveAttribute('aria-valuenow', '0');
  await page.keyboard.press('ArrowRight');
  await expect(seam).toHaveAttribute('aria-valuenow', '2');
  await page.keyboard.press('End');
  await expect(seam).toHaveAttribute('aria-valuenow', '100');
  await page.screenshot({ path: `test-results/${testInfo.project.name}-facade-present.png` });
});

test('archival traces can be illuminated without pointer input', async ({ page }) => {
  await page.goto('/#room');
  const trace = page.getByRole('button', { name: /Performance room/ });
  await trace.focus();
  await expect(trace).toHaveClass(/is-active/);
  await expect(page.locator('.room-made-sticky')).toHaveClass(/has-room-light/);
});
