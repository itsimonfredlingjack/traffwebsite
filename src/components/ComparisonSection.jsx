import React from 'react';
import TraffMark from './TraffMark';
import './ComparisonSection.css';

export default function ComparisonSection() {
  return (
    <section className="comparison-section" id="comparison-section">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">02 · Skillnaden</span>
          <h2 className="section-title-serif">Samma fråga. Två olika svar.</h2>
          <p className="section-lead-text">
            Avtalet säger ingenting om prishöjningar. Se vad som händer när någon frågar ändå.
          </p>
        </div>

        <div className="compare-question">
          <span className="compare-question-tag">Fråga</span>
          <span className="compare-question-text">Får leverantören höja månadspriset under avtalstiden?</span>
        </div>

        <div className="compare-grid">
          <article className="compare-card compare-card-plain">
            <div className="compare-card-top">
              <span className="compare-name">En vanlig AI-chatt</span>
              <span className="compare-badge">Illustration</span>
            </div>
            <div className="compare-status">
              <svg className="compare-dashed-mark" viewBox="-60 -60 120 120" aria-hidden="true">
                <circle r="40" fill="none" stroke="#5A5A55" strokeWidth="8" strokeDasharray="2 20" strokeLinecap="round" opacity="0.7" />
              </svg>
              <span className="compare-status-label">Ingen källa angiven</span>
            </div>
            <div className="compare-rail compare-rail-muted" aria-hidden="true" />
            <div className="compare-body">
              <p className="compare-invented">
                Ja. Leverantörer får normalt höja priset med 3–5 procent per år enligt branschpraxis. Räkna med en höjning vid nästa årsskifte.
              </p>
              <p className="compare-meta">0 av 1 påståenden med källa</p>
            </div>
          </article>

          <article className="compare-card compare-card-traff">
            <div className="compare-card-top">
              <span className="compare-name compare-name-ink">Träff</span>
              <span className="compare-badge">Exempeldata</span>
            </div>
            <div className="compare-status">
              <TraffMark size={20} state="ejbelagt" decorative />
              <span className="compare-status-label compare-status-refusal">Ej belagt</span>
            </div>
            <div className="compare-rail compare-rail-refusal" aria-hidden="true" />
            <div className="compare-body compare-body-refusal">
              <p className="compare-assertion">Det står inte i något av era dokument.</p>
              <p className="compare-explain">Inget underlag hittades. Träff gissar inte.</p>
              <p className="compare-meta compare-meta-refusal">0 källor verifierade · 4 dokument genomsökta</p>
            </div>
          </article>
        </div>

        <p className="compare-note">
          Svaret till vänster är påhittat för att visa mekanismen. Ett svar utan källa går inte att kontrollera.
        </p>
      </div>
    </section>
  );
}
