/** Public origin used for canonical, social, JSON-LD, sitemap and robots. */
const DEFAULT_SITE_URL = 'https://itsimonfredlingjack.github.io/traffwebsite/';

export function siteUrl() {
  const raw = (process.env.SITE_URL || DEFAULT_SITE_URL).trim();
  return raw.endsWith('/') ? raw : `${raw}/`;
}

export function absoluteUrl(assetPath) {
  return new URL(String(assetPath).replace(/^\//, ''), siteUrl()).href;
}
