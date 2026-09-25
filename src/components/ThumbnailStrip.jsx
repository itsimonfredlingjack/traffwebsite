import React from 'react';
import './ThumbnailStrip.css';

export default function ThumbnailStrip({
  totalPages = 1,
  currentPage = 1,
  onSelectPage,
  pagesWithHits = [],
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="thumbnail-strip-bar" role="region" aria-label="Sidminiatyrer">
      <div className="thumbnail-strip-scroll">
        {pages.map((p) => {
          const isSelected = p === currentPage;
          const hasHit = pagesWithHits.includes(p);

          return (
            <button
              key={p}
              type="button"
              className={`thumbnail-mini-card ${isSelected ? 'selected' : ''} ${hasHit ? 'has-hit' : ''}`}
              onClick={() => onSelectPage(p)}
              aria-label={`Gå till sida ${p}${hasHit ? ' (innehåller källbelägg)' : ''}`}
              aria-current={isSelected ? 'page' : undefined}
            >
              {/* Miniature paper sheet */}
              <div className="mini-paper-face">
                {/* Simulated text lines */}
                <div className="mini-text-line short" />
                <div className="mini-text-line" />
                <div className="mini-text-line" />
                
                {/* Yellow highlight marker if this page contains a hit */}
                {hasHit && (
                  <div className="mini-hit-highlight" title="Källträff på denna sida" />
                )}

                <div className="mini-text-line short" />
                <div className="mini-text-line" />
              </div>

              {/* Page number */}
              <span className="mini-page-num">{p}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
