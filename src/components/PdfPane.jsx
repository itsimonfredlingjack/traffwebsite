import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { hamtaPdf } from '../pdfCache';
import PenStroke from './PenStroke';
import TraffMark from './TraffMark';

/**
 * Renders a real PDF page inline (no modal) via pdf.js, with optional
 * highlight overlays. `rects` are PDF points, top-left origin
 * (PyMuPDF/backend convention); only shown while `page === highlightPage`
 * so navigating away from the cited page naturally clears the highlight.
 */
/**
 * `fitWidth`: draw the page at the CSS width given (the column it stands in)
 * instead of at 1pt = 1px. Overlays follow the same viewport, so the marks
 * land on the lines at any size.
 */
function PdfPane({
  url,
  page,
  onNumPages,
  rects = [],
  citationIds = [],
  highlightPage = null,
  approximate = false,
  onRendered = null,
  fitWidth = null,
  active = false,
  penPhase = 'wait',
  onPenDone = null,
}) {
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);
  const renderTaskRef = useRef(null);
  // Fires after a page has actually painted (the moment a caller could scroll
  // to an overlay). Kept in a ref so an inline callback never re-triggers
  // renderPage through the dependency list.
  const onRenderedRef = useRef(onRendered);
  useEffect(() => { onRenderedRef.current = onRendered; });
  const [numPages, setNumPages] = useState(0);
  const [overlays, setOverlays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setError(null);
      setLoading(false);
      return undefined;
    }
    if (!active) return undefined;
    let cancelled = false;
    setError(null);
    setLoading(true);
    setNumPages(0);
    // The document stays in pdfCache for the session. Destroying it here
    // would break the next scenario that asks for the same file.
    hamtaPdf(url)
      .then((pdf) => {
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        onNumPages?.(pdf.numPages);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e?.message || e));
        setLoading(false);
      });
    return () => {
      cancelled = true;
      pdfRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, active]);

  const renderPage = useCallback(async () => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;
    const clampedPage = Math.min(Math.max(1, page), pdf.numPages);
    setLoading(true);
    setOverlays([]); // never let a previous page's highlights linger
    let task = null;
    try {
      const pdfPage = await pdf.getPage(clampedPage);
      const base = pdfPage.getViewport({ scale: 1 });
      const scale = fitWidth ? fitWidth / base.width : 1;
      const cssViewport = pdfPage.getViewport({ scale });
      const dpr = window.devicePixelRatio || 1;
      const renderViewport = pdfPage.getViewport({ scale: scale * dpr });

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${cssViewport.width}px`;
      canvas.style.height = `${cssViewport.height}px`;
      const ctx = canvas.getContext('2d');

      renderTaskRef.current?.cancel?.();
      task = pdfPage.render({ canvasContext: ctx, viewport: renderViewport });
      renderTaskRef.current = task;
      await task.promise;

      const showHighlights = highlightPage == null || highlightPage === clampedPage;
      if (showHighlights && rects.length) {
        const pageHeightPts = pdfPage.view[3] - pdfPage.view[1];
        const [a, b, c, d, e, f] = cssViewport.transform;
        const tx = (x, y) => [a * x + c * y + e, b * x + d * y + f];
        setOverlays(rects.map(([x0, y0, x1, y1], i) => {
          // top-left-origin points → PDF user space (y-up) → viewport CSS px
          const p1 = tx(x0, pageHeightPts - y1);
          const p2 = tx(x1, pageHeightPts - y0);
          const width = Math.abs(p2[0] - p1[0]);
          const height = Math.abs(p2[1] - p1[1]);
          return {
            left: Math.min(p1[0], p2[0]),
            top: Math.min(p1[1], p2[1]),
            width,
            height,
            citationId: citationIds[i] ?? 0,
            lead: i === 0 || citationIds[i] !== citationIds[i - 1],
            tilt: width < height * 7 ? -6 : -1.25,
            rise: width * Math.tan(((width < height * 7 ? 6 : 1.25) * Math.PI) / 180),
          };
        }));
      }
      setError(null);
      onRenderedRef.current?.();
    } catch (e) {
      if (e?.name !== 'RenderingCancelledException') setError(String(e?.message || e));
    } finally {
      if (task === null || renderTaskRef.current === task) setLoading(false);
    }
  }, [page, rects, citationIds, highlightPage, fitWidth]);

  useEffect(() => {
    if (numPages > 0) renderPage();
  }, [numPages, renderPage]);

  if (!url) return null;

  if (error) {
    return (
      <div className="pdf-pane-error" role="alert">
        <TraffMark size={20} state="fel" decorative />
        <p className="pdf-pane-error-title">Dokumentet kunde inte visas.</p>
        <p className="pdf-pane-error-detail">Felet ligger hos Träff, inte i dina dokument.</p>
      </div>
    );
  }

  // A4 page box. Reserving it up front keeps the column from growing
  // when pdf.js paints, which was a layout shift under the demo.
  const reservedStyle = fitWidth
    ? { width: `${fitWidth}px`, height: `${fitWidth * (842 / 595)}px` }
    : undefined;

  return (
    <div className="pdf-page-canvas-wrap">
      <canvas ref={canvasRef} style={reservedStyle} />
      {overlays.map((b, i) => (
        <div
          key={`${b.citationId}-${i}`}
          id={b.lead ? `pdf-highlight-${b.citationId}` : undefined}
          className={`pdf-highlight${approximate ? ' approximate' : ''}`}
          data-testid="citation-highlight"
          data-highlight-index={i}
          style={{ left: b.left, top: b.top, width: b.width, height: b.height }}
        >
          <PenStroke
            tilt={b.tilt}
            rise={b.rise}
            boxHeight={b.height}
            phase={penPhase}
            delay={i * 110}
            onDone={i === overlays.length - 1 ? onPenDone : undefined}
          />
        </div>
      ))}
      {loading && (
        <div className="pdf-pane-loading"><Loader2 size={24} className="spin" /></div>
      )}
    </div>
  );
}

export default PdfPane;
