**Språk:** all UI-copy på svenska. Räkna med ~15 % längre strängar än engelska.

**Röst:** appen uttalar fakta och egen säkerhet — aldrig säkerhet den inte har. Ingen marknadsföringston, inga utropstecken, ingen emoji.

**Siffror:** svensk formatering — mellanslag som tusentalsavgränsare, komma som decimal (`104 320,50 kr`). Tabular figures i register så beloppskolumner linjerar.

## Visuell identitet (kort)

### Ytor

- **Vit canvas** (`--skal`): nästan allt UI. Ingen ytalternering — kort markeras med hårlinje + luft, inte egen fyllning.
- **Dokument** (`--dokument`): det enda som ska läsa som rent papper.
- **Matta** (`--matta`): läsurra runt PDF — mörkare än canvas, ljusare än skal. Inte en ram.


### Färg = mening

| Token | Betydelse | Inte |
|-------|-----------|------|
| `--belagt` (#137855) | Verifierat ordagrant mot källa | Generell “success” |
| `--vagran` (#8A5D06) | Inget bevis finns | Varning |
| `--sokljus` (#2C5CA8) | Pågående arbete (söker, indexerar) | Dekoration |
| `--handling` (#1A4FD0) | Länkar och textåtgärder | Knappfyllnad eller tillstånd |
| `--remsgul` (#FFD600) | Markerad passage *inuti dokument* | Chrome-tagg |
| `--primary` (bläck) | Primär knapp | Blå accent |

### Tre typsnitt, tre jobb (§07)

| Roll | Font | Användning |
|------|------|------------|
| **Påstår** | Nunito (`--font-display`) | Rubriker, etiketter, appens egna påståenden |
| **Förklarar** | Source Sans 3 (`--font-sans`) | Brödtext, UI-copy, instruktioner |
| **Mäter** | JetBrains Mono (`--font-mono`) | Siffror, sidnummer, tillstånd, poäng |
| **Dokumentets röst** | Instrument Serif (`--font-serif`) | Ordagrant citat ur avtal/protokoll |

**Etiketter** (sektioner, tabellhuvuden som *förklarar*): `--etikett-*` (sans, inte uppercase mono).

**Uppercase mono** är stängd lista: sidnummer, paragrafer, poäng, tillstånd — inte vanliga captions.

### Form

- **Pill** (`--radius-pill`): tillstånd (taggar, filter, nav aktiv)
- **Avrundad rektangel** (`--r-sm` 10px, `--r-md` 12px): struktur (knappar, fält, kort)

### Rörelse

Nästan tyst. Enda godkända animation: pulserande prick för pågående arbete. Hover = matt toning; inga hover-lyft.

---

## Tokenreferens (de vanligaste)

### Spacing (`--space-unit: 0.25rem`)

`--s1` 4px · `--s2` 8px · `--s3` 12px · `--s4` 16px · `--s5` 20px · `--s6` 24px · `--s8` 32px · `--s10` 40px · `--s14` 56px  
(halvsteg: `--s0h`, `--s1h`, `--s2h`, `--s3h`)

### Typstorlek

`--text-2xs` 11px · `--text-xs` 12px · `--text-dense` 13px · `--text-sm` 14px · `--text-base` 15px · `--text-lg` 17px · `--text-xl` 24px · `--text-2xl` 30px · `--text-title` 34px

### Textfärger

`--ink` / `--black-900` · `--ink-muted` / `--black-700` · `--ink-subtle` / `--black-500`

### Kontrollhöjder

`--h-sm` 28px (inline) · `--h-md` 36px (standard) · `--h-lg` 44px (ensam CTA)

### Breakpoints (enda tillåtna)

`1200px` · `1024px` · `768px` · `560px`

### Fokus

`outline: 2px solid var(--ring); outline-offset: 2px` — ingen 3px glow.

---

## Nyckelkomponenter

### Instrument (`src/components/Instrument.jsx`)

Bandet under sidhuvudet: **en siffra skärmen mäter** + kvalificerande avläsningar.

- Noll är inte en mätning → visa förklarande text i sans, inte mono-belopp i displaystorlek
- “Inte mätt än” ≠ noll
- Om inget mäts: instrumentet ritas inte (bandet finns kvar)
- All CSS för `.instrument` bor i `Instrument.css` — ingen annan fil

### Knappar

Enda primitiven: `.ui-btn` (+ varianter). Primär = bläckfyllnad. Inga legacy-klasser (`primary-action-btn`, …).

**Källkod att bifoga för djupare arbete:**

| PDF/dokument | `PdfPane.jsx` |
