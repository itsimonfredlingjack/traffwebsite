import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import TraffMark from './TraffMark';
import './Navbar.css';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Lockup §05: ◉ Träff */}
        <a
          href="#"
          className="navbar-brand-lockup"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <TraffMark size={20} variant="brand" />
          <span className="navbar-brand-name">Träff</span>
          <span className="navbar-mono-label">DOKUMENT-AI</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <button className="navbar-link" onClick={() => scrollTo('demo-section')}>
            Demonstration
          </button>
          <button className="navbar-link" onClick={() => scrollTo('comparison-section')}>
            Principen
          </button>
          <button className="navbar-link" onClick={() => scrollTo('use-cases-section')}>
            Tillämpning
          </button>
          <button className="navbar-link" onClick={() => scrollTo('features-section')}>
            Arkitektur &amp; trygghet
          </button>
          <button className="navbar-link" onClick={() => scrollTo('faq-section')}>
            Frågor &amp; svar
          </button>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="navbar-btn-demo" onClick={() => scrollTo('demo-section')}>
            Testa sökningen
          </button>
          <button className="navbar-btn-action" onClick={onOpenBooking}>
            <span>Boka genomgång</span>
            <ArrowRight size={14} />
          </button>
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Öppna meny"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <button className="navbar-mobile-link" onClick={() => scrollTo('demo-section')}>
            Demonstration
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('comparison-section')}>
            Principen
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('use-cases-section')}>
            Tillämpning
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('features-section')}>
            Arkitektur &amp; trygghet
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('faq-section')}>
            Frågor &amp; svar
          </button>
          <div className="navbar-mobile-cta">
            <button
              className="navbar-btn-action full-width"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
            >
              <span>Boka personlig genomgång</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
