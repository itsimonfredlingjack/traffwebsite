import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4175',
    // CI uses Playwright's full Chromium build ('chromium' channel), not the
    // default headless shell: the shell does not retarget a smooth scroll when a
    // content-visibility section resizes mid-scroll, so the mobile menu test lands
    // 24px off there but not in Chrome. Locally we use the installed Chrome.
    channel: process.env.CI ? 'chromium' : 'chrome',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
