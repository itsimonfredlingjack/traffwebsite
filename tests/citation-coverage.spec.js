import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { DEMO_SCENARIOS } from '../src/data/demoScenarios.js';

const require = createRequire(import.meta.url);
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
  require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs'),
).href;

// Nimbus Sans metrics (Helvetica-compatible). Fedora and Debian/Ubuntu keep them
// in different places; set AFM_PATH to override.
const AFM_CANDIDATES = [
  process.env.AFM_PATH,
  '/usr/share/fonts/urw-base35/NimbusSans-Regular.afm',
  '/usr/share/fonts/type1/urw-base35/NimbusSans-Regular.afm',
].filter(Boolean);
const AFM = AFM_CANDIDATES.find((candidate) => fs.existsSync(candidate));
if (!AFM) {
  throw new Error(`NimbusSans-Regular.afm not found. Tried: ${AFM_CANDIDATES.join(', ')}. Install fonts-urw-base35 or set AFM_PATH.`);
}
const wx = new Map();
const named = { aring: 229, adieresis: 228, odieresis: 246, Aring: 197, Adieresis: 196, Odieresis: 214, eacute: 233 };
for (const line of fs.readFileSync(AFM, 'utf8').split('\n')) {
  const match = line.match(/^C (-?\d+) ; WX (\d+) ; N (\w+) ;/);
  if (!match) continue;
  if (Number(match[1]) >= 0) wx.set(Number(match[1]), Number(match[2]));
  if (named[match[3]]) wx.set(named[match[3]], Number(match[2]));
}

function widthOf(text, size) {
  let width = 0;
  for (const ch of text) width += wx.get(ch.codePointAt(0)) ?? 500;
  return (width * size) / 1000;
}

function token(text) {
  return text.replace(/[−–—]/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '').toLowerCase();
}

function wordsOf(item) {
  const size = item.height || 10;
  let x = item.transform[4];
  const parts = item.str.split(/(\s+)/).filter(Boolean).map((str) => {
    const word = { str, x, w: widthOf(str, size), baseline: item.transform[5], size, gap: /^\s+$/.test(str) };
    x += word.w;
    return word;
  });
  const sum = parts.reduce((total, part) => total + part.w, 0);
  if (item.width && sum && Math.abs(sum - item.width) > 1) {
    const scale = item.width / sum;
    let cursor = item.transform[4];
    for (const part of parts) {
      part.w *= scale;
      part.x = cursor;
      cursor += part.w;
    }
  }
  return parts.filter((part) => !part.gap && token(part.str));
}

function pdfPath(url) {
  const name = url.split('/').pop();
  return `public/demo-pdf/${name}`;
}

async function pageWords(file, pageNo) {
  const doc = await pdfjs.getDocument({ url: pathToFileURL(file).href }).promise;
  const page = await doc.getPage(pageNo);
  const viewport = page.getViewport({ scale: 1 });
  const content = await page.getTextContent();
  const items = content.items.filter((item) => item.str && item.str.trim());
  const overflow = items.filter((item) => item.transform[4] + item.width > 593);
  const words = items.flatMap(wordsOf);
  words.sort((a, b) => b.baseline - a.baseline || a.x - b.x);
  return { pageH: viewport.height, words, overflow: overflow.map((item) => item.str) };
}

function tokensUnder(words, rects, pageH) {
  return words.filter((word) => {
    const cx = word.x + word.w / 2;
    const cy = pageH - word.baseline - word.size * 0.35;
    return rects.some((rect) => cx >= rect[0] && cx <= rect[2] && cy >= rect[1] && cy <= rect[3]);
  }).map((word) => token(word.str));
}

test('marked rects cover each cited passage line by line', async () => {
  const cache = new Map();
  const load = async (file, pageNo) => {
    const key = `${file}:${pageNo}`;
    if (!cache.has(key)) cache.set(key, await pageWords(file, pageNo));
    return cache.get(key);
  };

  for (const scenario of DEMO_SCENARIOS) {
    for (const citation of scenario.citations) {
      const file = pdfPath(scenario.pdfUrl);
      const { pageH, words, overflow } = await load(file, citation.page);
      expect(overflow, `${scenario.id} page ${citation.page} runs off the page`).toEqual([]);
      const quoteTokens = citation.quote.split(/\s+/).map(token).filter(Boolean);
      const present = words.map((word) => token(word.str));
      let found = false;
      for (let start = 0; start <= present.length - quoteTokens.length; start += 1) {
        if (quoteTokens.every((part, index) => present[start + index] === part)) {
          found = true;
          break;
        }
      }
      expect(found, `${scenario.id} ${citation.label} is not in the PDF`).toBe(true);

      if (scenario.state === 'ejbelagt') {
        expect(citation.rects, `${scenario.id} draws no pen`).toEqual([]);
        expect(scenario.pagesWithHits, `${scenario.id} claims no hit pages`).toEqual([]);
        continue;
      }

      const covered = tokensUnder(words, citation.rects, pageH);
      expect(covered, `${scenario.id} ${citation.label}`).toEqual(quoteTokens);
    }
  }
});

test('narrow headers, the fitted page, and a refusal claim no false hit', async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const frame = await page.evaluate(() => {
      const italic = document.querySelector('.hero-title-italic').getBoundingClientRect();
      const label = document.querySelector('.navbar-mono-label');
      const labelBox = label.getBoundingClientRect();
      return {
        scroll: document.documentElement.scrollWidth,
        view: document.documentElement.clientWidth,
        italicRight: italic.right,
        italicLeft: italic.left,
        labelDisplay: getComputedStyle(label).display,
        labelHeight: labelBox.height,
        labelWrap: label.scrollWidth > label.clientWidth + 1,
      };
    });
    expect(frame.scroll, `${width} page scrolls sideways`).toBeLessThanOrEqual(frame.view + 1);
    expect(frame.italicRight, `${width} headline overflows`).toBeLessThanOrEqual(width - 8);
    expect(frame.italicLeft).toBeGreaterThanOrEqual(8);
    expect(frame.labelDisplay, `${width} label should be hidden`).toBe('none');
  }

  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    document.documentElement.setAttribute('data-demo-hold', 'vila');
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-demo-hold', 'result');
  });
  await page.locator('#demo-section').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.getByRole('tab', { name: /^Vägran:/ }).click();
  await expect(page.locator('.state-name-mono')).toHaveText('EJ BELAGT', { timeout: 20000 });
  await page.getByRole('button', { name: /Källdokument/ }).click();
  await expect.poll(async () => page.locator('.demo-white-sheet canvas').evaluate((canvas) => canvas.width), { timeout: 15000 }).toBeGreaterThan(50);
  await expect(page.locator('.mini-hit-highlight')).toHaveCount(0);
  await expect(page.locator('[data-testid="citation-highlight"]')).toHaveCount(0);
  const sources = await page.locator('.citation-index-row').count();
  await expect(page.locator('.inquiry-model-tag')).toContainText(`${sources} KÄLLOR`);
  const fitted = await page.locator('.demo-white-sheet canvas').evaluate((canvas) => {
    const box = canvas.getBoundingClientRect();
    return { right: box.right, width: box.width, view: window.innerWidth };
  });
  expect(fitted.width).toBeGreaterThan(40);
  expect(fitted.right).toBeLessThanOrEqual(fitted.view + 1);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  const heroMotion = await page.locator('.pen-stroke-hero').evaluate((el) => getComputedStyle(el).animationName);
  expect(heroMotion).toBe('none');
});
