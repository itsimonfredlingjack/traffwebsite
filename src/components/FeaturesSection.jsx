import React from 'react';
import './FeaturesSection.css';

export default function FeaturesSection() {
  const pillars = [
    {
      num: '01',
      title: 'Datalagring inom EU & Sverige',
      subtitle: 'Er data lämnar aldrig unionen',
      description:
        'All dokumentbehandling och indexering sker i säkrade datacenter inom EU. Fullständig efterlevnad av GDPR och undertecknat personuppgiftsbiträdesavtal (DPA).',
      monoTag: 'Infrastruktur',
    },
    {
      num: '02',
      title: 'Ingen modellträning på era handlingar',
      subtitle: 'Fullständig företagssekretess',
      description:
        'Era avtal, mötesprotokoll och finansiella rapporter förblir helt isolerade. Inga AI-modeller tränas på era företagsdata – varken våra eller tredje parts.',
      monoTag: 'Konfidentialitet',
    },
    {
      num: '03',
      title: 'Dela med djuplänk till beviset',
      subtitle: 'Klickbar sanning för teamet',
      description:
        'Ska du svara en styrelseledamot, revisor eller kollega? Skicka svaret som en länk. När mottagaren klickar slås samma PDF upp med samma inringade mening.',
      monoTag: 'Samarbete',
    },
    {
      num: '04',
      title: 'Rollbaserad behörighet (RBAC)',
      subtitle: 'Strikt åtkomstkontroll per samling',
      description:
        'Styr exakt vem i ledningsgruppen, styrelsen eller bland medarbetarna som har rätt att söka i specifika dokumentsamlingar och sekretessbelagda protokoll.',
      monoTag: 'Åtkomststyrning',
    },
  ];

  return (
    <section className="features-section" id="features-section">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">03 · Arkitektur och trygghet</span>
          <h2 className="section-title-serif">
            Byggt för organisationer med <span className="serif-italic">nolltolerans mot fel</span>
          </h2>
          <p className="section-lead-text">
            Avtal och styrelsehandlingar kräver samma säkerhetsnivå och noggrannhet som affärskritiska system. Träff är designat för full juridisk spårbarhet och absolut dataskydd.
          </p>
        </div>

        <div className="features-grid-editorial">
          {pillars.map((p) => (
            <div key={p.num} className="feature-editorial-card">
              <div className="card-top-mono">
                <span className="card-num">{p.num}</span>
                <span className="card-tag">{p.monoTag}</span>
              </div>
              <h3 className="card-serif-title">{p.title}</h3>
              <div className="card-sub-lead">{p.subtitle}</div>
              <p className="card-body-desc">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
