/**
 * Full-page pixel diff of the HEAD baseline against the current build.
 * Both servers must already be running:
 *   baseline  http://127.0.0.1:4173
 *   current   http://127.0.0.1:4174
 *
 * The demo's story timer is held in VILA so the comparison is the resting page,
 * not two different frames of the same animation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const OUT = path.resolve('screenshots/verify');
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 812 },
];

const FREEZE_STORY = `
  window.IntersectionObserver = class {
    constructor(cb) { this._cb = cb; }
    observe() { this._cb([{ isIntersecting: false, intersectionRatio: 0, target: null }]); }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
`;

async function shoot(browser, url, viewport, file, consoleFile) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const lines = [];
  page.on('console', (msg) => lines.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => lines.push(`[pageerror] ${err.message}`));
  page.on('requestfailed', (req) => lines.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText || ''}`));
  await page.addInitScript(FREEZE_STORY);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.demo-white-sheet canvas');
    const loading = document.querySelector('.pdf-pane-loading');
    return canvas && canvas.width > 50 && !loading;
  }, { timeout: 20000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  // Playwright's fullPage capture widens this page. CDP clip stays at the CSS size.
  const client = await page.context().newCDPSession(page);
  const { cssContentSize } = await client.send('Page.getLayoutMetrics');
  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: cssContentSize.width,
      height: cssContentSize.height,
      scale: 1,
    },
  });
  fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
  const box = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));
  if (consoleFile) fs.writeFileSync(consoleFile, lines.join('\n') + '\n');
  await page.close();
  return { lines, box };
}

function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function compare(name) {
  const a = readPng(path.join(OUT, `baseline-${name}.png`));
  const b = readPng(path.join(OUT, `current-${name}.png`));
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const base = new PNG({ width, height });
  const curr = new PNG({ width, height });
  PNG.bitblt(a, base, 0, 0, a.width, a.height, 0, 0);
  PNG.bitblt(b, curr, 0, 0, b.width, b.height, 0, 0);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(base.data, curr.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });
  const strict = new PNG({ width, height });
  const strictCount = pixelmatch(base.data, curr.data, strict.data, width, height, {
    threshold: 0,
    includeAA: true,
  });
  fs.writeFileSync(path.join(OUT, `diff-${name}.png`), PNG.sync.write(diff));
  const total = width * height;
  return {
    name,
    baseline: { width: a.width, height: a.height },
    current: { width: b.width, height: b.height },
    mismatched,
    strictCount,
    total,
    ratio: mismatched / total,
  };
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-device-scale-factor=1'],
});

const report = [];
for (const viewport of VIEWPORTS) {
  const baseShot = await shoot(
    browser,
    'http://127.0.0.1:4173/',
    viewport,
    path.join(OUT, `baseline-${viewport.name}.png`),
  );
  const currShot = await shoot(
    browser,
    'http://127.0.0.1:4174/',
    viewport,
    path.join(OUT, `current-${viewport.name}.png`),
    path.join(OUT, `console-${viewport.name}.log`),
  );
  const diff = compare(viewport.name);
  diff.scroll = { baseline: baseShot.box, current: currShot.box };
  diff.console = currShot.lines;
  report.push(diff);
  console.log(JSON.stringify({
    name: diff.name,
    baseline: diff.baseline,
    current: diff.current,
    mismatched: diff.mismatched,
    strictCount: diff.strictCount,
    ratio: Number(diff.ratio.toFixed(6)),
    consoleCount: currShot.lines.length,
  }));
}

fs.writeFileSync(path.join(OUT, 'pixel-report.json'), JSON.stringify(report, null, 2));
await browser.close();
