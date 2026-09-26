import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/faqs';
import './FaqSection.css';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = FAQS;

  return (
    <section className="faq-section" id="faq-section" role="region" aria-labelledby="faq-heading">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">04 · FRÅGOR OCH SVAR</span>
          <h2 className="section-title-serif" id="faq-heading">
            Vanliga <span className="serif-italic">funderingar</span>
          </h2>
          <p className="section-lead-text">
            Hittar du inte svaret på din fråga här? Boka en genomgång så visar vi hur det fungerar i praktiken på era egna handlingar.
          </p>
        </div>

        <div className="faq-list-editorial">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item-editorial ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <button
                  className="faq-question-editorial-btn"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIndex(isOpen ? null : index);
                  }}
                >
                  <span className="faq-question-title">{faq.q}</span>
                  <span className={`faq-arrow-icon ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={17} />
                  </span>
                </button>
                <div className="faq-answer-block" id={`faq-answer-${index}`} hidden={!isOpen}>
                  <p className="faq-answer-copy">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
