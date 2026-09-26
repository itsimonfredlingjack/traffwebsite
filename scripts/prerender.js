import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { absoluteUrl, siteUrl } from './site-url.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');
const serverEntryPath = path.resolve(distDir, 'server', 'entry-server.js');

async function prerender() {
  console.log('⚡ Starting static HTML prerendering...');

  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`dist/index.html not found at ${indexHtmlPath}. Please run vite build first.`);
  }
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`SSR bundle not found at ${serverEntryPath}. Run vite build --ssr src/entry-server.jsx first.`);
  }

  const template = fs.readFileSync(indexHtmlPath, 'utf-8');
  const { render, FAQS } = await import(pathToFileURL(serverEntryPath).href);
  const faqs = FAQS || [];
  const appHtml = render();
  console.log(`✓ Rendered production bundle to string (${appHtml.length} characters)`);

  // Find font files in dist/assets for preload
  let fontPreloadTags = '';
  const assetsDir = path.resolve(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    const primaryFonts = assetFiles.filter((f) =>
      (f.startsWith('instrument-sans-latin-wght-normal') || f.startsWith('instrument-serif-latin-400-normal')) &&
      f.endsWith('.woff2')
    );
    const base = process.env.VITE_BASE || '/';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    fontPreloadTags = primaryFonts
      .map((fontFile) => `    <link rel="preload" href="${cleanBase}assets/${fontFile}" as="font" type="font/woff2" crossorigin />`)
      .join('\n');
  }

  const origin = siteUrl();
  const organizationId = `${origin}#organization`;

  // Generate JSON-LD with Organization, SoftwareApplication, and FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'Träff',
        alternateName: 'Traff',
        url: origin,
        email: 'kontakt@traff.se',
        logo: absoluteUrl('apple-touch-icon.png'),
        description: 'Svensk AI för dokument och information.',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}#software`,
        name: 'Träff',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'sv',
        url: origin,
        description:
          'Svensk AI för dokument och information. Fråga dina avtal, protokoll och rapporter och se svaren med verifierad källhänvisning direkt på sidan.',
        publisher: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${origin}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  const jsonLdTag = `    <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`;

  // Inject into template:
  // 1. Preload fonts & JSON-LD into </head>
  const headInjections = [fontPreloadTags, jsonLdTag].filter(Boolean).join('\n');
  let finalHtml = template.replace('</head>', `${headInjections}\n  </head>`);

  // 2. Inject app HTML into <div id="root"></div>
  finalHtml = finalHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  fs.writeFileSync(indexHtmlPath, finalHtml, 'utf-8');

  const lastmod = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(
    path.join(distDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('sitemap.xml')}\n`,
  );
  fs.writeFileSync(
    path.join(distDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
  );

  console.log(`✅ Static HTML successfully prerendered into ${indexHtmlPath}`);
  console.log(`   Site URL: ${origin}`);
  console.log(`   Final HTML size: ${Buffer.byteLength(finalHtml, 'utf-8')} bytes`);
}

prerender().catch((err) => {
  console.error('❌ Prerendering failed:', err);
  process.exit(1);
});
