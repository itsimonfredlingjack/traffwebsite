import { test, expect } from '@playwright/test';

const FIRST_ANSWER_START = 'Leverans sker inom tio (10) arbetsdagar';

test('the hero answers what, why and what next, and the demo starts on the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  await expect(page.locator('h1')).toContainText('Fråga Träff.');
  await expect(page.locator('.hero-assertion-lead')).toContainText('visar Träff exakt var');
  await expect(page.locator('.hero-assertion-refusal')).toContainText('Finns det inte där säger Träff det');
  await expect(page.locator('.hero-body-text')).toContainText('Den slår upp originalet');
  await expect(page.getByRole('button', { name: /Anmäl intresse/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Prova demon/ })).toBeVisible();
  await expect(page.locator('.hero-states-strip')).toHaveCount(0);

  const top = await page.locator('#demo-section').evaluate((el) => el.getBoundingClientRect().top);
  expect(top, 'the demo should begin within the first 800px screen').toBeLessThan(700);
});

test('on a phone the document row stays one row, and the source is one tap from the answer', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const row = await page.locator('.demo-scenario-tabs').evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    scrolls: el.scrollWidth > el.clientWidth,
  }));
  expect(row.height, 'the document row wraps into several lines').toBeLessThanOrEqual(64);
  expect(row.scrolls).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const open = page.getByRole('button', { name: /Se meningen i dokumentet/ });
  await expect(page.locator('.answer-prose-text')).toContainText(FIRST_ANSWER_START, { timeout: 20_000 });
  await expect(open).toBeVisible({ timeout: 20_000 });
  const fit = await page.evaluate(() => {
    const card = document.querySelector('.inquiry-answer-card').getBoundingClientRect();
    const btn = document.querySelector('.demo-open-doc-btn').getBoundingClientRect();
    const frame = document.querySelector('.demo-showcase-frame').getBoundingClientRect();
    return { cardRight: card.right, btnRight: btn.right, btnHeight: btn.height, frameRight: frame.right };
  });
  expect(fit.btnRight, 'the source button runs out of the answer card').toBeLessThanOrEqual(fit.cardRight + 1);
  expect(fit.cardRight, 'the answer card runs out of the demo frame').toBeLessThanOrEqual(fit.frameRight - 8);
  expect(fit.btnHeight).toBeLessThanOrEqual(44);
  await open.click();
  await expect(page.locator('.demo-doc-pane')).toBeVisible();
  await expect(page.locator('.demo-chat-pane')).toBeHidden();

  // While the visitor reads the document the story must not rotate to the next one.
  await page.waitForTimeout(11_000);
  await expect(page.locator('.demo-scenario-tab-btn.active .tab-category')).toHaveText('OFFERT');
  await expect(page.locator('.demo-doc-pane')).toBeVisible();
});

test('reduced motion shows the finished loop at once and does not rotate', async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'start' }));

  await expect(page.locator('.answer-prose-text')).toContainText('Frakt ingår', { timeout: 5_000 });
  await expect(page.locator('.answer-prose-text')).toContainText(FIRST_ANSWER_START);
  await expect(page.locator('.state-name-mono')).toHaveText('BELAGT');
  await expect(page.locator('.demo-cursor-blink')).toHaveCount(0);
  await expect(page.locator('.citation-num-pill')).toHaveCount(2);

  await page.waitForTimeout(11_000);
  await expect(page.locator('.demo-scenario-tab-btn.active .tab-category')).toHaveText('OFFERT');

  // The refusal still says so, with no pen drawn on the page.
  await page.getByRole('tab', { name: /^VÄGRAN:/ }).click();
  await expect(page.locator('.state-name-mono')).toHaveText('EJ BELAGT', { timeout: 5_000 });
  await expect(page.locator('[data-testid="citation-highlight"]')).toHaveCount(0);
});
