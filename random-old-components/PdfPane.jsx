import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Loader2, AlertCircle } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

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
function PdfPane({ url, page, onNumPages, rects = [], highlightPage = null, approximate = false, onRendered = null, fitWidth = null }) {
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
    let cancelled = false;
    setError(null);
    setLoading(true);
    setNumPages(0);
    const loadingTask = pdfjsLib.getDocument({ url: new URL(url, window.location.href).href });
    loadingTask.promise
      .then((pdf) => {
        if (cancelled) {
          pdf.destroy().catch(() => {});
          return;
        }
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
      loadingTask.destroy().catch(() => {});
      pdfRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

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
        setOverlays(rects.map(([x0, y0, x1, y1]) => {
          // top-left-origin points → PDF user space (y-up) → viewport CSS px
          const p1 = tx(x0, pageHeightPts - y1);
          const p2 = tx(x1, pageHeightPts - y0);
          return {
            left: Math.min(p1[0], p2[0]),
            top: Math.min(p1[1], p2[1]),
            width: Math.abs(p2[0] - p1[0]),
            height: Math.abs(p2[1] - p1[1]),
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
  }, [page, rects, highlightPage, fitWidth]);

  useEffect(() => {
    if (numPages > 0) renderPage();
  }, [numPages, renderPage]);

  if (!url) return null;

  if (error) {
    return (
      <div className="pdf-pane-error">
        <AlertCircle size={40} color="#c33" />
        <div>Dokumentet kunde inte visas.</div>
        <div className="pdf-pane-error-detail">{error}</div>
      </div>
    );
  }

  return (
    <div className="pdf-page-canvas-wrap">
      <canvas ref={canvasRef} />
      {overlays.map((b, i) => (
        <div
          key={i}
          className={approximate ? 'pdf-highlight approximate' : 'pdf-highlight'}
          data-testid="citation-highlight"
          aria-label="Markerat källcitat"
          style={{ left: b.left, top: b.top, width: b.width, height: b.height, '--i': i }}
        />
      ))}
      {loading && (
        <div className="pdf-pane-loading"><Loader2 size={24} className="spin" /></div>
      )}
    </div>
  );
}

export default PdfPane;
