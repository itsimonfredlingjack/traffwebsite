# Träff – varumärke (gäller från 2026-09-27)

Källa: varumärkesutkastet "Träff varumärke" (claude.ai-artifact e16ded11…).
Detta dokument ERSÄTTER logotypdelen i den gamla identiteten. `docs/archive/Träff Visual Identity System (2)/` och `docs/archive/random-old-components/` är historik – ringen med kärna är inte längre logotyp.

## Grundidé
- **Loggan = överstrykningspennan.** Ordet "Träff" i Young Serif, helt svart (#111111),
  med en gul överstrykning (#FFD84A, opacitet 0.92, mix-blend-mode: multiply) som lutar
  uppåt (rotate −6°), snedskurna ändar, centrerad på ordet. Loggan ser ut som när någon
  strukit under rätt mening i stadgarna – det är produktens löfte.
- **Ringen med kärna = sökstatus, bara i produkten/demon.** Vila, söker, belagt,
  ej belagt. Den är INTE logotyp och används inte som varumärkesmärke i sidhuvud, footer,
  favicon eller appikon.
- Grönt betyder alltid belagt och förekommer aldrig i loggan.

## Filer
- `traff-wordmark.svg` – loggan med penna (primär). Ordet är konturer (paths), så ingen
  font behöver laddas för loggan.
- Enfärgad version (stämplar, svartvitt, gravyr): samma fil utan den första `<path>`
  (pennan).
- Rörelse: pennan dras över ordet vänster→höger (clipPath/scaleX från 0 till 1,
  cubic-bezier(.6,0,.3,1), transform-origin vänster). Används på startskärm/hemsida,
  spelas en gång, statisk vid prefers-reduced-motion.
- `traff-appicon-T.svg` – appikon/favicon: T i Young Serif med penna på papper (#E8E5DE).
  Webbens val för små storlekar (favicon, apple-touch-icon), eftersom T läses bättre än
  hela namnet under 64 px.
- `status-*.svg` – statusmärkena på ljus botten.

## Palett
| Namn | Hex | Användning |
|---|---|---|
| Bläck | #111111 | Loggans text |
| Strykgul | #FFD84A | Pennan (logga + markering av citerad mening i demon) |
| Papper | #E8E5DE | Appikonens botten, dokumentytor |
| Söker | #2563EB | Sökljuset i statusmärket |
| Belagt (grafik, ljus botten) | #16A06A | Ring/kärna/eko i statusmärket |
| Ej belagt (grafik, ljus botten) | #C98A12 | Ring + stämplat streck |
| Belagt text (ljus botten) | #137855 (--belagt) | Mono-etiketter, WCAG 4.5:1 |
| Ej belagt text (ljus botten) | #8A5D06 (--ej-belagt) | Mono-etiketter, WCAG 4.5:1 |
| Belagt / Ej belagt (mörk botten) | #4FC79C / #E5B45C | Endast på mörka ytor |

## Statusmärket (produkt/demo)
- Vila: tom ring, bläck 25 % opacitet.
- Söker: blå båge (#2563EB) som roterar på vilaringen.
- Belagt: grön ring + kärna som slår in (skala .55 → 1.14 → 1), plus ett grönt eko som
  ringlar ut EN gång. Samtidigt drar strykpennan över exakt den mening svaret bygger på.
- Ej belagt: bärnstensring (tjockare, 11 i 120-viewBox) + ett streck som stämplas ner
  (skala 1.5 → .92 → 1) och en kort skakning. Ett nej får samma tyngd som ett ja.
- Kärna ritas ENDAST i belagt. Varje tillstånd har också textetikett i mono.

## Webbregler
- Sidhuvud/footer/modal: ordmärket med penna. Aldrig ringen som logga.
- Rubriker på sajten förblir Instrument Serif; Young Serif används bara i loggan
  (paths) tills annat beslutas.
- Mörk bakgrund: loggan står på en ljus pappersplatta (#E8E5DE), aldrig svart text på
  mörkt och aldrig inverterad.
- Produktfamilj (BrfTräff, StyrelseTräff): prefix i JetBrains Mono med tunn linje
  ovanför eller under Träff; pennan ligger bara på Träff.
