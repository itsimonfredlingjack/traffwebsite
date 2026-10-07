/**
 * Rasterise the brand images with the site's own fonts.
 *   public/og-image.png        1200×630  wordmark + the hero line, on --papper
 *   public/apple-touch-icon.png 180×180  the rounded T icon
 *   public/logo.png            ≥512 wide  the wordmark, for Organization.logo
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('src/assets/fonts');
const face = (file) => fs.readFileSync(path.join(root, file)).toString('base64');
const wordmark = fs.readFileSync(path.resolve('docs/brand/traff-wordmark.svg'), 'utf8')
  .replace(/\swidth="[^"]*"/, '')
  .replace('<svg ', '<svg class="wordmark" ');
const icon = fs.readFileSync(path.resolve('public/favicon.svg'), 'utf8')
  .replace('<svg ', '<svg class="icon" ');

const fonts = `
  @font-face {
    font-family: 'Instrument Serif';
    src: url(data:font/woff2;base64,${face('instrument-serif-latin-400-normal.woff2')}) format('woff2');
    font-weight: 400; font-style: normal; font-display: block;
  }
  @font-face {
    font-family: 'Instrument Serif';
    src: url(data:font/woff2;base64,${face('instrument-serif-latin-400-italic.woff2')}) format('woff2');
    font-weight: 400; font-style: italic; font-display: block;
  }
`;

const ogHtml = `<!doctype html>
<meta charset="utf-8" />
<style>
  ${fonts}
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #E8E5DE; }
  body {
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif; color: #111111;
  }
  .stage { display: flex; flex-direction: column; align-items: center; gap: 36px; }
  .wordmark { width: 820px; height: auto; display: block; }
  p {
    font-weight: 400; font-size: 52px; line-height: 1.05;
    letter-spacing: -0.03em; text-align: center;
  }
  em { font-style: italic; font-weight: 400; }
</style>
<div class="stage">
  ${wordmark}
  <p>Fråga Träff.<br><em>Se svaren i dina dokument.</em></p>
</div>`;

const logoW = 1024;
const logoH = Math.round((logoW * 980) / 3011);
const logoHtml = `<!doctype html>
<meta charset="utf-8" />
<style>
  * { margin: 0; }
  html, body { width: ${logoW}px; height: ${logoH}px; overflow: hidden; background: #fff; }
  .wordmark { width: ${logoW}px; height: ${logoH}px; display: block; }
</style>
${wordmark}`;

const iconHtml = `<!doctype html>
<meta charset="utf-8" />
<style>
  * { margin: 0; }
  html, body { width: 180px; height: 180px; overflow: hidden; background: #E8E5DE; }
  .icon { width: 180px; height: 180px; display: block; }
</style>
${icon}`;

const browser = await chromium.launch({ channel: 'chrome' });

async function shoot(html, width, height, file) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.resolve(file);
  await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width, height }, omitBackground: false });
  await page.close();
  console.log(`wrote ${out} (${fs.statSync(out).size} bytes, ${width}×${height})`);
}

await shoot(ogHtml, 1200, 630, 'public/og-image.png');
await shoot(logoHtml, logoW, logoH, 'public/logo.png');
await shoot(iconHtml, 180, 180, 'public/apple-touch-icon.png');
await browser.close();
