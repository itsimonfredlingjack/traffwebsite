import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { absoluteUrl, siteUrl } from './scripts/site-url.js';

function injectSiteUrl() {
  return {
    name: 'inject-site-url',
    transformIndexHtml(html) {
      return html
        .replaceAll('__SITE_URL__', siteUrl())
        .replaceAll('__SITE_OG_IMAGE__', absoluteUrl('og-image.png'));
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), injectSiteUrl()],
});
