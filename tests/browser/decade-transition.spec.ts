import { expect, test } from '@playwright/test';

async function openStory(page: import('@playwright/test').Page, noWebGL=false) {
  await page.addInitScript(() => localStorage.setItem('nyc-jazz-gallery-tour-v2','complete'));
  await page.goto(noWebGL ? '/?webgl=off' : '/');
  const enter=page.getByRole('button',{name:/Press and hold/});
  await enter.focus();
  await page.keyboard.down('Enter');
  await page.waitForTimeout(3600);
  await page.keyboard.up('Enter');
  await page.getByRole('button',{name:'1990',exact:true}).click();
  const end=page.locator('[data-story-beat="1990-impact"]');
  await end.scrollIntoViewIfNeeded();
  return end;
}

test('Explore plays the previous decade into the selected decade in the same gallery', async ({page}) => {
  const errors: string[]=[];
  page.on('pageerror',error => errors.push(error.message));
  page.on('console',message => { if (message.type()==='error' && /shader|THREE.WebGLProgram/i.test(message.text())) errors.push(message.text()); });
  const end=await openStory(page);
  await expect(end.locator('.story-ending-actions button')).toHaveCount(1);
  await expect(page.getByRole('button',{name:'Watch the city change →'})).toHaveCount(0);
  await page.locator('.infinite-canvas canvas').evaluate((canvas) => canvas.setAttribute('data-persist-probe','same-canvas'));
  await end.getByRole('button',{name:'Explore the 1990s'}).click();
  const interlude=page.locator('[data-decade-change="1980-1990"]');
  await expect(interlude).toBeVisible();
  await expect(page.locator('.infinite-canvas canvas')).toBeVisible();
  await expect(interlude.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.infinite-canvas')).toHaveAttribute('data-gallery-transition', 'active');
  await expect(interlude).toHaveCount(0,{timeout:12000});
  await expect(page.getByRole('button',{name:'1990',exact:true})).toHaveAttribute('aria-current','page');
  await expect(page.getByRole('button',{name:'Browse and filter clubs'})).toBeVisible();
  await expect(page.getByRole('button',{name:'1990',exact:true})).toBeFocused();
  await expect(page.locator('.infinite-canvas canvas')).toHaveAttribute('data-persist-probe','same-canvas');
  expect(errors).toEqual([]);
});

test('interlude can be skipped or interrupted by another decade', async ({page}) => {
  await page.clock.install();
  const end=await openStory(page);
  // Hold even the half-second reduced-motion interlude while exercising controls.
  const pauseClock = async () => page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  await pauseClock();
  await end.getByRole('button',{name:'Explore the 1990s'}).click();
  await page.getByRole('button',{name:'Skip transition'}).click();
  await expect(page.getByRole('button',{name:'1990',exact:true})).toHaveAttribute('aria-current','page');
  await page.clock.resume();
  await page.getByRole('button',{name:'1990',exact:true}).click();
  await page.locator('[data-story-beat="1990-impact"]').scrollIntoViewIfNeeded();
  await pauseClock();
  await page.getByRole('button',{name:'Explore the 1990s'}).click();
  await page.getByRole('button',{name:'2000',exact:true}).click();
  await expect(page.locator('.decade-change')).toHaveCount(0);
  await expect(page.locator('[data-story-decade="2000"]')).toBeVisible();
  await page.clock.runFor(5500);
  await expect(page.getByRole('button',{name:'2000',exact:true})).toHaveAttribute('aria-current','page');
});

test('interlude completes without WebGL and leaves the club index usable', async ({page}) => {
  const end=await openStory(page,true);
  await end.getByRole('button',{name:'Explore the 1990s'}).click();
  await expect(page.locator('.decade-change')).toHaveCount(0,{timeout:3000});
  await page.getByRole('button',{name:'Browse and filter clubs'}).click();
  await expect(page.locator('.club-index-list button').first()).toBeVisible();
});

test('the first decade opens directly and the last decade transitions without wrapping', async ({page}) => {
  await openStory(page);
  await page.getByRole('button',{name:'1920',exact:true}).click();
  await page.locator('[data-story-beat="1920-impact"]').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Explore the 1920s'}).click();
  await expect(page.locator('.decade-change')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Browse and filter clubs'})).toBeVisible();
  await expect(page.getByRole('button',{name:'1920',exact:true})).toHaveAttribute('aria-current','page');
  await page.getByRole('button',{name:'2020',exact:true}).click();
  await page.locator('[data-story-beat="2020-impact"]').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Explore the 2020s'}).click();
  await expect(page.locator('[data-decade-change="2010-2020"]')).toBeVisible();
  await page.getByRole('button',{name:'Skip transition'}).click();
  await expect(page.getByRole('button',{name:'2020',exact:true})).toHaveAttribute('aria-current','page');
  await expect(page.getByRole('button',{name:'Browse and filter clubs'})).toBeVisible();
});
