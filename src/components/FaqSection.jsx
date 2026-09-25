import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FaqSection.css';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Hur kan jag lita på att svaren inte är fabricerade (hallucinerade)?',
      a: 'Till skillnad från generella AI-chattar som gissar fritt, tvingas Träff att binda varje påstående till en faktisk mening i ert arkiv. Om det inte finns stöd i texten svarar Träff att källan saknas (vägran är en funktion). Dessutom ser du alltid originaldokumentet bredvid chatten med den exakta meningen inringad med remsgul penna så att du kan läsa och godkänna det själv.',
    },
    {
      q: 'Vilka dokumentformat och typer stöds?',
      a: 'Träff hanterar PDF-filer av alla slag – både digitalt skapade avtal och inskannade handlingar med OCR. Systemet indexerar leverantörskontrakt, styrelseprotokoll, årsredovisningar, tekniska underhållsplaner, personalhandböcker och interna policys.',
    },
    {
      q: 'Hur lång tid tar det att komma igång med Träff?',
      a: 'Eftersom Träff är molnbaserat krävs inga komplexa IT-installationer. Ni kan ladda upp era första dokument och börja ställa frågor inom några minuter. För större organisationer erbjuder vi även direktkoppling mot befintliga dokumenthanteringssystem och molnlagringar.',
    },
    {
      q: 'Hur fungerar en genomgång med våra egna handlingar?',
      a: 'Under en 15-minuters genomgång via videosamtal laddar vi upp ett eller ett par av era egna avtal eller protokoll (under sekretess/NDA). Vi ställer de frågor ni brukar behöva leta efter i vardagen, så att ni med egna ögon får se hur Träff hittar rätt sida och ringar in svaret.',
    },
  ];

  return (
    <section className="faq-section" id="faq-section">
      <div className="section-container">
        <div className="section-head-editorial">
          <span className="section-mono-kicker">04 · FRÅGOR OCH SVAR</span>
          <h2 className="section-title-serif">
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
                {isOpen && (
                  <div className="faq-answer-block">
                    <p className="faq-answer-copy">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
