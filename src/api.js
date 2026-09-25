/**
 * api.js — paketets egna, mockade backend för Dokument.
 *
 * Riktiga brfv2-mockup/src/api.js anropar Python-backend under /api/…. Här
 * kommer listan ur `src/fixtures/documents.json` och PDF:erna ur `public/pdf/`.
 * Samma signaturer som originalet för det den här skärmen behöver:
 *   listDocuments(brfId) · pdfUrl(brfId, documentId)
 */
import documents from './fixtures/documents.json';

const vanta = (ms) => new Promise((r) => setTimeout(r, ms));

export const api = {
  listDocuments: async () => { await vanta(200); return documents; },
  pdfUrl: (_brfId, documentId) => `${import.meta.env.BASE_URL}pdf/${documentId}.pdf`,
};
