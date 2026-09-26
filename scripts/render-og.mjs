/**
 * Render the Open Graph image from HTML so it uses the site's own fonts.
 * Writes public/og-image.png at 1200×630.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('src/assets/fonts');
const face = (file) => fs.readFileSync(path.join(root, file)).toString('base64');

const html = `<!doctype html>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'Instrument Sans';
    src: url(data:font/woff2;base64,${face('instrument-sans-latin-wght-normal.woff2')}) format('woff2');
    font-weight: 400 700; font-style: normal; font-display: block;
  }
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
  @font-face {
    font-family: 'JetBrains Mono';
    src: url(data:font/woff2;base64,${face('jetbrains-mono-latin-wght-normal.woff2')}) format('woff2');
    font-weight: 400 700; font-style: normal; font-display: block;
  }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #EFEFEB; }
  body {
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Sans', sans-serif; color: #0F1115;
  }
  .card {
    width: 1080px; height: 520px; background: #fff; border-radius: 28px;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 18px 40px rgba(15,17,21,0.08);
    padding: 48px 56px 40px;
    display: flex; flex-direction: column;
  }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 14px; }
  .mark {
    width: 42px; height: 42px; border-radius: 50%;
    border: 3.4px solid #0F1115; display: grid; place-items: center;
  }
  .mark i { width: 16px; height: 16px; border-radius: 50%; background: #0F1115; display: block; }
  .name { font-family: 'Instrument Serif', serif; font-size: 40px; letter-spacing: -0.03em; line-height: 1; }
  .tag {
    font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700;
    letter-spacing: 0.16em; color: rgba(15,17,21,0.48); margin-left: 4px;
  }
  .kicker {
    font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700;
    letter-spacing: 0.16em; color: rgba(15,17,21,0.55);
    background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08);
    border-radius: 999px; padding: 8px 16px;
  }
  h1 {
    margin-top: 36px; font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 76px; line-height: 0.95; letter-spacing: -0.04em;
  }
  h1 em { font-style: italic; color: rgba(15,17,21,0.75); font-weight: 400; }
  .lead { margin-top: 28px; font-size: 24px; line-height: 1.45; color: rgba(15,17,21,0.72); max-width: 860px; }
  .row { margin-top: auto; display: flex; align-items: center; gap: 12px; }
  .pill {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700;
    letter-spacing: 0.12em; border-radius: 999px; padding: 10px 16px;
  }
  .ok { color: #065F46; background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.35); }
  .ok .dot { width: 8px; height: 8px; border-radius: 50%; background: #059669; }
  .meta { color: rgba(15,17,21,0.55); background: #F7F7F5; border: 1px solid rgba(0,0,0,0.08); }
  .domain {
    margin-left: auto; background: #111317; color: #fff; border-radius: 999px;
    font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 600;
    letter-spacing: 0.04em; padding: 12px 22px;
  }
</style>
<div class="card">
  <div class="top">
    <div class="brand">
      <span class="mark"><i></i></span>
      <span class="name">Träff</span>
      <span class="tag">DOKUMENT-AI</span>
    </div>
    <span class="kicker">SVENSK AI FÖR DOKUMENT OCH BELÄGG</span>
  </div>
  <h1>Fråga dina dokument.<br><em>Se svaren på sidan.</em></h1>
  <p class="lead">När svaret finns i dokumenten visar Träff exakt var. Finns det inte där säger Träff det.</p>
  <div class="row">
    <span class="pill ok"><span class="dot"></span>BELAGT I KÄLLAN</span>
    <span class="pill meta">EU-DATALAGRING · GDPR</span>
    <span class="domain">traff.app</span>
  </div>
</div>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const out = path.resolve('public/og-image.png');
await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
const size = fs.statSync(out).size;
console.log(`wrote ${out} (${size} bytes)`);
