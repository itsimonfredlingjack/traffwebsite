# Kontrast och träffytor att åtgärda i designen

Status 2026-09-26, efter mätning på den renderade sidan: raderna nedan är den ursprungliga mätningen. Färgerna är sedan satta till bläck `#0F1115` med alfa 0,60–0,64 och accenterna `#137855` / `#8A5D06`. Träffytorna för sidbyte och zoom är 24×24 utan att ikonerna flyttats. Kopiera, Gör om och footer-länkarna är kvar i sin synliga storlek eftersom avståndet mellan mitten uppfyller WCAG 2.5.8 (cirka 71 px respektive 34 px). Tabellen är kvar som underlag för vad som mättes, inte som en öppen åtgärdslista.

Mätt 2026-09-26 mot den byggda sidan (`vite preview`), mobil 375×812 och desktop 1280×800.
Verktyg: Lighthouse 13 (mobil och desktop) och axe-core 4.13 med WCAG 2.0/2.1/2.2 A och AA.
Axe kördes mot viloläget. Lighthouse kördes mot en vanlig sidladdning. Samma färger föll i båda.

Mätningen nedan gjordes innan färgjusteringen. Tokens i `src/LandingPage.css` är nu `--belagt: #137855` och `--ej-belagt: #8A5D06`.

Rubrikordning och det otillåtna `aria-label` på markeringen i PDF:en är redan åtgärdade och finns inte med här.

## Så här läser man tabellen

Varje rad är ett fel som båda verktygen rapporterade, med upprepad samma kombination av selektor, färg och kvot samlad till en rad. Siffran i kolumnen Antal är per vy.

Krav för den här texten är **4,5:1**. Ingen av raderna är stor text. Stor text (3:1) är 24 px vid normal vikt, eller 18,7 px (14 pt) och fet. Allt här är mindre än så. 3:1 gäller alltså inte de här raderna, bara om texten görs så stor.

Mot vit behöver en grå text vara ungefär **#767676 eller mörkare** för att nå 4,5:1. Flera rader är ljusare än så.

När tabellen mättes var de fallande reglerna hårdkodade, så tokenvärdet användes inte. `src/LandingPage.css` har sedan dess `--belagt: #137855` och `--ej-belagt: #8A5D06`, och reglerna pekar på dem. `src/theme.css` har samma `--belagt` och kallar vägran `--vagran: #8A5D06`.

SÖKER-etiketten i heron (`#2563EB` på vit) och den aktiva scenariofliken (vit på `#111317`) klarade 4,5:1 och finns inte med.

## Kontrast

| Plats | Element | Vy | Antal | Förgrund, uppmätt | Bakgrund, uppmätt | Kontrast | Krav | Textstorlek | Var färgen kommer ifrån |
|---|---|---|---|---|---|---|---|---|---|
| Hero, tillståndsraden | `.state-indicator-pill.vila .state-label` (VILA) | mobil och desktop | 1 | #939496 | #ffffff | 3,03:1 | 4,5:1 | 9,5 px, fet | `src/components/HeroHeader.css`. Text `rgba(15, 17, 21, 0.45)`. Pillen ligger på `.hero-states-strip` med bakgrund `#FFFFFF`. |
| Hero, tillståndsraden | `.state-indicator-pill.belagt .state-label` (BELAGT) | mobil och desktop | 1 | #059669 | #ffffff | 3,76:1 | 4,5:1 | 9,5 px, fet | `HeroHeader.css`, `color: #059669`. Samma hex som `--belagt` i `LandingPage.css`. Regeln refererar inte variabeln. |
| Hero, tillståndsraden | `.state-indicator-pill.ej-belagt .state-label` (EJ BELAGT) | mobil och desktop | 1 | #d97706 | #ffffff | 3,18:1 | 4,5:1 | 9,5 px, fet | `HeroHeader.css`, `color: #D97706`. Samma hex som `--ej-belagt`. Regeln refererar inte variabeln. |
| Demo, raden ovanför flikarna | `.demo-mono-header` | mobil och desktop | 1 | #888989 | #f7f7f5 | 3,27:1 | 4,5:1 | 9,5 px, fet | `src/components/InteractiveDemo.css`. Text `rgba(15, 17, 21, 0.48)`. Bakgrund `.demo-scenario-strip` `#F7F7F5` (samma som `--skal-subtle`). |
| Demo, inaktiva scenarioflikar | `.tab-category` inuti `.demo-scenario-tab-btn` som inte är `.active` | mobil och desktop | 4 på desktop. Axe såg 3 på mobil, den fjärde ligger utanför den scrollande remsan. | #828385 | #ffffff | 3,79:1 | 4,5:1 | 8,5 px, fet | `InteractiveDemo.css`, `color: rgba(15, 17, 21, 0.52)`. Flikens bakgrund är `#FFFFFF`. Den aktiva fliken (vit 75 % på `#111317`) klarar kontrasten. |
| Demo, mobil växling mellan chatt och dokument | `.demo-mobile-tab-btn` som inte är `.active`, texten i `span` | bara mobil | 1 | #77797a | #f7f7f5 | 4,07:1 | 4,5:1 | 13 px | `InteractiveDemo.css`. Knappen har `color: rgba(15, 17, 21, 0.55)` och `font-weight: 600`. Listen har bakgrund `#F7F7F5`. Den aktiva fliken är `#0F1115` och föll inte. |
| Demo, frågehuvudet | `.inquiry-mono-step` (FRÅGA N) | mobil och desktop | 1 | #8c8d8f | #ffffff | 3,32:1 | 4,5:1 | 9,5 px, fet | `InteractiveDemo.css`, `color: rgba(15, 17, 21, 0.48)`. |
| Demo, frågehuvudet | `.inquiry-mono-time` (klockslaget) | mobil och desktop | 1 | #9fa0a1 | #ffffff | 2,61:1 | 4,5:1 | 10 px, normal | `InteractiveDemo.css`, `color: rgba(15, 17, 21, 0.4)`. Ingen vikt satt, så den ärver normal. |
| Demo, tidslinjen i vila | `.state-badge-row.vila .state-name-mono` | mobil och desktop | 1 | #9fa0a1 | #ffffff | 2,61:1 | 4,5:1 | 11 px, fet | `InteractiveDemo.css`, `color: rgba(15, 17, 21, 0.4)`. |
| Demo, tomt svar | `.answer-placeholder` (Inväntar sökning…) | mobil och desktop | 1 | #a4a5a6 | #ffffff | 2,46:1 | 4,5:1 | 15,2 px, normal | `InteractiveDemo.css`, `color: rgba(15, 17, 21, 0.38)`. |
| Demo, raden under svaret | `.inquiry-model-tag` | mobil och desktop | 1 | #939496 | #ffffff | 3,03:1 | 4,5:1 | 9 px, normal | `InteractiveDemo.css`, `color: rgba(15, 17, 21, 0.45)`. |
| Sektionsögonbryn: Principen, Tillämpning, Arkitektur, Frågor | `.section-mono-kicker` | mobil och desktop | 4 | #838484 | #efefeb | 3,25:1 | 4,5:1 | 10 px, fet | `src/components/ComparisonSection.css`, `color: rgba(15, 17, 21, 0.48)`. Klassen laddas globalt därifrån. Bakgrunden är `#EFEFEB` i respektive sektionsfil (samma som `--skal`). |
| Jämförelse, vänster chip | `.col-tag.ej-belagt .tag-mono` | mobil och desktop | 1 | #d97706 | #fcf4eb | 2,92:1 | 4,5:1 | 10 px, fet | `ComparisonSection.css`. Text `#D97706` ärvs från `.col-tag.ej-belagt`. Chipens bakgrund är `rgba(217, 119, 6, 0.08)` ovanpå kortets `#FFFFFF`, vilket blir #fcf4eb. |
| Jämförelse, vänster kort | `.col-target-label` | mobil och desktop | 1 | #828385 | #ffffff | 3,79:1 | 4,5:1 | 12,5 px, normal | `ComparisonSection.css`, `color: rgba(15, 17, 21, 0.52)`. |
| Jämförelse, vänster kort | `.col-generic .point-number` | mobil och desktop | 3 | #d97706 | #ffffff | 3,18:1 | 4,5:1 | 11 px, fet | `ComparisonSection.css`, `color: #D97706`. |
| Jämförelse, höger chip | `.col-tag.belagt .tag-mono` | mobil och desktop | 1 | #059669 | #ebf7f3 | 3,43:1 | 4,5:1 | 10 px, fet | `ComparisonSection.css`. Text `#059669` från `.col-tag.belagt`. Chipens bakgrund `rgba(5, 150, 105, 0.08)` på `#FFFFFF` blir #ebf7f3. |
| Jämförelse, höger kort | `.col-traff .point-number` | mobil och desktop | 3 | #059669 | #ffffff | 3,76:1 | 4,5:1 | 11 px, fet | `ComparisonSection.css`, `color: #059669`. |
| Tillämpning | `.usecase-mono-badge` | mobil och desktop | 1 | #059669 | #ffffff | 3,76:1 | 4,5:1 | 10 px, fet | `src/components/UseCasesSection.css`, `color: #059669`. Kortet är `#FFFFFF`. |
| Tillämpning, resultatraden | `.result-mono` | mobil och desktop | 1 | #059669 | #ecfdf5 | 3,57:1 | 4,5:1 | 9,5 px, fet | `UseCasesSection.css`, `color: #059669`. Bakgrund är `.usecase-result-strip` `#ECFDF5`. |
| Arkitektur, de fyra korten | `.card-num` | mobil och desktop | 4 | #a4a5a6 | #ffffff | 2,46:1 | 4,5:1 | 11 px, fet | `src/components/FeaturesSection.css`, `color: rgba(15, 17, 21, 0.38)`. |
| Arkitektur, de fyra korten | `.card-tag` | mobil och desktop | 4 | #6f6f6f | #f3f1ec | 4,45:1 | 4,5:1 | 9,5 px, fet | `FeaturesSection.css`. Text `rgba(15, 17, 21, 0.58)`, bakgrund på samma regel `#F3F1EC` (samma som `--matta`). 0,05 under kravet. |
| Arkitektur, de fyra korten | `.card-sub-lead` | mobil och desktop | 4 | #059669 | #ffffff | 3,76:1 | 4,5:1 | 14,4 px, normal | `FeaturesSection.css`, `color: #059669`, `font-size: 0.9rem`. För liten för undantaget för stor text. |
| Footer, det vita kortet | `.paper-mono-kicker` | mobil och desktop | 1 | #8c8d8f | #ffffff | 3,32:1 | 4,5:1 | 10 px, fet | `src/components/Footer.css`, `color: rgba(15, 17, 21, 0.48)`. Kortet `.footer-paper-card` är `#FFFFFF`. |
| Footer, basen | `.footer-eu-mono-tag` | mobil och desktop | 1 | #808180 | #e8e8e3 | 3,18:1 | 4,5:1 | 9 px, fet | `Footer.css`, `color: rgba(15, 17, 21, 0.48)`. Bakgrund `.footer-main-dark` `#E8E8E3`. |
| Footer, basen | `.nav-col-mono-title` | mobil och desktop | 3 | #808180 | #e8e8e3 | 3,18:1 | 4,5:1 | 9,5 px, fet | `Footer.css`, `color: rgba(15, 17, 21, 0.48)` på `#E8E8E3`. |
| Footer, basen | `.nav-static-item` | mobil och desktop | 3 | #868786 | #e8e8e3 | 2,93:1 | 4,5:1 | 13,5 px, normal | `Footer.css`, `color: rgba(15, 17, 21, 0.45)` på `#E8E8E3`. |
| Footer, nederkanten | `.copyright-mono` och `.motto-mono` | mobil och desktop | 2 | #868786 | #e8e8e3 | 2,93:1 | 4,5:1 | 9 px, normal | `Footer.css`, gemensam regel `color: rgba(15, 17, 21, 0.45)` på `#E8E8E3`. |
| Demo, sidminiatyrer under PDF:en | `.mini-page-num` på miniatyr som inte är `.selected` | bara desktop | 2 | #797a7a | #f2f1ed | 3,80:1 | 4,5:1 | 9 px | `src/components/ThumbnailStrip.css`, `color: rgba(22, 24, 28, 0.55)`. Listen `.thumbnail-strip-bar` är `#F2F1ED`. Vald miniatyr är `#16181C` och föll inte. Remsan är dold på mobil. |

## Träffyta

WCAG 2.2 AA kräver minst **24×24 px**, eller att det klickbara avståndet till grannen är minst 24 px. På mobil är 44×44 px en bättre träffyta. De här två knapparna syns bara på desktop. Dokumentrutan är dold när mobilvyn visar chatten, och Lighthouse mobil gav godkänt på träffyta.

| Plats | Element | Vy | Nuvarande yta | Krav | Var storleken kommer ifrån |
|---|---|---|---|---|---|
| Demo, PDF-verktygsfältet, zoom | `button.demo-nav-btn` med `aria-label="Minska zoom"` och `aria-label="Öka zoom"` | desktop | 17×17 px. Avståndet mellan dem räcker inte: säker klickdiameter 18 px. | Minst 24×24 px. 44×44 px om de ska gå att träffa med fingret. | `InteractiveDemo.jsx` ritar `ZoomOut` och `ZoomIn` i `size={13}`. `InteractiveDemo.css` `.demo-nav-btn` har `padding: 2px`. 13 + 2 + 2 = 17. `.demo-zoom-box` har `gap: 4px`, så knapparna sitter tätt. |

Bläddringsknapparna (Föregående sida, Nästa sida) använder samma klass men föll inte. De har en sidräknare mellan sig, och ikonen är 14 px. Verktygen flaggade bara zoomparet.
