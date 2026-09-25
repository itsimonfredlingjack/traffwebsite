import React from 'react';
import './SecuritySection.css';

export default function SecuritySection() {
  const securityPillars = [
    {
      code: '01',
      title: 'Datalagring inom EU & Sverige',
      description:
        'All dokumentbehandling och indexering sker uteslutande i säkrade datacenter inom EU. Era handlingar exporteras eller skickas aldrig utanför unionens gränser.',
    },
    {
      code: '02',
      title: 'Ingen träning på era dokument',
      description:
        'Era avtal, mötesprotokoll och finansiella rapporter förblir helt isolerade. Inga AI-modeller tränas på era företagsdata – varken våra eller tredje parts.',
    },
    {
      code: '03',
      title: 'Militärklassad kryptering',
      description:
        'Kryptering sker både i vila (AES-256) och under överföring (TLS 1.3). Varje organisations arkiv separeras logiskt och kryptografiskt.',
    },
    {
      code: '04',
      title: 'Rollbaserad behörighet (RBAC)',
      description:
        'Styr exakt vem i ledningsgruppen, styrelsen eller bland medarbetarna som har rätt att söka och läsa i specifika dokumentsamlingar.',
    },
  ];

  return (
    <section className="security-section" id="security-section">
      <div className="section-container">
        <div className="security-editorial-box">
          <div className="security-head-editorial">
            <span className="security-mono-kicker">05 · INTEGRITET &amp; GDPR</span>
            <h2 className="security-serif-title">
              Byggt för bolag som inte kompromissar med <span className="serif-italic">sekretess</span>
            </h2>
            <p className="security-lead-desc">
              Vi förstår att era avtal och protokoll innehåller verksamhetskritiska uppgifter. Därför är
              Träff arkitektoniskt designat med dataskydd som högsta prioritet.
            </p>
          </div>

          <div className="security-quad-grid">
            {securityPillars.map((p) => (
              <div key={p.code} className="security-cell">
                <div className="security-code-label">{p.code}</div>
                <h4 className="security-cell-title">{p.title}</h4>
                <p className="security-cell-desc">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="security-assurance-strip">
            <div className="assurance-tag">
              <span className="assurance-mono">FULLSTÄNDIG GDPR-EFTERLEVNAD</span>
            </div>
            <div className="assurance-tag">
              <span className="assurance-mono">DATABEHANDLARAVTAL (DPA) TECKNAS</span>
            </div>
            <div className="assurance-tag">
              <span className="assurance-mono">SVENSK DRIFT &amp; JURISDIKTION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
