import React from 'react';
import './FeaturesSection.css';

const CELLS = [
  {
    label: 'Modell',
    title: 'Gemma 4 12B',
    body: 'Namnet står på varje svar.',
  },
  {
    label: 'Drift',
    title: 'Self-hosted',
    body: 'Modellen drivs av Träff själv.',
  },
  {
    label: 'Kontroll',
    title: 'Källan verifieras',
    body: 'Varje källhänvisning kontrolleras mot dokumentet innan svaret visas.',
  },
  {
    label: 'Osäkert',
    title: 'Träff gissar inte',
    body: 'Saknas underlag svarar Träff det, inte något annat.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="features-section" id="features-section">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">04 · Arkitektur &amp; trygghet</span>
          <h2 className="section-title-serif">Öppet om hur svaren blir till.</h2>
          <p className="section-lead-text">Fyra saker du kan kontrollera själv, på varje svar.</p>
        </div>

        <div className="trust-board">
          {CELLS.map((cell) => (
            <div key={cell.label} className="trust-cell">
              <span className="trust-label">{cell.label}</span>
              <h3 className="trust-title">{cell.title}</h3>
              <p className="trust-body">{cell.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
