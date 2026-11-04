import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import TraffWordmark from './TraffWordmark';
import './BookingModal.css';

const CONTACT = 'traff.application@gmail.com';

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: '1-25',
    docTypes: ['Avtal'],
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Keep Tab inside the dialog while it is open.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Move focus into the dialog when it opens and back to where it came from
  // when it closes.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleDocType = (type) => {
    setFormData((prev) => {
      const exists = prev.docTypes.includes(type);
      return {
        ...prev,
        docTypes: exists
          ? prev.docTypes.filter((t) => t !== type)
          : [...prev.docTypes, type],
      };
    });
  };

  // There is no backend. Submitting opens the visitor's mail client with the
  // form filled in, the same way as the interest form in the footer, so
  // nothing is reported as sent until the visitor sends it.
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = [
      `Namn: ${formData.name}`,
      `E-post: ${formData.email}`,
      `Företag: ${formData.company}`,
      `Antal medarbetare: ${formData.size}`,
      formData.docTypes.length ? `Handlingar: ${formData.docTypes.join(', ')}` : '',
      formData.notes ? `Meddelande: ${formData.notes}` : '',
    ].filter(Boolean).join('\n');
    window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent('Intresseanmälan till Träff')}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-editorial"
        role="dialog"
        aria-modal="true"
        aria-labelledby={submitted ? 'booking-confirmation-title' : 'booking-modal-title'}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Stäng">
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header-block">
              <div className="modal-brand-lockup">
                <TraffWordmark height={22} />
                <span className="modal-mono-badge">DEMO</span>
              </div>
              <h3 id="booking-modal-title" className="modal-serif-title" aria-label="Anmäl ditt intresse — Boka personlig genomgång">Anmäl ditt intresse</h3>
              <p className="modal-intro-p">
                Träff är under utveckling. Lämna dina uppgifter så hör vi av oss så snart
                Träff är redo att testas på era egna avtal, protokoll och handlingar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-two-col">
                <div className="input-group">
                  <label htmlFor="name">Ditt namn *</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="För- och efternamn"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Arbets-e-post *</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="namn@bolag.se"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-two-col">
                <div className="input-group">
                  <label htmlFor="company">Företag / Organisation *</label>
                  <input
                    id="company"
                    type="text"
                    autoComplete="organization"
                    required
                    placeholder="Exempelbolaget AB"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="size">Antal medarbetare</label>
                  <select
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  >
                    <option value="1-25">1 – 25 anställda</option>
                    <option value="26-100">26 – 100 anställda</option>
                    <option value="101-500">101 – 500 anställda</option>
                    <option value="500+">500+ anställda</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label id="doc-types-label">Vilka handlingar söker ni primärt i?</label>
                <div className="doc-filter-pills" role="group" aria-labelledby="doc-types-label">
                  {['Leverantörsavtal', 'Styrelseprotokoll', 'Personalpolicy', 'Underhållsplaner', 'Årsredovisningar'].map(
                    (type) => {
                      const isSelected = formData.docTypes.includes(type);
                      return (
                        <button
                          type="button"
                          key={type}
                          className={`doc-pill-select ${isSelected ? 'active' : ''}`}
                          aria-pressed={isSelected}
                          onClick={() => handleToggleDocType(type)}
                        >
                          {isSelected && <span className="pill-check-mark" aria-hidden="true">✓</span>}
                          <span>{type}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="notes">Meddelande eller specifika frågor (valfritt)</label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="T.ex. önskemål om tidpunkt eller system ni använder idag..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="modal-submit-handling">
                <span>Skicka förfrågan</span>
                <ArrowRight size={14} />
              </button>

              <div className="modal-privacy-footnote">
                <span className="footnote-mono">
                  ALLA HANDLINGAR OCH KONTAKTUPPGIFTER BEHANDLAS ENLIGT GDPR INOM EU
                </span>
              </div>
            </form>
          </>
        ) : (
          <div className="modal-confirmation-view">
            <div className="confirmation-tag">
              <span className="dot-belagt" />
              <span className="tag-mono">SKICKA MEJLET</span>
            </div>
            <h3 id="booking-confirmation-title" className="confirmation-title">Tack för ditt intresse</h3>
            <p className="confirmation-copy">
              Din e-postklient har öppnats med förfrågan för <strong>{formData.company || 'ert bolag'}</strong> ifylld.
              Skicka mejlet så hör vi av oss på <strong>{formData.email}</strong> när Träff är redo att testas.
              Öppnades inget? Skriv till <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            </p>
            <button type="button" className="modal-submit-handling" onClick={onClose}>
              Stäng fönstret
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
