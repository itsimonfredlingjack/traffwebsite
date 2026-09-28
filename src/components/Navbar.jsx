import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import TraffWordmark from './TraffWordmark';
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
    if (window.location.hash !== `#${id}`) {
      history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Lockup §05: ◉ Träff */}
        <a
          href="/"
          className="navbar-brand-lockup"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <TraffWordmark height={25} />
          <span className="navbar-mono-label"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <a
            href="#demo-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('demo-section');
            }}
          >
            Demonstration
          </a>
          <a
            href="#comparison-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('comparison-section');
            }}
          >
            Principen
          </a>
          <a
            href="#use-cases-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('use-cases-section');
            }}
          >
            Tillämpning
          </a>
          <a
            href="#features-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('features-section');
            }}
          >
            Arkitektur &amp; trygghet
          </a>
          <a
            href="#faq-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('faq-section');
            }}
          >
            Frågor &amp; svar
          </a>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <a
            href="#demo-section"
            className="navbar-btn-demo"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('demo-section');
            }}
          >
            Se demon
          </a>
          <button className="navbar-btn-action" onClick={onOpenBooking}>
            <span>Anmäl intresse</span>
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
          <a
            href="#demo-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('demo-section');
            }}
          >
            Demonstration
          </a>
          <a
            href="#comparison-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('comparison-section');
            }}
          >
            Principen
          </a>
          <a
            href="#use-cases-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('use-cases-section');
            }}
          >
            Tillämpning
          </a>
          <a
            href="#features-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('features-section');
            }}
          >
            Arkitektur &amp; trygghet
          </a>
          <a
            href="#faq-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('faq-section');
            }}
          >
            Frågor &amp; svar
          </a>
          <div className="navbar-mobile-cta">
            <button
              className="navbar-btn-action full-width"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
            >
              <span>Anmäl intresse</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
