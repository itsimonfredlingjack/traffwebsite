import React from 'react';
import { ArrowRight } from 'lucide-react';
import TraffWordmark from './TraffWordmark';
import './Footer.css';

export default function Footer({ onOpenBooking }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    if (window.location.hash !== `#${id}`) {
      history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <footer className="footer-editorial-root">
      {/* Paper Contrast Banner (§06 & §07: #E8E5DE Papper) */}
      <div className="footer-paper-banner-wrap">
        <div className="footer-paper-card">
          <div className="paper-mono-kicker">05 · Nästa steg</div>
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
            <a
              href="#demo-section"
              className="paper-btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('demo-section');
              }}
            >
              <span>Testa sökningen igen</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Dark Footer */}
      <div className="footer-main-dark">
        <div className="footer-columns-wrap">
          <div className="footer-brand-side">
            <div className="footer-brand-lockup">
              <TraffWordmark height={26} />
            </div>
            <p className="footer-brand-sub">
              Svensk AI för dokument och information. Fråga dina dokument, se svaren på sidan.
            </p>
            <div className="footer-eu-mono-tag">
              <span>EU-datalagring · Ingen modellträning</span>
            </div>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-nav-col">
              <span className="nav-col-mono-title">Produkt</span>
              <a
                href="#demo-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('demo-section');
                }}
              >
                Demonstration
              </a>
              <a
                href="#comparison-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('comparison-section');
                }}
              >
                Principen
              </a>
              <a
                href="#use-cases-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('use-cases-section');
                }}
              >
                Tillämpning
              </a>
              <a
                href="#features-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('features-section');
                }}
              >
                Arkitektur &amp; trygghet
              </a>
            </div>

            <div className="footer-nav-col">
              <span className="nav-col-mono-title">Säkerhet</span>
              <a
                href="#features-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('features-section');
                }}
              >
                Integritet &amp; GDPR
              </a>
              <a
                href="#faq-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('faq-section');
                }}
              >
                Frågor &amp; svar
              </a>
              <span className="nav-static-item">Databehandlaravtal (DPA)</span>
              <span className="nav-static-item">Noll hallucinationer</span>
            </div>

            <div className="footer-nav-col">
              <span className="nav-col-mono-title">Kontakt</span>
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
          <span className="copyright-mono">© 2026 Träff · Alla rättigheter förbehållna</span>
          <span className="motto-mono">Ordagrant verifierat mot källtext</span>
        </div>
      </div>
    </footer>
  );
}
