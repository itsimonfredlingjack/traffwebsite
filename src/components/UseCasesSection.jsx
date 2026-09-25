import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './UseCasesSection.css';

export default function UseCasesSection({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState(0);

  const useCases = [
    {
      id: 'management',
      label: 'Företagsledning & VD',
      title: 'Fatta snabba beslut baserat på faktiska avtal och styrelseprotokoll',
      description:
        'Som VD eller ledare behöver du direkt överblick över villkor, avtalade priser och strategiska beslut utan att spendera timmar i arkivet eller vänta på utredningar.',
      sampleQuestions: [
        'Vad är uppsägningstiden och villkoren i vårt IT-avtal?',
        'Vilken budgetram beslutades för investeringarna under Q2?',
        'Vilka ansvarsbegränsningar har vi godkänt i kundkontraktet?',
      ],
      result: 'Full insyn på sekunder – inga gissningar.',
    },
    {
      id: 'board-legal',
      label: 'Styrelse & Juridik',
      title: 'Eliminera feltolkningar och säkerställ protokollbundenhet',
      description:
        'Styrelsearbete kräver noggrannhet. Träff bevisar att protokollförda beslut och stadgeparagrafer följs till punkt och pricka, med omedelbar hänvisning till källan.',
      sampleQuestions: [
        'Vad beslutades enhälligt under sammanträdet den 18 februari?',
        'Vad stadgar reglerna kring beslutförhet och jäv?',
        'Vilka avtal har delegerats till VD för slutlig underskrift?',
      ],
      result: '100% juridisk spårbarhet direkt till sidan.',
    },
    {
      id: 'hr-ops',
      label: 'HR & Organisation',
      title: 'Ge organisationen raka svar direkt ur personalhandboken',
      description:
        'Slipp svara på samma frågor om friskvård, föräldraledighet och hemarbete om och om igen. Träff visar medarbetaren rätt stycke och rad i policyn.',
      sampleQuestions: [
        'Hur många dagar i veckan tillåter hemarbetspolicyn?',
        'Hur mycket är friskvårdsbidraget och när ska kvitton lämnas?',
        'Vilka villkor gäller för övertidsersättning och flextid?',
      ],
      result: 'Avlastar HR och skapar enhetlig tillämpning i hela bolaget.',
    },
    {
      id: 'facility-property',
      label: 'Fastighet & Förvaltning',
      title: 'Håll koll på underhållsplaner, entreprenader och garantier',
      description:
        'Förvaltare och fastighetsägare hanterar hundratals entreprenad- och serviceavtal. Träff lokaliserar inställelsetider, garantier och kostnader på ett ögonblick.',
      sampleQuestions: [
        'Vilka åtgärder och kostnader är budgeterade i underhållsplanen?',
        'Vad är leverantörens inställelsetid vid akut driftstopp?',
        'Vem ansvarar för snöröjning och halkbekämpning på parkeringen?',
      ],
      result: 'Omedelbar kontroll vid akuta driftstopp och upphandlingar.',
    },
  ];

  const current = useCases[activeTab];

  return (
    <section className="usecases-section" id="use-cases-section">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">02 · TILLÄMPNING</span>
          <h2 className="section-title-serif">
            Vem har störst nytta av <span className="serif-italic">Träff</span>?
          </h2>
          <p className="section-lead-text">
            Oavsett roll är målet detsamma: att få ett direkt och pålitligt svar med källan synlig på skärmen.
          </p>
        </div>

        {/* Tab row */}
        <div className="usecases-tab-row">
          {useCases.map((uc, index) => (
            <button
              key={uc.id}
              className={`usecase-pill-btn ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              <span>{uc.label}</span>
            </button>
          ))}
        </div>

        {/* Active Role Content Card */}
        <div className="usecase-display-card">
          <div className="usecase-display-left">
            <span className="usecase-mono-badge">{current.label.toUpperCase()}</span>
            <h3 className="usecase-serif-headline">{current.title}</h3>
            <p className="usecase-body-lead">{current.description}</p>
            
            <div className="usecase-result-strip">
              <span className="result-mono">RESULTAT:</span>
              <span className="result-text">{current.result}</span>
            </div>

            <button className="usecase-btn-handling" onClick={onOpenBooking}>
              <span>Boka genomgång för {current.label}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="usecase-display-right">
            <div className="usecase-quotes-header">TYPISKA FRÅGOR UR HÖGEN</div>
            <div className="usecase-quotes-list">
              {current.sampleQuestions.map((q, idx) => (
                <div key={idx} className="usecase-quote-box">
                  <span className="quote-serif">”{q}”</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
