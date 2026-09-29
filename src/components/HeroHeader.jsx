import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import TraffMark from './TraffMark';
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
          <strong>Träff</strong> är en AI-chatt som inte bara svarar. Den slår upp ditt riktiga dokument,
          bläddrar fram rätt sida och ringer in meningen som svaret bygger på.
          Avtal, protokoll, policy, rapporter. Du läser källan själv i samma ögonblick.
        </p>

        {/* Action Buttons (Taktilt Djupbläck #111317) */}
        <div className="hero-actions-row">
          <a
            href="#demo-section"
            className="hero-btn-action"
            onClick={(e) => {
              e.preventDefault();
              onScrollToDemo();
            }}
          >
            <span>Testa den interaktiva sökningen</span>
            <ArrowDown size={15} />
          </a>
          <button className="hero-btn-secondary" onClick={onOpenBooking}>
            <span>Anmäl intresse</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* The 4 States in Mono Pills */}
        <div className="hero-states-strip">
          <div className="state-indicator-pill vila">
            <TraffMark size={14} state="vila" />
            <span className="state-label">VILA</span>
          </div>
          <span className="state-arrow" aria-hidden="true">→</span>
          <div className="state-indicator-pill soker">
            <TraffMark size={14} state="soker" />
            <span className="state-label">SÖKER</span>
          </div>
          <span className="state-arrow" aria-hidden="true">→</span>
          <div className="state-indicator-pill belagt">
            <TraffMark size={14} state="belagt" />
            <span className="state-label">BELAGT</span>
          </div>
          <span className="state-divider" aria-hidden="true">/</span>
          <div className="state-indicator-pill ej-belagt">
            <TraffMark size={14} state="ejbelagt" />
            <span className="state-label">EJ BELAGT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
