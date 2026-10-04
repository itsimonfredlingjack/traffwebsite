import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const OUT_DIR = path.resolve('public/demo-pdf');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper to escape PostScript strings with Latin1 octal escapes
function psEscape(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/å/g, '\\345')
    .replace(/ä/g, '\\344')
    .replace(/ö/g, '\\366')
    .replace(/Å/g, '\\305')
    .replace(/Ä/g, '\\304')
    .replace(/Ö/g, '\\326')
    .replace(/é/g, '\\351')
    .replace(/§/g, '\\247')
    .replace(/–/g, '-')
    .replace(/—/g, '--');
}

// Generate PS boilerplate with font Latin1 re-encoding
function headerPS() {
  return `%!PS-Adobe-3.0
%%BoundingBox: 0 0 595 842
%%DocumentMedia: A4 595 842 0 () ()

/reencodeISO {
  findfont dup length dict begin
    { 1 index /FID ne { def } { pop pop } ifelse } forall
    /Encoding ISOLatin1Encoding def
    currentdict
  end
  definefont pop
} def

/Helvetica-ISO /Helvetica reencodeISO
/Helvetica-Bold-ISO /Helvetica-Bold reencodeISO
/Times-Roman-ISO /Times-Roman reencodeISO
/Times-Bold-ISO /Times-Bold reencodeISO

/HeaderBar {
  gsave
  0.15 0.18 0.22 setrgbcolor
  72 790 451 2 rectfill
  grestore
} def

/FooterBar {
  gsave
  0.75 0.77 0.80 setrgbcolor
  72 60 451 1 rectfill
  /Helvetica-ISO findfont 9 scalefont setfont
  0.4 0.4 0.4 setrgbcolor
  72 45 moveto
  (Konfidentiellt - Endast f\\366r internt bruk) show
  grestore
} def
`;
}

// Build PDF 1: Nordic Tech Avtal
function buildNordicTechPS() {
  let ps = headerPS();

  // PAGE 1
  ps += `%%Page: 1 1
HeaderBar
/Helvetica-Bold-ISO findfont 18 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('TJÄNSTEAVTAL – IT-DRIFT & MOLN')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.4 0.4 0.4 setrgbcolor
72 735 moveto
(${psEscape('Avtalsreferens: NTS-2026-089A | Upprättat: 2026-01-15')}) show

gsave
0.94 0.95 0.97 setrgbcolor
72 625 451 90 rectfill
0.8 0.82 0.85 setrgbcolor
72 625 451 90 rectstroke
grestore

/Helvetica-Bold-ISO findfont 11 scalefont setfont
0.15 0.18 0.25 setrgbcolor
85 695 moveto
(${psEscape('AVTALSPARTER')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
85 675 moveto
(${psEscape('Leverantör: Nordic Tech Solutions AB, Org.nr 556987-1234')}) show
85 658 moveto
(${psEscape('Kund: Exempelbolaget Norden AB, Org.nr 556123-9876')}) show
85 641 moveto
(${psEscape('Kontaktperson: Anna Lindqvist, Head of IT & Operations')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 585 moveto
(${psEscape('§ 1. Omfattning och tjänstebeskrivning')}) show

/Helvetica-ISO findfont 10 scalefont setfont
72 565 moveto
(${psEscape('1.1 Leverantören åtar sig att tillhandahålla kontinuerlig IT-drift, serverunderhåll samt')}) show
72 550 moveto
(${psEscape('övervakning av kundens affärskritiska molnsystem dygnet runt, året om (24/7/365).')}) show
72 532 moveto
(${psEscape('1.2 I tjänsten ingår automatisk säkerhetskopiering varje dygn med georedundans inom EU.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 490 moveto
(${psEscape('§ 2. Service Level Agreement (SLA)')}) show

/Helvetica-ISO findfont 10 scalefont setfont
72 470 moveto
(${psEscape('2.1 Den garanterade tillgängligheten för infrastrukturen uppgår till minst 99,8 % per månad.')}) show
72 455 moveto
(${psEscape('2.2 Vid incidenter av prioritet 1 (kritiskt driftstopp) är inställelsetiden högst 15 minuter.')}) show
72 440 moveto
(${psEscape('2.3 Vid incidenter av prioritet 2 (begränsad funktionalitet) är inställelsetiden högst 2 timmar.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 1 av 3) show
FooterBar
showpage
`;

  // PAGE 2 (Contains termination notice and price)
  ps += `%%Page: 2 2
HeaderBar
/Helvetica-Bold-ISO findfont 14 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('TJÄNSTEAVTAL – VILLKOR & ERSÄTTNING')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 710 moveto
(${psEscape('§ 7. Avtalsperiod och uppsägningstid')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 690 moveto
(${psEscape('7.1 Detta avtal träder i kraft vid båda parters undertecknande för en initial period om 12 månader.')}) show

% TARGET SENTENCE FOR HIGHLIGHT (Page 2, Y=668, height=14, X=72 to 510)
/Helvetica-ISO findfont 10 scalefont setfont
72 670 moveto
(${psEscape('7.2 Avtalet gäller tills vidare med en ömsesidig uppsägningstid om tre (3) månader före avtalsperiodens utgång.')}) show

72 650 moveto
(${psEscape('7.3 Uppsägning ska för att vara giltig ske skriftligen via rekommenderat brev eller bekräftad e-post.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 605 moveto
(${psEscape('§ 8. Priser och betalningsvillkor')}) show

% TARGET SENTENCE FOR HIGHLIGHT 2 (Page 2, Y=583, height=14, X=72 to 430)
/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 585 moveto
(${psEscape('8.1 Månadsavgift för basdrift uppgår till 28 500 SEK exklusive mervärdesskatt.')}) show

72 565 moveto
(${psEscape('8.2 Konsulttjänster utöver basdrift debiteras med 1 350 SEK per påbörjad timme under kontorstid.')}) show
72 550 moveto
(${psEscape('8.3 Vid utryckning utanför ordinarie arbetstid tillämpas ett jouromkostnadstillägg om 100 %.')}) show
72 532 moveto
(${psEscape('8.4 Fakturering sker månadsvis i förskott med 30 dagars betalningsvillkor från fakturadatum.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 485 moveto
(${psEscape('§ 9. Ansvarsbegränsning')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 465 moveto
(${psEscape('9.1 Leverantörens sammanlagda skadeståndsansvar under detta avtal är begränsat till ett belopp')}) show
72 450 moveto
(${psEscape('motsvarande sex (6) månadsavgifter för den aktuella tjänsten.')}) show
72 435 moveto
(${psEscape('9.2 Part ansvarar inte i något fall för indirekta skador, utebliven vinst eller dataförlust.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 2 av 3) show
FooterBar
showpage
`;

  // PAGE 3
  ps += `%%Page: 3 3
HeaderBar
/Helvetica-Bold-ISO findfont 14 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('TJÄNSTEAVTAL – DATASKYDD & SIGNATURER')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 710 moveto
(${psEscape('§ 10. GDPR och dataskydd')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 690 moveto
(${psEscape('10.1 Leverantören behandlar personuppgifter i enlighet med gällande dataskyddslagstiftning.')}) show
72 675 moveto
(${psEscape('10.2 Samtliga data lagras uteslutande i datacenter belägna inom Europeiska Unionen (Sverige).')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 625 moveto
(${psEscape('BEKRÄFTELSE & SIGNATURER')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.3 0.3 0.3 setrgbcolor
72 600 moveto
(${psEscape('Detta avtal har upprättats i två likalydande exemplar varav parterna tagit varsitt.')}) show

gsave
0.75 0.77 0.8 setrgbcolor
72 525 180 1 rectstroke
280 525 180 1 rectstroke
grestore

/Helvetica-Bold-ISO findfont 10 scalefont setfont
72 510 moveto
(${psEscape('Nordic Tech Solutions AB')}) show
280 510 moveto
(${psEscape('Exempelbolaget Norden AB')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.4 0.4 0.4 setrgbcolor
72 495 moveto
(${psEscape('Marcus Eklund, Verkställande Direktör')}) show
280 495 moveto
(${psEscape('Anna Lindqvist, Head of IT')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 3 av 3) show
FooterBar
showpage
`;

  return ps;
}

// Build PDF 2: Vinter & Co Protokoll
function buildVinterProtokollPS() {
  let ps = headerPS();

  // PAGE 1
  ps += `%%Page: 1 1
HeaderBar
/Helvetica-Bold-ISO findfont 18 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('STYRELSEPROTOKOLL')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.4 0.4 0.4 setrgbcolor
72 735 moveto
(${psEscape('Vinter & Co Group AB | Org.nr 556443-8821 | Protokoll nr 02/2026')}) show

gsave
0.94 0.95 0.97 setrgbcolor
72 625 451 90 rectfill
0.8 0.82 0.85 setrgbcolor
72 625 451 90 rectstroke
grestore

/Helvetica-Bold-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
85 695 moveto
(${psEscape('Tid och plats:')}) show
/Helvetica-ISO findfont 10 scalefont setfont
170 695 moveto
(${psEscape('Onsdagen den 18 februari 2026, kl. 13:00-15:30. Huvudkontoret, Stockholm.')}) show

/Helvetica-Bold-ISO findfont 10 scalefont setfont
85 675 moveto
(${psEscape('Närvarande styrelse:')}) show
/Helvetica-ISO findfont 10 scalefont setfont
170 675 moveto
(${psEscape('Helena Vinter (ordf.), Carl Bergström, Johan Sand, Sofia Ek')}) show

/Helvetica-Bold-ISO findfont 10 scalefont setfont
85 655 moveto
(${psEscape('Övriga närvarande:')}) show
/Helvetica-ISO findfont 10 scalefont setfont
170 655 moveto
(${psEscape('Fredrik Alm (VD), Beatrice Lund (protokollförare)')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 585 moveto
(${psEscape('§ 1. Sammanträdets öppnande och val av justeringsperson')}) show
/Helvetica-ISO findfont 10 scalefont setfont
72 565 moveto
(${psEscape('Ordförande Helena Vinter förklarade sammanträdet öppnat. Carl Bergström utsågs att jämte')}) show
72 550 moveto
(${psEscape('ordföranden justera dagens protokoll.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 515 moveto
(${psEscape('§ 2. Fastställande av dagordning')}) show
/Helvetica-ISO findfont 10 scalefont setfont
72 495 moveto
(${psEscape('Den utsända dagordningen fastställdes utan tillägg.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 460 moveto
(${psEscape('§ 3. Rapport från verkställande direktör')}) show
/Helvetica-ISO findfont 10 scalefont setfont
72 440 moveto
(${psEscape('VD Fredrik Alm redogjorde för läget i verksamheten under årets första månad.')}) show
72 425 moveto
(${psEscape('Nettoomsättningen ökade med 14 % jämfört med samma period föregående år.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 1 av 2) show
FooterBar
showpage
`;

  // PAGE 2 (Contains the key decision)
  ps += `%%Page: 2 2
HeaderBar
/Helvetica-Bold-ISO findfont 14 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('STYRELSEPROTOKOLL – BESLUT')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 710 moveto
(${psEscape('§ 4. Investering i ny säkerhetsinfrastruktur och IT-arkitektur')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 690 moveto
(${psEscape('VD föredrog underlag rörande uppgradering av bolagets datacenter och molnsäkerhet.')}) show

% TARGET SENTENCE FOR HIGHLIGHT. Wrapped so the line stays inside the page.
72 670 moveto
(${psEscape('Styrelsen beslutade enhälligt att godkänna investeringen i ny central brandvägg och nolltillitsarkitektur med en')}) show
72 655 moveto
(${psEscape('budgetram om maximalt 450 000 SEK under Q2 2026.')}) show

72 635 moveto
(${psEscape('Upphandlingen delegeras till VD med återrapportering vid ordinarie styrelsemöte i maj.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 605 moveto
(${psEscape('§ 5. Förberedelser inför årsstämma 2026')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 585 moveto
(${psEscape('Beslöts att ordinarie bolagsstämma ska hållas torsdagen den 7 maj 2026 i Stockholm.')}) show
72 570 moveto
(${psEscape('Kallelse ska publiceras i Post- och Inrikes Tidningar samt på bolagets hemsida.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 525 moveto
(${psEscape('§ 6. Mötets avslutande')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 505 moveto
(${psEscape('Då inga övriga frågor förelåg tackade ordföranden för visat intresse och avslutade mötet.')}) show

gsave
0.75 0.77 0.8 setrgbcolor
72 430 160 1 rectstroke
240 430 160 1 rectstroke
grestore

/Helvetica-Bold-ISO findfont 9 scalefont setfont
72 415 moveto
(${psEscape('Helena Vinter, Styrelseordförande')}) show
240 415 moveto
(${psEscape('Carl Bergström, Justerare')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 2 av 2) show
FooterBar
showpage
`;

  return ps;
}

// Build PDF 3: Personalpolicy
function buildPersonalpolicyPS() {
  let ps = headerPS();

  // PAGE 1
  ps += `%%Page: 1 1
HeaderBar
/Helvetica-Bold-ISO findfont 18 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('PERSONALHANDBOK & RIKTLINJER')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.4 0.4 0.4 setrgbcolor
72 735 moveto
(${psEscape('Gäller för samtliga anställda | Version 3.4 | Gäller från 2026-01-01')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 690 moveto
(${psEscape('1. Introduktion och kultur')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 670 moveto
(${psEscape('Vår arbetsplats bygger på tillit, ansvar och personligt engagemang. Denna handbok sammanfattar')}) show
72 655 moveto
(${psEscape('de viktigaste villkoren, förmånerna och förhållningsreglerna för att underlätta din vardag.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 615 moveto
(${psEscape('2. Arbetstid och tillgänglighet')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 595 moveto
(${psEscape('2.1 Ordinarie veckoarbetstid för heltidsanställning är 40 timmar per vecka helgfria vardagar.')}) show
72 580 moveto
(${psEscape('2.2 Kärnarbetstid är kl. 09:30-15:00 då samtliga medarbetare förväntas vara tillgängliga för möten.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 540 moveto
(${psEscape('3. Distans- och hybridarbete')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 520 moveto
(${psEscape('3.1 Vi tror på flexibilitet och att ge varje team bäst förutsättningar att lösa sina uppgifter.')}) show

% TARGET SENTENCE FOR HIGHLIGHT 1. Wrapped so the line stays inside the page.
72 500 moveto
(${psEscape('3.2 Medarbetare har möjlighet att arbeta på distans upp till två (2) dagar per vecka efter överenskommelse med')}) show
72 485 moveto
(${psEscape('närmaste chef.')}) show

72 465 moveto
(${psEscape('3.3 Vid distansarbete ansvarar medarbetaren för att en god och ergonomisk arbetsmiljö upprätthålls.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 1 av 2) show
FooterBar
showpage
`;

  // PAGE 2 (Benefits and wellness allowance)
  ps += `%%Page: 2 2
HeaderBar
/Helvetica-Bold-ISO findfont 14 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('PERSONALHANDBOK – FÖRMÅNER')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 710 moveto
(${psEscape('4. Friskvård och hälsa')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 690 moveto
(${psEscape('Hälsa och välmående är grunden för god trivsel och prestation. Bolaget uppmuntrar fysisk aktivitet.')}) show

% TARGET SENTENCE FOR HIGHLIGHT 2 (Page 2, Y=668, height=14, X=72 to 510)
72 670 moveto
(${psEscape('4.1 Bolaget erbjuder samtliga tillsvidareanställda ett årligt friskvårdsbidrag om 5 000 SEK mot uppvisande av godkända kvitton.')}) show

72 650 moveto
(${psEscape('4.2 Kvitton ska registreras i bolagets förmånsportal senast den 30 november innevarande år.')}) show
72 630 moveto
(${psEscape('4.3 Friskvårdsbidraget kan nyttjas för motionsaktiviteter, massage och appar enligt Skatteverkets regler.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 585 moveto
(${psEscape('5. Kompetensutveckling och konferenser')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 565 moveto
(${psEscape('5.1 Varje anställd har en årlig utvecklingsbudget om minst 15 000 SEK för kurser och certifieringar.')}) show
72 550 moveto
(${psEscape('5.2 Kursdeltagande planeras i samråd med närmaste chef vid det årliga utvecklingssamtalet.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 2 av 2) show
FooterBar
showpage
`;

  return ps;
}

// Build PDF 4: Fiktiva Stadgar Brf Björken (100% syntetisk, 11 sidor)
function buildStadgarBjorkenPS() {
  let ps = headerPS();

  // Pages 1 to 5: Intro, membership, fees
  for (let p = 1; p <= 5; p++) {
    ps += `%%Page: ${p} ${p}
HeaderBar
/Helvetica-Bold-ISO findfont 16 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('STADGAR FÖR BOSTADSRÄTTSFÖRENINGEN BJÖRKEN')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.4 0.4 0.4 setrgbcolor
72 735 moveto
(${psEscape('Fiktiv och syntetisk exempelförening | Registrerad hos Bolagsverket 2024')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 680 moveto
(${psEscape(`§ ${p}. Föreningens ändamål och allmänna bestämmelser (del ${p})`)}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 650 moveto
(${psEscape('Föreningen har till ändamål att främja medlemmarnas ekonomiska intressen genom att i föreningens hus')}) show
72 635 moveto
(${psEscape('upplåta bostadslägenheter för permanent boende samt lokaler åt medlemmarna med bostadsrätt.')}) show
72 615 moveto
(${psEscape('Styrelsen företräder föreningen och ansvarar för dess organisation och förvaltning.')}) show
72 595 moveto
(${psEscape('Medlemskap kan beviljas person som övertar bostadsrätt i föreningens fastighet.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida ${p} av 11) show
FooterBar
showpage
`;
  }

  // PAGE 6: The exact § 14 from the real screenshot!
  ps += `%%Page: 6 6
HeaderBar
/Helvetica-Bold-ISO findfont 14 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('STADGAR – UPPLÅTELSE I ANDRA HAND')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.3 0.3 0.3 setrgbcolor
72 725 moveto
(${psEscape('Det åligger bostadsrättshavaren att teckna och vidhålla hemförsäkring och därtill så kallad tilläggsförsäkring.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 685 moveto
(${psEscape('§ 14. Andrahandsuthyrning')}) show

% § 14. Lines that used to run past the page edge are wrapped.
/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 655 moveto
(${psEscape('En bostadsrättshavare får upplåta sin lägenhet i andra hand till annan för självständigt brukande endast om')}) show
72 640 moveto
(${psEscape('styrelsen ger sitt samtycke.')}) show
72 625 moveto
(${psEscape('Ett tillstånd till andrahandsupplåtelse kan begränsas till viss tid och förenas med villkor.')}) show

72 600 moveto
(${psEscape('Vägrar styrelsen att ge sitt samtycke till en andrahandsupplåtelse får bostadsrättshavaren ändå upplåta sin lägenhet')}) show
72 585 moveto
(${psEscape('i andra hand om hyresnämnden lämnar tillstånd till upplåtelsen. Tillstånd ska lämnas om bostadsrättshavaren har')}) show
72 570 moveto
(${psEscape('beaktansvärda skäl för upplåtelsen och föreningen inte har någon befogad anledning att vägra.')}) show

72 545 moveto
(${psEscape('Bostadsrättshavare som önskar upplåta sin lägenhet i andra hand ska')}) show
72 530 moveto
(${psEscape('skriftligen hos styrelsen ansöka om medgivande')}) show
72 515 moveto
(${psEscape('till upplåtelsen och i ansökan ska anges skälet till upplåtelsen samt namnet på den till vilken lägenheten ska upplåtas.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 475 moveto
(${psEscape('§ 15. Inneboende')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 455 moveto
(${psEscape('Bostadsrättshavaren får inte inrymma utomstående personer i lägenheten om det kan medföra men för föreningen.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 415 moveto
(${psEscape('§ 16. Användning av lägenheten')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 395 moveto
(${psEscape('Bostadsrättshavaren får inte använda lägenheten för något annat ändamål än det avsedda.')}) show
72 380 moveto
(${psEscape('Upplåts lägenheten i strid med detta kan det leda till förverkande och uppsägning.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida 6 av 11) show
FooterBar
showpage
`;

  // Pages 7 to 11
  for (let p = 7; p <= 11; p++) {
    ps += `%%Page: ${p} ${p}
HeaderBar
/Helvetica-Bold-ISO findfont 14 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape(`STADGAR – FÖRVALTNING & STÄMMA (DEL ${p})`)}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
72 680 moveto
(${psEscape(`§ ${p + 10}. Föreningsstämma och tillsyn`)}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 650 moveto
(${psEscape('Ordinarie föreningsstämma ska hållas årligen före juni månads utgång.')}) show
72 635 moveto
(${psEscape('Beslut om ändring av dessa stadgar fattas i den ordning som föreskrivs i bostadsrättslagen.')}) show
72 615 moveto
(${psEscape('Protokoll från stämman ska hållas tillgängligt för medlemmarna senast tre veckor efter mötet.')}) show

/Helvetica-ISO findfont 9 scalefont setfont
0.5 0.5 0.5 setrgbcolor
470 45 moveto
(Sida ${p} av 11) show
FooterBar
showpage
`;
  }

  return ps;
}

function buildOffertPS() {
  let ps = headerPS();
  ps += `%%Page: 1 1
HeaderBar
/Helvetica-Bold-ISO findfont 18 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 755 moveto
(${psEscape('OFFERT - LEVERANSVILLKOR')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.4 0.4 0.4 setrgbcolor
72 735 moveto
(${psEscape('Offertreferens: OFF-2026-014 | Upprättat: 2026-03-02')}) show

/Helvetica-Bold-ISO findfont 11 scalefont setfont
0.15 0.18 0.25 setrgbcolor
72 700 moveto
(${psEscape('PARTER')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 680 moveto
(${psEscape('Leverantör: Example Kontor AB, Org.nr 559100-2040')}) show
72 665 moveto
(${psEscape('Kund: Nordiska Kontoret AB, Org.nr 556200-1188')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 630 moveto
(${psEscape('§ 2. Leverans')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 605 moveto
(${psEscape('2.1 Leverans sker inom tio (10) arbetsdagar från beställning.')}) show
72 585 moveto
(${psEscape('2.2 Frakt ingår i priset vid beställning över 5 000 kronor.')}) show

/Helvetica-Bold-ISO findfont 12 scalefont setfont
0.1 0.1 0.1 setrgbcolor
72 545 moveto
(${psEscape('§ 3. Pris')}) show

/Helvetica-ISO findfont 10 scalefont setfont
0.2 0.2 0.2 setrgbcolor
72 520 moveto
(${psEscape('3.1 Priset fastställs per kalendermånad och faktureras i förskott.')}) show

FooterBar
showpage
`;
  return ps;
}

const docs = [
  { name: 'nordic-tech-avtal', ps: buildNordicTechPS() },
  { name: 'vinter-bolag-protokoll', ps: buildVinterProtokollPS() },
  { name: 'personalpolicy-riktlinjer', ps: buildPersonalpolicyPS() },
  { name: 'stadgar-brf-bjorken', ps: buildStadgarBjorkenPS() },
  { name: 'offert-leveransvillkor', ps: buildOffertPS() },
];

for (const doc of docs) {
  const psPath = path.resolve(OUT_DIR, `${doc.name}.ps`);
  const pdfPath = path.resolve(OUT_DIR, `${doc.name}.pdf`);
  fs.writeFileSync(psPath, doc.ps, 'utf8');
  execSync(`ps2pdf -sPAPERSIZE=a4 "${psPath}" "${pdfPath}"`);
  fs.unlinkSync(psPath);
  console.log(`Generated: ${pdfPath}`);
}
console.log('All synthetic demo PDFs generated successfully!');
