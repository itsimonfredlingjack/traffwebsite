import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import TraffWordmark from './TraffWordmark';
import { scrollToSection } from '../utils/scrollToSection';
import './Footer.css';

const CONTACT = 'traff.application@gmail.com';

export default function Footer() {
  const [sent, setSent] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) scrollToSection(el);
    if (window.location.hash !== `#${id}`) {
      history.pushState(null, '', `#${id}`);
    }
  };

  const submitInterest = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const question = String(data.get('question') || '').trim();
    const body = [`Namn: ${name}`, `E-post: ${email}`, question ? `Fråga: ${question}` : ''].filter(Boolean).join('\n');
    window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent('Intresseanmälan till Träff')}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <footer className="footer-editorial-root">
      <div className="interest-wrap" id="anmal">
        <div className="interest-card">
          <div className="interest-copy">
            <span className="section-mono-kicker">05 · Anmäl intresse</span>
            <h2 className="interest-title">Pröva Träff på dina egna dokument.</h2>
            <p className="interest-lead">Lämna din e-post så hör vi av oss.</p>
            <div className="interest-mail">
              <span className="interest-mail-label">Eller mejla</span>
              <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </div>
          </div>

          {sent ? (
            <p className="interest-thanks" role="status">Mejlet är öppnat. Skicka det så hör vi av oss.</p>
          ) : (
            <form className="interest-form" onSubmit={submitInterest}>
              <label>
                <span>Namn</span>
                <input name="name" type="text" required autoComplete="name" placeholder="För- och efternamn" />
              </label>
              <label>
                <span>E-post</span>
                <input name="email" type="email" required autoComplete="email" placeholder="namn@exempel.se" />
              </label>
              <label>
                <span>Vad vill du fråga dina dokument om? (valfritt)</span>
                <textarea name="question" rows={3} placeholder="Till exempel avtal, protokoll eller policyer" />
              </label>
              <button type="submit" className="interest-submit">
                Anmäl intresse
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <a
          href="#demo-section"
          className="footer-wordmark"
          aria-label="Träff, startsida"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <TraffWordmark height={22} />
        </a>
        <nav className="footer-nav-col" aria-label="Sidfot">
          <a
            href="#demo-section"
            className="footer-link-btn"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('demo-section');
            }}
          >
            Demo
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
          <a href={`mailto:${CONTACT}`} className="footer-link-btn">{CONTACT}</a>
        </nav>
        <span className="footer-copy">© 2026 Träff</span>
      </div>
    </footer>
  );
}
