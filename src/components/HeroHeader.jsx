import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import PenStroke from './PenStroke';
import './HeroHeader.css';

export default function HeroHeader({ onOpenBooking, onScrollToDemo }) {
  return (
    <section className="hero-section">
      {/* Studio ambient glow */}
      <div className="hero-studio-glow" aria-hidden="true" />

      <div className="hero-container">
        {/* Category tag in JetBrains Mono */}
        <div className="hero-mono-kicker">
          <span>AI med direkt källhänvisning</span>
        </div>

        {/* Main Display Headline in Instrument Serif */}
        <h1 className="hero-title-serif">
          {'Fråga dina dokument. '}
          <br />
          <span className="hero-title-italic hero-pen-target">
            Se svaren på sidan.
            <span className="hero-pen-layer" aria-hidden="true">
              <PenStroke variant="hero" />
            </span>
          </span>
        </h1>

        {/* Core Assertion & Voice */}
        <div className="hero-assertion">
          <p className="hero-assertion-lead">
            När svaret finns i dokumenten visar Träff exakt var.
          </p>
          <p className="hero-assertion-refusal">
            Finns det inte där säger Träff det.
          </p>
        </div>

        {/* Descriptive Body Text in Instrument Sans */}
        <p className="hero-body-text">
          <strong>Träff</strong> är en AI-chatt för dina avtal, protokoll och policys.
          Den slår upp originalet och ringer in meningen som svaret bygger på.
        </p>

        {/* Action Buttons (Taktilt Djupbläck #111317) */}
        <div className="hero-actions-row">
          <button className="hero-btn-action" onClick={onOpenBooking}>
            <span>Anmäl intresse</span>
            <ArrowRight size={16} />
          </button>
          <a
            href="#demo-section"
            className="hero-btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              onScrollToDemo();
            }}
          >
            <span>Prova demon</span>
            <ArrowDown size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
