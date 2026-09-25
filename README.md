# brfv2-lovable-dokument — bara Dokument, fristående

Ett litet Vite/React-projekt med Dokument-skärmen ur Träff, för att kunna
laddas upp i Lovable (eller öppnas var som helst) utan Python-backend, Tauri
eller resten av appen. Listan och PDF:erna är riktiga: samma fixtures som
`brfv2-lovable`, sparade i `src/fixtures/` och `public/pdf/`.

```bash
cd brfv2-lovable-dokument
npm install
npm run dev        # http://localhost:5173
```

Chatten (Fråga dokumenten) ligger i syskonfoldern `brfv2-lovable/`.

## Vad som är delat med riktiga kodbasen, och vad som är paketets eget

Samma sökvägar som `brfv2-mockup/src/`, så en ändring här kopieras tillbaka rakt av:

```bash
npm run sync-back            # kopierar de delade filerna till ../brfv2-mockup/src
npm run sync-back -- --diff  # visar bara skillnaden först
```

| Delat (verbatim, synkas) | Paketets eget (synkas inte) |
|---|---|
| `src/theme.css`, `src/App.css` — alla tokens och all styling | `src/App.jsx` — skalet med registret och läsvyn |
| `src/components/PdfPane.jsx`, `src/pdfCache.js` — sidan ritad med pdf.js | `src/api.js` — mockad backend ur fixtures |
| `src/components/TraffMark.jsx`, `Instrument.jsx` + `.css`, `EmptyState.jsx`, `datum.js` | `src/fixtures/`, `public/pdf/` — sparade dokument |
| `src/useSlashFocus.js`, `src/assets/` (typsnitten) | `index.html`, `src/main.jsx`, `vite.config.js` |

Ändrar du något i `App.jsx` som ska tillbaka: motsvarande kod ligger i
`brfv2-mockup/src/App.jsx` under `currentTab === 'docs'` och i läsvyn
(`selectedDocument`), med samma klassnamn — flytta för hand.

## Vad mocken gör

- Listan kommer ur `src/fixtures/documents.json`.
- Ett klick öppnar PDF:en i läsvyn (samma PdfPane som i appen).
- Uppladdning lägger filen i listan på den här datorn, med märket Ny. Den
  sparas inte; omladdning återställer fixtures.
- Borttagning tar bara bort raden ur den här sessionen.
