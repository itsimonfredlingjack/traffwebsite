import React from 'react';
import { ArrowRight } from 'lucide-react';
import TraffMark from './TraffMark';
import './Footer.css';

export default function Footer({ onOpenBooking }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer-editorial-root">
      {/* Paper Contrast Banner (§06 & §07: #E8E5DE Papper) */}
      <div className="footer-paper-banner-wrap">
        <div className="footer-paper-card">
          <div className="paper-mono-kicker">05 · NÄSTA STEG</div>
          <h2 className="paper-serif-headline">
            Redo att ge styrelsen och ledningen svar de kan lita på?
          </h2>
          <p className="paper-body-lead">
            Boka en 15-minuters genomgång så visar vi hur Träff ringer in meningen
            i era egna avtal, protokoll och rapporter — direkt på sidan.
          </p>
          <div className="paper-action-buttons">
            <button className="paper-btn-primary" onClick={onOpenBooking}>
              <span>Boka personlig genomgång</span>
              <ArrowRight size={14} />
            </button>
            <button className="paper-btn-ghost" onClick={() => scrollTo('demo-section')}>
              <span>Testa sökningen igen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dark Footer */}
      <div className="footer-main-dark">
        <div className="footer-columns-wrap">
          <div className="footer-brand-side">
            <div className="footer-brand-lockup">
              <TraffMark size={20} variant="brand" />
              <span className="footer-brand-title">Träff</span>
            </div>
            <p className="footer-brand-sub">
              Svensk AI för dokument och information. Fråga dina dokument, se svaren på sidan.
            </p>
            <div className="footer-eu-mono-tag">
              <span>EU-DATALAGRING · INGEN MODELLTRÄNING</span>
            </div>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-nav-col">
              <span className="nav-col-mono-title">PRODUKT</span>
              <button className="footer-link-btn" onClick={() => scrollTo('demo-section')}>
                Demonstration
              </button>
              <button className="footer-link-btn" onClick={() => scrollTo('comparison-section')}>
                Principen
              </button>
              <button className="footer-link-btn" onClick={() => scrollTo('use-cases-section')}>
                Tillämpning
              </button>
              <button className="footer-link-btn" onClick={() => scrollTo('features-section')}>
                Arkitektur &amp; trygghet
              </button>
            </div>

            <div className="footer-nav-col">
              <span className="nav-col-mono-title">SÄKERHET</span>
              <button className="footer-link-btn" onClick={() => scrollTo('features-section')}>
                Integritet &amp; GDPR
              </button>
              <button className="footer-link-btn" onClick={() => scrollTo('faq-section')}>
                Frågor &amp; svar
              </button>
              <span className="nav-static-item">Databehandlaravtal (DPA)</span>
              <span className="nav-static-item">Noll hallucinationer</span>
            </div>

            <div className="footer-nav-col">
              <span className="nav-col-mono-title">KONTAKT</span>
              <button className="footer-link-btn" onClick={onOpenBooking}>
                Boka genomgång
              </button>
              <a href="mailto:kontakt@traff.se" className="footer-link-btn">
                kontakt@traff.se
              </a>
              <span className="nav-static-item">Stockholm, Sverige</span>
            </div>
          </div>
        </div>

        <div className="footer-sub-bar">
          <span className="copyright-mono">© 2026 TRÄFF · ALLA RÄTTIGHETER FÖRBEHÅLLNA</span>
          <span className="motto-mono">ORDAGRANT VERIFIERAT MOT KÄLLTEXT</span>
        </div>
      </div>
    </footer>
  );
}
