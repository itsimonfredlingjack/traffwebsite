import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/**
 * One pdf.js, loaded when the first page asks for it, and one parsed document
 * per URL for the life of the session — the page strip, the page itself and
 * the reader all draw the same file, and none of them should parse it twice.
 * Lazy, so modules that draw pages stay importable where no canvas exists
 * (the component tests) and a screen that never shows a page never pays.
 */
let laddning = null;
export function pdfjs() {
  if (!laddning) {
    laddning = import('pdfjs-dist').then((m) => {
      m.GlobalWorkerOptions.workerSrc = workerUrl;
      return m;
    });
  }
  return laddning;
}

const dokument = new Map();
export function hamtaPdf(url) {
  if (!dokument.has(url)) {
    const p = pdfjs()
      .then((lib) => lib.getDocument({ url: new URL(url, window.location.href).href }).promise)
      .catch((e) => { dokument.delete(url); throw e; });
    dokument.set(url, p);
  }
  return dokument.get(url);
}
