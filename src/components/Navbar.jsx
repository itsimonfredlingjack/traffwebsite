import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import TraffWordmark from './TraffWordmark';
import { scrollToSection } from '../utils/scrollToSection';
import './Navbar.css';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape closes the mobile menu and hands focus back to its toggle.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      scrollToSection(el);
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
        <nav className="navbar-links" aria-label="Huvudmeny">
          <a
            href="#demo-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('demo-section');
            }}
          >
            Demo
          </a>
          <a
            href="#comparison-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('comparison-section');
            }}
          >
            Skillnaden
          </a>
          <a
            href="#use-cases-section"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('use-cases-section');
            }}
          >
            Principen
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
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button type="button" className="navbar-btn-action" onClick={onOpenBooking}>
            <span>Anmäl intresse</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            ref={toggleRef}
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={mobileMenuOpen}
            aria-controls="navbar-mobile-drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="navbar-mobile-drawer" id="navbar-mobile-drawer" aria-label="Mobilmeny">
          <a
            href="#demo-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('demo-section');
            }}
          >
            Demo
          </a>
          <a
            href="#comparison-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('comparison-section');
            }}
          >
            Skillnaden
          </a>
          <a
            href="#use-cases-section"
            className="navbar-mobile-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('use-cases-section');
            }}
          >
            Principen
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
              type="button"
              className="navbar-btn-action full-width"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
            >
              <span>Anmäl intresse</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
