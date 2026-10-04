import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axe = require('axe-core');

const NAV = [
  ['Demo', '#demo-section'],
  ['Skillnaden', '#comparison-section'],
  ['Principen', '#use-cases-section'],
  ['Arkitektur & trygghet', '#features-section'],
];

const SCENARIOS = [
  ['OFFERT', 'BELAGT'],
  ['AVTAL', 'BELAGT'],
  ['PROTOKOLL', 'BELAGT'],
  ['VÄGRAN', 'EJ BELAGT'],
  ['POLICY', 'BELAGT'],
];

test('prerendered page hydrates, scrolls, and runs the demo', async ({ page, context }) => {
  const consoleLines = [];
  const fontHosts = [];
  page.on('console', (msg) => consoleLines.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => consoleLines.push(`[pageerror] ${err.message}`));
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) fontHosts.push(url);
    if (url.includes('/traffwebsite/')) consoleLines.push(`[bad-base] ${url}`);
  });

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const loadedFonts = await page.evaluate(() => {
    const names = new Set();
    document.fonts.forEach((font) => {
      if (font.status === 'loaded') names.add(`${font.family} ${font.style}`);
    });
    return [...names].sort();
  });
  expect(loadedFonts).toEqual(expect.arrayContaining([
    'Instrument Sans italic',
    'Instrument Sans normal',
    'Instrument Serif italic',
    'Instrument Serif normal',
    'JetBrains Mono normal',
  ]));
  expect(fontHosts, 'no Google Fonts requests').toEqual([]);

  // Nav links scroll to the section and update the hash.
  for (const [label, hash] of NAV) {
    await page.locator('.navbar-links').getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect.poll(async () => page.locator(hash).evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(4);
  }

  // Footer links do the same.
  await page.locator('.footer-nav-col').getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/#demo-section$/);

  // Skip link moves focus to main.
  await page.locator('.skip-link').focus();
  await page.locator('.skip-link').press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  // Each demo scenario leaves VILA for the right state. Copy and redo work.
  // The story only starts with the demo on screen. The skip link starts a smooth
  // scroll to the top, so wait for it to stop, then centre the tabs: at the very
  // top they sit under the sticky header, and Playwright would scroll the click
  // target to the bottom edge, taking the demo out of view.
  await page.evaluate(() => new Promise((resolve) => {
    let timer = setTimeout(resolve, 300);
    window.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(resolve, 300);
    });
  }));
  await page.getByRole('tab', { name: /^OFFERT:/ }).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  for (const [tag, state] of SCENARIOS) {
    await page.getByRole('tab', { name: new RegExp(`^${tag}:`) }).click();
    await expect(page.locator('.state-name-mono')).toHaveText(state);
    if (tag === 'OFFERT') {
      await page.getByRole('button', { name: 'Kopiera' }).click();
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toContain('arbetsdagar');
      await page.evaluate(() => {
        window.__sawVila = false;
        const el = document.querySelector('.state-name-mono');
        const obs = new MutationObserver(() => {
          if (el.textContent.trim() === 'VILA') window.__sawVila = true;
        });
        obs.observe(el, { childList: true, characterData: true, subtree: true });
      });
      await page.getByRole('button', { name: 'Gör om' }).click();
      await expect.poll(() => page.evaluate(() => window.__sawVila)).toBe(true);
      await expect(page.locator('.state-name-mono')).toHaveText('BELAGT');
    }
  }

  // FAQ: click and keyboard.
  const first = page.locator('.faq-question-editorial-btn').first();
  const second = page.locator('.faq-question-editorial-btn').nth(1);
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-answer-0')).toBeHidden();
  await second.focus();
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-answer-1')).toBeVisible();
  await second.press(' ');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await first.click();
  await expect(page.locator('#faq-answer-0')).toBeVisible();

  // Booking form submits.
  await page.locator('.navbar-btn-action').click();
  await expect(page.getByRole('heading', { name: 'Boka personlig genomgång' })).toBeVisible();
  await page.locator('#name').fill('Ada Test');
  await page.locator('#email').fill('ada@example.com');
  await page.locator('#company').fill('Exempelbolaget AB');
  await page.getByRole('button', { name: 'Skicka förfrågan' }).click();
  await expect(page.getByRole('heading', { name: 'Tack för ditt intresse' })).toBeVisible();
  await page.getByRole('button', { name: 'Stäng fönstret' }).click();
  await expect(page.locator('.modal-backdrop')).toHaveCount(0);

  const bad = consoleLines.filter((line) =>
    /^\[(error|pageerror|bad-base)\]/.test(line)
    || /hydration|did not match|Hydration failed/i.test(line)
    || /was preloaded using link preload but not used/i.test(line)
  );
  const out = path.resolve('screenshots/verify/console.log');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, [
    '# console',
    ...consoleLines,
    '',
    '# loaded fonts',
    ...loadedFonts,
    '',
    bad.length ? `# FAILURES\n${bad.join('\n')}` : '# no console errors',
    '',
  ].join('\n'));
  expect(bad, bad.join('\n')).toEqual([]);
});

test('mobile menu link updates the hash', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Öppna meny' }).click();
  await page.locator('.navbar-mobile-drawer').getByRole('link', { name: 'Frågor & svar' }).click();
  await expect(page).toHaveURL(/#faq-section$/);
  await expect.poll(async () => page.locator('#faq-section').evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(4);
  await expect(page.locator('.navbar-mobile-drawer')).toHaveCount(0);
});

test('desktop nav links land on their section', async ({ page }) => {
  for (const id of ['comparison-section', 'use-cases-section', 'features-section']) {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator(`header a.navbar-link[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect.poll(async () => page.locator(`#${id}`).evaluate((el) => Math.abs(el.getBoundingClientRect().top)), { message: id }).toBeLessThan(4);
  }
});

const AXE_SCENARIOS = [
  ['OFFERT', 'BELAGT'],
  ['AVTAL', 'BELAGT'],
  ['PROTOKOLL', 'BELAGT'],
  ['VÄGRAN', 'EJ BELAGT'],
  ['POLICY', 'BELAGT'],
];

async function axeProblems(page) {
  return page.evaluate(async () => {
    const results = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      rules: { 'target-size': { enabled: true } },
      resultTypes: ['violations'],
    });
    return results.violations
      .filter((rule) => rule.id === 'color-contrast' || rule.id === 'target-size')
      .flatMap((rule) => rule.nodes.map((node) => `${rule.id} ${node.target.join(' ')}`));
  });
}

async function scanInView(page, selector) {
  if (selector) await page.locator(selector).first().scrollIntoViewIfNeeded();
  return axeProblems(page);
}

async function setHold(page, phase) {
  await page.evaluate((phase) => {
    document.documentElement.setAttribute('data-demo-hold', phase);
  }, phase);
}

async function showScenario(page, tag) {
  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const active = (await page.locator('.demo-scenario-tab-btn.active .tab-category').innerText()).trim();
  if (active === tag) {
    const other = tag === 'OFFERT' ? 'AVTAL' : 'OFFERT';
    await page.getByRole('tab', { name: new RegExp(`^${other}:`) }).click();
  }
  await page.getByRole('tab', { name: new RegExp(`^${tag}:`) }).click();
  // The tab sits at the top of a tall frame. Focusing it can scroll that
  // edge to the viewport and leave the demo below the autoplay threshold.
  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'center' }));
}

test('axe finds no contrast or target-size violations in any demo state', async ({ page }) => {
  test.setTimeout(240_000);
  const problems = [];
  await page.addInitScript(() => {
    document.documentElement.setAttribute('data-demo-hold', 'vila');
  });

  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: width === 1280 ? 800 : 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axe.source });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#demo-section').scrollIntoViewIfNeeded();

    const paint = await page.evaluate(() => {
      const color = (selector) => getComputedStyle(document.querySelector(selector)).color;
      const root = getComputedStyle(document.documentElement);
      return {
        belagt: root.getPropertyValue('--belagt').trim(),
        ejBelagt: root.getPropertyValue('--ej-belagt').trim(),
        refusal: color('.hero-assertion-refusal'),
        kicker: color('.hero-mono-kicker'),
        brand: color('.navbar-mono-label'),
      };
    });
    expect(paint.belagt).toBe('#137855');
    expect(paint.ejBelagt).toBe('#8a5d06');
    expect(paint.refusal).toBe('rgb(90, 90, 85)');
    expect(paint.kicker).toBe('rgb(90, 90, 85)');
    expect(paint.brand).toBe('rgb(90, 90, 85)');

    const note = async (where, selector) => {
      for (const hit of await scanInView(page, selector)) problems.push(`${width} ${where} ${hit}`);
    };

    await note('vila', '.hero-assertion-refusal');
    if (width === 375) {
      await page.getByRole('button', { name: /Källdokument/ }).click();
      await note('vila doc', '.demo-doc-header');
      await page.getByRole('button', { name: /Ärende/ }).click();
    }

    for (const [tag, terminal] of AXE_SCENARIOS) {
      await setHold(page, 'soker');
      await showScenario(page, tag);
      await page.locator('.state-soker-label').waitFor({ timeout: 8000 });
      await note(`${tag} soker`, '.state-soker-sub');

      await setHold(page, 'typing');
      await page.locator('.demo-cursor-blink').waitFor({ timeout: 8000 });
      await note(`${tag} typing`, '.demo-cursor-blink');

      await setHold(page, 'result');
      await page.waitForFunction((terminal) => {
        const el = document.querySelector('.state-name-mono');
        return el && el.textContent.trim() === terminal;
      }, terminal, { timeout: 20000 });
      await page.locator('.inquiry-citations-index').waitFor({ timeout: 5000 });
      await note(`${tag} result`, '.index-num');
      await note(`${tag} result-pill`, '.citation-num-pill');

      if (width === 375) {
        await page.getByRole('button', { name: /Källdokument/ }).click();
        await note(`${tag} doc`, 'button[aria-label="Nästa sida"]');
        await page.getByRole('button', { name: /Ärende/ }).click();
      }
    }
  }

  expect(problems, problems.join('\n')).toEqual([]);
});

function isPdfRuntime(url) {
  return /pdf\.worker|pdf\.min|\/pdfjs[-.]|demo-pdf\//.test(url);
}

test('pdf.js stays unloaded until the demo is on screen, then the story runs', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const pdfUrls = [];
  page.on('request', (req) => {
    if (isPdfRuntime(req.url())) pdfUrls.push(req.url());
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const placement = await page.locator('#demo-section').evaluate((el) => {
    const r = el.getBoundingClientRect();
    const visible = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    return { ratio: r.height ? visible / r.height : 1, top: r.top, height: r.height };
  });
  expect(placement.ratio, JSON.stringify(placement)).toBeLessThan(0.2);
  expect(pdfUrls, `pdf runtime fetched before scroll:\n${pdfUrls.join('\n')}`).toEqual([]);
  await expect(page.locator('.state-name-mono')).toHaveText('VILA');

  await page.getByRole('button', { name: 'Öppna meny' }).click();
  await page.locator('.navbar-mobile-drawer').getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/#demo-section$/);
  await expect(page.locator('.state-name-mono')).toHaveText('BELAGT', { timeout: 20000 });
  await expect.poll(() => pdfUrls.length, { timeout: 15000 }).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Källdokument/ }).click();
  await expect.poll(async () => page.locator('.demo-white-sheet canvas').evaluate((c) => c.width), { timeout: 15000 }).toBeGreaterThan(50);

  // A fresh load on the demo hash must arm pdf.js without a second scroll.
  // The chunk may come from cache, so the check is the painted page, not a second request.
  await page.goto('/#demo-section', { waitUntil: 'networkidle' });
  await expect(page.locator('.state-name-mono')).toHaveText('BELAGT', { timeout: 20000 });
  await page.getByRole('button', { name: /Källdokument/ }).click();
  await expect.poll(async () => page.locator('.demo-white-sheet canvas').evaluate((c) => c.width), { timeout: 15000 }).toBeGreaterThan(50);
  const hashed = await page.evaluate(() => performance.getEntriesByType('resource').map((r) => r.name));
  expect(hashed.some((url) => isPdfRuntime(url)), hashed.filter((url) => /pdf|worker/.test(url)).join('\n')).toBe(true);
});

test('status mark draws a core only when a passage is verified', async ({ page }) => {
  // The page shows each state only while the demo is in it, so walk the demo
  // through VILA, SÖKER, BELAGT and EJ BELAGT and read the marks in each.
  await page.addInitScript(() => {
    document.documentElement.setAttribute('data-demo-hold', 'vila');
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const read = (state) => page.evaluate((name) => {
    const nodes = [...document.querySelectorAll(`.traff-mark--${name}`)];
    return {
      count: nodes.length,
      cores: nodes.reduce((n, el) => n + el.querySelectorAll('.traff-mark-core').length, 0),
      filledCircles: nodes.reduce((n, el) => n + [...el.querySelectorAll('circle')].filter((c) => {
        const fill = c.getAttribute('fill');
        return fill && fill !== 'none';
      }).length, 0),
    };
  }, state);

  const marks = {};
  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  marks.vila = await read('vila');

  await showScenario(page, 'OFFERT');
  await setHold(page, 'soker');
  await page.locator('.state-soker-label').waitFor({ timeout: 8000 });
  marks.soker = await read('soker');

  await setHold(page, 'result');
  await expect(page.locator('.state-name-mono')).toHaveText('BELAGT', { timeout: 20000 });
  marks.belagt = await read('belagt');

  await page.getByRole('tab', { name: /^VÄGRAN:/ }).click();
  await expect(page.locator('.state-name-mono')).toHaveText('EJ BELAGT', { timeout: 20000 });
  marks.ejbelagt = await read('ejbelagt');

  for (const state of ['vila', 'soker', 'ejbelagt']) {
    expect(marks[state].count, state).toBeGreaterThan(0);
    expect(marks[state].cores, `${state} core`).toBe(0);
    expect(marks[state].filledCircles, `${state} filled circle`).toBe(0);
  }
  expect(marks.belagt.count).toBeGreaterThan(0);
  expect(marks.belagt.cores).toBe(marks.belagt.count);
  expect(marks.belagt.filledCircles).toBe(marks.belagt.count);

  await expect(page.locator('.navbar-brand-lockup .traff-wordmark')).toHaveCount(1);
  await expect(page.locator('.navbar-brand-name')).toHaveCount(0);
  await expect(page.locator('.traff-mark--brand')).toHaveCount(0);
  await expect(page.locator('.navbar-brand-lockup').getByRole('img', { name: 'Träff' })).toHaveCount(1);
  await expect(page.locator('.navbar-brand-lockup .traff-wordmark--draw')).toHaveCount(0);

  const logoUrl = await page.locator('script[type="application/ld+json"]').evaluate((el) => {
    const graph = JSON.parse(el.textContent)['@graph'];
    return graph.find((node) => node['@type'] === 'Organization').logo;
  });
  expect(logoUrl).toMatch(/\/logo\.png$/);
  const logo = await page.request.get('/logo.png');
  expect(logo.status()).toBe(200);
  const bytes = await logo.body();
  expect(bytes.subarray(1, 4).toString()).toBe('PNG');
  expect(bytes.readUInt32BE(16)).toBeGreaterThanOrEqual(512);

  // Reduced motion: the demo skips the scan and typing and shows the finished
  // loop, so no mark animates. SÖKER is never on screen, which is the point.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.removeAttribute('data-demo-hold'));
  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect(page.locator('.state-name-mono')).toHaveText('BELAGT', { timeout: 20000 });
  const animation = (selector) => page.evaluate((sel) => {
    const els = [...document.querySelectorAll(sel)];
    return els.length ? els.map((el) => getComputedStyle(el).animationName) : ['missing'];
  }, selector);
  expect(new Set(await animation('.traff-mark--belagt .traff-mark-core'))).toEqual(new Set(['none']));
  expect(await animation('.traff-mark-seek')).toEqual(['missing']);
  await page.getByRole('tab', { name: /^VÄGRAN:/ }).click();
  await expect(page.locator('.state-name-mono')).toHaveText('EJ BELAGT', { timeout: 20000 });
  expect(new Set(await animation('.traff-mark--ejbelagt .traff-mark-stamp'))).toEqual(new Set(['none']));
  expect(new Set(await animation('.pen-stroke-hero'))).toEqual(new Set(['none']));
});
