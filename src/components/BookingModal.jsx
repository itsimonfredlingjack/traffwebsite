import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Check } from 'lucide-react';
import TraffWordmark from './TraffWordmark';
import './BookingModal.css';

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: '1-25',
    docTypes: ['Avtal'],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-editorial" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Stäng">
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header-block">
              <div className="modal-brand-lockup">
                <TraffWordmark height={22} />
                <span className="modal-mono-badge">DEMO</span>
              </div>
              <h3 className="modal-serif-title" aria-label="Anmäl ditt intresse — Boka personlig genomgång">Anmäl ditt intresse</h3>
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
                <label>Vilka handlingar söker ni primärt i?</label>
                <div className="doc-filter-pills">
                  {['Leverantörsavtal', 'Styrelseprotokoll', 'Personalpolicy', 'Underhållsplaner', 'Årsredovisningar'].map(
                    (type) => {
                      const isSelected = formData.docTypes.includes(type);
                      return (
                        <button
                          type="button"
                          key={type}
                          className={`doc-pill-select ${isSelected ? 'active' : ''}`}
                          onClick={() => handleToggleDocType(type)}
                        >
                          {isSelected && <span className="pill-check-mark">✓</span>}
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

              <button type="submit" className="modal-submit-handling" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Skickar...</span>
                  </>
                ) : (
                  <>
                    <span>Skicka förfrågan</span>
                    <ArrowRight size={14} />
                  </>
                )}
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
              <span className="tag-mono">FÖRFRÅGAN MOTTAGEN</span>
            </div>
            <h3 className="confirmation-title">Tack för ditt intresse</h3>
            <p className="confirmation-copy">
              Tack för visat intresse! Vi har tagit emot dina uppgifter för <strong>{formData.company || 'ert bolag'}</strong> och
              hör av oss på <strong>{formData.email}</strong> när Träff är redo att testas.
            </p>
            <button className="modal-submit-handling" onClick={onClose}>
              Stäng fönstret
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
