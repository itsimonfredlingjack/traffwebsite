import React from 'react';
import TraffMark from './TraffMark';
import './ComparisonSection.css';

export default function ComparisonSection() {
  return (
    <section className="comparison-section" id="comparison-section">
      <div className="section-container">
        {/* Editorial Section Header */}
        <div className="section-head-editorial">
          <span className="section-mono-kicker">01 · PRINCIPEN</span>
          <h2 className="section-title-serif">
            Två sätt att svara — <span className="serif-italic">gissning mot bevis</span>
          </h2>
          <p className="section-lead-text">
            Generella språkmodeller är tränade att låta övertygande, inte att tala sanning.
            I avtal, styrelseprotokoll och rapporter har du inte råd med en AI som gissar.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="comparison-columns">
          {/* Generic AI Card */}
          <div className="comparison-col col-generic">
            <div className="col-status-header">
              <div className="col-tag ej-belagt">
                <TraffMark size={16} variant="status" state="ejbelagt" decorative />
                <span className="tag-mono">EJ BELAGT</span>
              </div>
              <span className="col-target-label">Generisk AI &amp; Chatbots</span>
            </div>

            <h3 className="col-card-title">Svarar med självförtroende – utan bevis</h3>
            <p className="col-card-summary">
              Generella modeller ger ofta ett välformulerat svar, men kan inte garantera
              att texten faktiskt existerar i era handlingar.
            </p>

            <div className="col-points-list">
              <div className="col-point-item">
                <div className="point-number">01</div>
                <div>
                  <strong>Hallucinerar klausuler och belopp</strong>
                  <p>Hittar på paragrafer som låter trovärdiga men inte finns i verkligheten.</p>
                </div>
              </div>

              <div className="col-point-item">
                <div className="point-number">02</div>
                <div>
                  <strong>Kan inte visa sidan</strong>
                  <p>Du får ingen direkt länk till dokumentet och måste ändå bläddra manuellt.</p>
                </div>
              </div>

              <div className="col-point-item">
                <div className="point-number">03</div>
                <div>
                  <strong>Tvingar fram dubbelkontroll</strong>
                  <p>Eftersom ingen källa syns vågar varken styrelse eller VD lita på svaret.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Träff Card */}
          <div className="comparison-col col-traff">
            <div className="col-status-header">
              <div className="col-tag belagt">
                <TraffMark size={16} variant="status" state="belagt" decorative />
                <span className="tag-mono">BELAGT</span>
              </div>
              <div className="col-target-label-traff">
                <TraffMark size={18} variant="brand" decorative />
                <span className="col-target-name">Träff</span>
              </div>
            </div>

            <h3 className="col-card-title">100% källbunden med inringat bevis</h3>
            <p className="col-card-summary">
              Träff slår upp sidan och ritar in meningen med gul penna. Du läser källan själv i samma sekund.
            </p>

            <div className="col-points-list">
              <div className="col-point-item">
                <div className="point-number">01</div>
                <div>
                  <strong>Ordagrant verifierat mot källtext</strong>
                  <p>Inget svar formuleras utan att det finns direkt täckning i handlingarna.</p>
                </div>
              </div>

              <div className="col-point-item">
                <div className="point-number">02</div>
                <div>
                  <strong>Bläddrar fram rätt sida i samma ögonblick</strong>
                  <p>Originaldokumentet visas direkt bredvid svaret, redo att granskas.</p>
                </div>
              </div>

              <div className="col-point-item">
                <div className="point-number">03</div>
                <div>
                  <strong>Vägran är en funktion</strong>
                  <p>Om informationen saknas i dokumenten säger Träff det rakt ut istället för att gissa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
