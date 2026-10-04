import React from 'react';
import TraffMark from './TraffMark';
import './UseCasesSection.css';

const CARDS = [
  {
    num: '01',
    title: 'Belägget kommer först',
    body: 'Svaret och raden i dokumentet visas samtidigt.',
    proof: 'belagt',
  },
  {
    num: '02',
    title: 'Vägran är en funktion',
    body: 'Saknas underlaget säger Träff det rakt ut.',
    proof: 'ejbelagt',
  },
  {
    num: '03',
    title: 'Citat står som de står',
    body: 'Dokumentets ord återges ordagrant, aldrig omskrivna.',
    proof: 'citat',
  },
];

export default function UseCasesSection() {
  return (
    <section className="usecases-section" id="use-cases-section">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">03 · Principen</span>
          <h2 className="section-title-serif">Tre löften. Se beläggen.</h2>
        </div>

        <div className="promise-grid">
          {CARDS.map((card) => (
            <article key={card.num} className="promise-card">
              <span className="promise-num">{card.num}</span>
              <h3 className="promise-title">{card.title}</h3>
              <p className="promise-body">{card.body}</p>
              {card.proof === 'belagt' && (
                <div className="promise-proof promise-proof-belagt">
                  <div className="promise-proof-top">
                    <span>Avtal · sida 2</span>
                    <span className="promise-proof-index">1</span>
                  </div>
                  <p className="promise-quote">”Avtalet gäller tills vidare med en ömsesidig uppsägningstid om tre (3) månader före avtalsperiodens utgång.”</p>
                </div>
              )}
              {card.proof === 'ejbelagt' && (
                <div className="promise-proof promise-proof-refusal">
                  <div className="promise-proof-status">
                    <TraffMark size={16} state="ejbelagt" decorative />
                    <span>Ej belagt</span>
                  </div>
                  <p className="promise-assertion">Det står inte i något av era dokument.</p>
                </div>
              )}
              {card.proof === 'citat' && (
                <div className="promise-proof promise-proof-quote">
                  <p className="promise-quote">”Priset fastställs per kalendermånad och faktureras i förskott.”</p>
                  <p className="promise-verbatim">Ordagrant · sida 1</p>
                </div>
              )}
            </article>
          ))}
        </div>
        <p className="promise-note">Exempel ur testhandlingar.</p>
      </div>
    </section>
  );
}
