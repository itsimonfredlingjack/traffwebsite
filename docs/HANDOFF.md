# Överlämning – Grok Build → Grok i Cursor (2026-09-27)

Grok Build tog slut på kvot mitt i uppdraget. Detta är läget. Läs också
docs/brand/BRAND.md (varumärkeslag) och .cursor/rules/traff.mdc.

## Git-läge
- Branch `brand-pen`, HEAD `60f3d9c` ("brand: the pen wordmark replaces the ring as the
  logo"). main = `43b15ad` (live på GitHub Pages). Inget pushat från brand-pen.
- OKOMMITTERAT arbete i working tree (Geminis pennpass + Groks pågående fixar):
  - Nya: src/components/PenStroke.jsx/.css, tests/citation-coverage.spec.js
  - Ändrade: HeroHeader.jsx/.css, Navbar.jsx/.css, PdfPane.jsx, InteractiveDemo.jsx/.css,
    ThumbnailStrip.css, LandingPage.css, data/demoScenarios.js (nya rects rad för rad,
    scenario 4 utan rects/pagesWithHits), scripts/generate-demo-pdfs.js + de tre
    regenererade PDF:erna i public/demo-pdf/, tests/seo-regression.spec.js
- Senaste ändring innan stopp: HeroHeader.css mobil `.hero-title-serif` font-size
  `clamp(2.5rem, 13vw, 3.4rem)` (från 2.6rem/13.6vw/3.5rem) så att rubriken ryms på 320 px.
- Ett kommando kördes fortfarande (troligen testsviten / en preview-server på :4175).

## Uppdraget (samma som gavs till Grok Build)
1. PenStroke: delad penna. Hero behåller loggans path (godkänd visuellt). Textrader:
   fasta snedskurna ändar, sträckt mitt, visuell lutning ca −1°–−1,5° oberoende av
   radlängd, täcker x-höjd/versalhöjd, en stroke per rad, liten fördröjning per rad.
   → Implementerat i PenStroke.jsx, ej slutverifierat.
2. Citatets täckning: rects verifierade mot PDF-textlagret. → tests/citation-coverage
   finns; rects uppdaterade.
3. Rörelse: navbarens ordmärke statiskt; heron är enda penngesten vid laddning;
   dokumentpennan spelas när sidan är renderad OCH synlig (mobil: när fliken
   "Källdokument" öppnas), en gång per BELAGT; reduced motion = slutläge.
4. Mobil 320/375/390: "DOKUMENT-AI" bryts inte (döljs), PDF-sidan anpassas till bredden,
   H1 flödar inte över, CLS ökar inte.
5. Ej belagt (scenario 4): inga rects, inga träffsidor, källraden påstår inga källor
   som inte finns.

## Klart-krav (oförändrade)
- npm run build + npm run test:seo + citation-coverage gröna; axe 0 fel i alla demolägen
  1280/375; konsol tyst i hydrering.
- Lighthouse mobil median av 3 (vite preview): Perf ≥ 95, LCP ≤ 2,4 s, LCP-element = H1.
- Skärmdumpar i screenshots/brand-pen/: hero 1280/375/320, dokumentmarkering per
  BELAGT-scenario 1280/375, ej belagt, reduced motion.
- Sedan: merga brand-pen → main, pusha, vänta in Pages-deploy, verifiera live
  (https://xn--trff-moa.app/, träff.app: curl utan JS, Playwright,
  Lighthouse). Rapportera kort.
