# Träff — webbplats

Landningssida för Träff (träff.app): en Vite/React-sida som prerendras till
statisk HTML, med SEO-tester, Lighthouse-gränser och deploy till GitHub Pages.
Den interaktiva demon använder PDF:er i `public/demo-pdf/`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # produktionsbygge med prerender till dist/
```

## Struktur

| Sökväg | Innehåll |
|---|---|
| `src/` | Sidan: `App.jsx`, komponenter, `theme.css`, `LandingPage.css`, `data/` |
| `public/` | Ikoner, OG-bild och demo-PDF:er |
| `scripts/` | Prerender, JSON-LD-validering, Lighthouse, OG-bild och demo-PDF-generering |
| `tests/` | Playwright: SEO-regression och citattäckning |
| `docs/brand/` | Varumärkesregler och logotyper (`render-og.mjs` läser ordmärket) |
| `.github/workflows/` | CI och deploy |

## Sajtadress

Canonical, Open Graph, Twitter-bild, JSON-LD, `sitemap.xml` och `robots.txt`
byggs från miljövariabeln `SITE_URL`. Utan variabeln är adressen den som är
publicerad i dag:

`https://xn--trff-moa.app/` (träff.app, punycode i metadata)

GitHub Pages-workflowen sätter `SITE_URL` och `VITE_BASE=/` tillsammans. `sitemap.xml` och `robots.txt` skrivs till `dist/` vid `npm run build`
och ligger inte som statiska filer i `public/`.

Search Console verifieras med repository-variabeln `GOOGLE_SITE_VERIFICATION`
(Actions → Variables, inte en incheckad kod). Om den är satt skriver bygget
`<meta name="google-site-verification">` i sidhuvudet. Utan variabeln blir
taggen inte med.

Domänen träff.app (registrerad hos STRATO) pekar på GitHub Pages: A- och AAAA-poster
på apex och `www` som CNAME. Custom domain är satt under repots Settings → Pages;
eftersom sajten deployas med Actions behövs ingen `CNAME`-fil. För att bygga
lokalt mot den gamla projektadressen:

```bash
SITE_URL=https://itsimonfredlingjack.github.io/traffwebsite/ VITE_BASE=/traffwebsite/ npm run build
```

## Pipeline

```mermaid
flowchart TD
    trigger("Push / PR") --> npm_ci

    subgraph verify ["Jobb: verify"]
        direction TD
        npm_ci["npm ci"] --> build["Bygg (prerender)"]
        build --> jsonld["Validera JSON-LD"]
        jsonld --> deps["Installera Playwright & typsnitt"]
        deps --> pw["Tester (Playwright)"]
        pw --> lh["Lighthouse"]

        fail("Stopp")

        npm_ci -.-> fail
        build -.-> fail
        jsonld -.-> fail
        deps -.-> fail
        pw -.-> fail
        lh -.-> fail
    end

    lh --> is_main{"Bara på main?"}

    subgraph deploy ["Jobb: deploy"]
        direction TD
        rebuild["Bygg om med GOOGLE_SITE_VERIFICATION"] --> config["configure-pages"]
        config --> upload["upload-pages-artifact (dist)"]
        upload --> deploy_pages["deploy-pages"]
    end

    is_main -- "Ja" --> rebuild
    is_main -- "Nej" --> pr_done("Färdig (PR)")
    deploy_pages --> pub("Publicerad på träff.app")
```

**verify**
- **npm ci**: Installerar beroenden för Node 22.
- **Bygg (prerender)**: Kör `npm run build` med `VITE_BASE=/` och `SITE_URL=https://xn--trff-moa.app/`. Vites bygge (`vite build` och `vite build --ssr`) följs av `node scripts/prerender.js`, som skriver HTML, `robots.txt` och `sitemap.xml` till `dist/`. Fallerar om bygget kraschar.
- **Validera JSON-LD**: Kör `node scripts/validate-jsonld.mjs`. Validerar sidans JSON-LD mot schema-dts och kontrollerar att FAQPage-texten stämmer överens med det som renderas. Fallerar om datan är ogiltig eller texterna skiljer sig.
- **Installera Playwright & typsnitt**: Laddar ner Chromium och installerar `fonts-urw-base35` via apt, så att `citation-coverage` har tillgång till NimbusSans-Regular.afm för att mäta textbredder. Fallerar vid nätverksproblem.
- **Tester (Playwright)**: Kör `npx playwright test tests/seo-regression.spec.js tests/citation-coverage.spec.js` med `CI=true`. Det gör att testerna körs med Playwrights egna Chromium-version (channel 'chromium'). Testar bland annat "axe finds no contrast or target-size violations in any demo state", "pdf.js stays unloaded until the demo is on screen, then the story runs", "status mark draws a core only when a passage is verified", "marked rects cover each cited passage line by line" och "narrow headers, the fitted page, and a refusal claim no false hit". Fallerar om något test misslyckas (vid fel sparas artefakten `playwright-results`).
- **Lighthouse**: Kör `npm run lighthouse` (`scripts/lighthouse-check.mjs`) mot `vite preview`, med `CHROME_PATH` satt till Playwrights Chromium. Fallerar om resultatet understiger gränserna: performance 0.90, accessibility 0.97, best-practices 0.95, seo 0.97.

**deploy**
Körs inte på `pull_request`, utan bara på `main` (förutsatt att `verify` gick grönt). Installerar Node 22, kör `npm ci` och bygger sedan om sajten med repots hemlighet `GOOGLE_SITE_VERIFICATION`. Därefter konfigureras GitHub Pages via `configure-pages`, mappen `dist` laddas upp som en artefakt via `upload-pages-artifact` och slutligen publiceras sajten med `deploy-pages`.

### Köra lokalt

```bash
npm run build
node scripts/validate-jsonld.mjs
npm run test:seo   # kräver installerad Chrome; typsnittet via fonts-urw-base35 eller AFM_PATH=/sökväg/NimbusSans-Regular.afm
npm run lighthouse # CHROME_PATH=/sökväg/till/chrome om chrome-launcher inte hittar någon
```

Utanför CI körs skripten `scripts/render-og.mjs` och `scripts/generate-demo-pdfs.js` manuellt.

Sedan pipelinen sattes upp har även två nya saker tillkommit: `seo-regression` testar nu även datormenyns länkar, och `src/utils/scrollToSection.js` rättar scrollpositionen efter mjuk scroll.
