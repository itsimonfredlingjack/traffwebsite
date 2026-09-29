/**
 * Run Lighthouse against the built site (dist/) and fail if a category score
 * drops below its minimum. Chrome is found by chrome-launcher; set CHROME_PATH
 * to use a specific binary.
 *
 *   npm run build && node scripts/lighthouse-check.mjs
 */
import { spawn } from 'node:child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const PORT = 4176;
const URL = `http://127.0.0.1:${PORT}/`;

// Minimum scores, 0-1. Measured on the built site (3 runs, identical):
// performance 96, accessibility 100, best-practices 100, seo 100.
// Set a little below that so runner noise does not make it flaky.
// Raise them as the site improves; never lower them to get green.
const MINIMUMS = {
  performance: 0.9,
  accessibility: 0.97,
  'best-practices': 0.95,
  seo: 0.97,
};

const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
});

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Preview server did not start on ${URL}`);
}

let chrome;
let failed = false;
try {
  await waitForServer();
  chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
  const result = await lighthouse(URL, {
    port: chrome.port,
    output: 'json',
    onlyCategories: Object.keys(MINIMUMS),
  });
  for (const [id, minimum] of Object.entries(MINIMUMS)) {
    const score = result.lhr.categories[id].score;
    const ok = score >= minimum;
    if (!ok) failed = true;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${id}: ${Math.round(score * 100)} (minimum ${Math.round(minimum * 100)})`);
  }
} finally {
  if (chrome) await chrome.kill();
  server.kill();
}
process.exit(failed ? 1 : 0);
