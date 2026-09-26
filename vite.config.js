import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { absoluteUrl, siteUrl } from './scripts/site-url.js';

function googleSiteVerificationTag() {
  const raw = (process.env.GOOGLE_SITE_VERIFICATION || '').trim();
  if (!raw) return '';
  const content = raw
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<meta name="google-site-verification" content="${content}" />`;
}

function injectSiteUrl() {
  return {
    name: 'inject-site-url',
    transformIndexHtml(html) {
      return html
        .replaceAll('__SITE_URL__', siteUrl())
        .replaceAll('__SITE_OG_IMAGE__', absoluteUrl('og-image.png'))
        .replaceAll('__GOOGLE_SITE_VERIFICATION__', googleSiteVerificationTag());
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), injectSiteUrl()],
  build: isSsrBuild
    ? {
        rollupOptions: {
          output: {
            entryFileNames: 'entry-server.js',
          },
        },
      }
    : {},
}));
