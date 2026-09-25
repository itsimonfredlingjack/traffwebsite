import React, { useState } from 'react';
import TraffMark from './TraffMark';
import './MarkSection.css';

const STATES_INFO = {
  vila: {
    title: 'Tyst tom ring',
    lead: 'Vilande — ingen fråga ställd',
    desc: 'Ingen fråga ställd, alltså ingen träff att visa. 30 % opacitet, stillsam andning och ingen falsk aktivitet.',
    tech: 'OPACITET 30% · STATISK VILA',
  },
  soker: {
    title: 'Bruten ring, diffust sökljus',
    lead: 'Söker — sökljuset sveper genom handlingarna',
    desc: 'Ljuset sveper genom arkivet och bläddrar i sidorna. Mitten är ett sken utan kant — ingen kärna, för ingenting är belagt än.',
    tech: 'SÖKLJUSROTERING · 1.0S LINJÄR',
  },
  belagt: {
    title: 'Kärnan slår till',
    lead: 'Belagt — ordagrant verifierat mot källan',
    desc: 'Det enda tillfället kärnan någonsin ritas. Den slår till i samma ögonblick som sidan öppnas och meningen markeras med gul penna.',
    tech: 'ANIMATION 460MS · EXPANSION OCH FLASH',
  },
  ejbelagt: {
    title: 'Ring kvar, mitten helt tom',
    lead: 'Ej belagt — ärlig vägran istället för gissning',
    desc: 'Handlingarna finns, men svaret gör det inte. Formen håller och Träff hittar aldrig på en kärna. Vägran är en pålitlighetsfunktion.',
    tech: 'BÄRNSTEN #E5B45C · 100% TOM KÄRNA',
  },
};

export default function MarkSection() {
  const [activeState, setActiveState] = useState('belagt');
  const current = STATES_INFO[activeState];

  return (
    <section className="mark-section" id="mark-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-head-editorial">
          <span className="section-mono-kicker">01 · SYSTEMET: TVÅ MÄRKEN, EN FORM</span>
          <h2 className="section-title-serif">
            Två märken, en form — <span className="serif-italic">identitetens hårdaste regel</span>
          </h2>
          <p className="section-lead-text">
            Samma cirkel bär två helt skilda betydelser, och de får aldrig glida ihop.
            Varumärket är komplett för att det är ett namn.
            Statusmärket börjar tomt för att det är ett påstående — och ett påstående måste förtjänas.
          </p>
        </div>

        {/* The Two Halves: A (Varumärket) & B (Statusmärket) */}
        <div className="mark-dual-grid">
          {/* Card A: Varumärket - Paper substrate */}
          <div className="mark-card card-brand-paper">
            <div className="card-top-kicker">
              <span className="mono-badge-brand">A · VARUMÄRKET</span>
              <span className="mono-sub-brand">NAMNET · IDENTITETEN</span>
            </div>

            <div className="mark-display-stage paper-stage">
              <TraffMark size={112} variant="brand" decorative />
            </div>

            <div className="card-bottom-editorial">
              <h3 className="card-serif-title text-dark">Alltid komplett. Alltid enfärgad.</h3>
              <p className="card-body-desc text-dark-muted">
                Sidhuvud, appikon, trycksaker, presentationer. Här är ◉ ett namn — det säger vem som talar,
                inte vad som är sant. Därför bär den aldrig tillståndsfärg, aldrig grönt, inte ens i marknadsföring.
              </p>
              <div className="geometry-mono-tag text-dark-sub">
                <span>RINGVIKT: 8 % · KÄRNA: 46 % AV INNERMÅTT</span>
              </div>
            </div>
          </div>

          {/* Card B: Statusmärket - Dark substrate with live switcher */}
          <div className="mark-card card-status-dark">
            <div className="card-top-kicker">
              <span className="mono-badge-status">B · STATUSMÄRKET</span>
              <span className="mono-sub-status">BEVISET · TILLSTÅNDET</span>
            </div>

            {/* Interactive State Selector */}
            <div className="status-interactive-tabs" role="tablist" aria-label="Statusmärkets tillstånd">
              {(['vila', 'soker', 'belagt', 'ejbelagt']).map((st) => (
                <button
                  key={st}
                  role="tab"
                  aria-selected={activeState === st}
                  className={`status-tab-btn ${st} ${activeState === st ? 'active' : ''}`}
                  onClick={() => setActiveState(st)}
                >
                  <TraffMark size={14} variant="status" state={st} decorative />
                  <span>{st === 'ejbelagt' ? 'EJ BELAGT' : st.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Live Mark Stage */}
            <div className="mark-display-stage dark-stage">
              <div className="mark-ambient-glow" aria-hidden="true" />
              {/* Force re-mounting of belagt to trigger the authentic 460ms strike animation */}
              <TraffMark
                key={activeState}
                size={112}
                variant="status"
                state={activeState}
                breathing={activeState === 'vila'}
                decorative
              />
            </div>

            <div className="card-bottom-editorial">
              <div className="status-live-meta">
                <span className={`status-mono-state-badge ${activeState}`}>
                  {activeState === 'ejbelagt' ? 'EJ BELAGT' : activeState.toUpperCase()}
                </span>
                <span className="status-mono-tech">{current.tech}</span>
              </div>

              <h3 className="card-serif-title">{current.title}</h3>
              <p className="card-body-desc">
                {current.desc}
              </p>

              <div className="status-quote-box">
                <p>
                  <em>”Kärnan ritas i samma ögonblick som en passage är ordagrant verifierad — inte en millisekund tidigare. En fylld kärna utan citat är en lögn i formspråket.”</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Geometry Principles Trio (§02 Geometrin) */}
        <div className="mark-geometry-trio">
          <div className="geometry-card">
            <span className="geo-num">01</span>
            <h4 className="geo-title">Yttre ring — materialet</h4>
            <p className="geo-desc">
              Sluten ring med en tjocklek på exakt 8 % av ytterdiametern. Representerar hela ert dokumentarkiv:
              avgränsat, indexerat och säkrat.
            </p>
          </div>

          <div className="geometry-card">
            <span className="geo-num">02</span>
            <h4 className="geo-title">Mellanrummet — sökningen</h4>
            <p className="geo-desc">
              Alltid tomt. Ingen tonplatta, ingen gradient. Det är det mätbara avståndet mellan frågan
              och källbeviset tills passagen lokaliserats.
            </p>
          </div>

          <div className="geometry-card">
            <span className="geo-num">03</span>
            <h4 className="geo-title">Kärnan — träffen</h4>
            <p className="geo-desc">
              Solid, koncentrisk, exakt 46 % av innermåttet. Ritas enbart vid ordagrann verifiering.
              Alltid centrerad — en träff sitter aldrig snett.
            </p>
          </div>
        </div>

        {/* Accessibility Guarantee (§01) */}
        <div className="mark-a11y-banner">
          <span className="a11y-mono-badge">TILLGÄNGLIGHET</span>
          <p className="a11y-body-text">
            Statusmärket är Träffs <strong>primära visuella statusindikator — aldrig den enda</strong>.
            Varje tillstånd åtföljs alltid av sin fulla textetikett i monospace: <code>BELAGT</code>, <code>EJ BELAGT</code>, <code>SÖKER</code>.
            Beslutsunderlag får aldrig hänga på färg eller form ensam.
          </p>
        </div>
      </div>
    </section>
  );
}
