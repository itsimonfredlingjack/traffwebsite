/**
 * Validate the prerendered JSON-LD against schema-dts and check that the
 * FAQPage text is the same text the page renders.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const html = fs.readFileSync('dist/index.html', 'utf8');
const match = html.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n    <\/script>/);
if (!match) {
  console.error('No JSON-LD script in dist/index.html');
  process.exit(1);
}
const data = JSON.parse(match[1]);

const questions = [...html.matchAll(/<span class="faq-question-title">([^<]*)<\/span>/g)].map((m) => m[1]);
const answers = [...html.matchAll(/<p class="faq-answer-copy">([^<]*)<\/p>/g)].map((m) => m[1]);
const decode = (s) => s
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'");

const faq = data['@graph'].find((node) => node['@type'] === 'FAQPage');
const pairs = faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]);
const visible = questions.map((q, i) => [decode(q), decode(answers[i])]);
if (JSON.stringify(pairs) !== JSON.stringify(visible)) {
  console.error('FAQPage text differs from the rendered FAQ');
  console.error(JSON.stringify({ pairs, visible }, null, 2));
  process.exit(1);
}

const tsPath = path.resolve('scripts/.jsonld-check.ts');
const ts = `import type { FAQPage, Organization, SoftwareApplication } from 'schema-dts';

const graph = ${JSON.stringify(data['@graph'], null, 2)} as const;

const organization: Organization = graph[0];
const software: SoftwareApplication = graph[1];
const faq: FAQPage = graph[2];

void organization;
void software;
void faq;
`;
fs.writeFileSync(tsPath, ts);
try {
  execFileSync('npx', ['tsc', '--strict', '--noEmit', '--module', 'nodenext', '--moduleResolution', 'nodenext', '--target', 'es2022', tsPath], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} finally {
  fs.rmSync(tsPath, { force: true });
}

console.log(`JSON-LD ok: ${data['@graph'].map((n) => n['@type']).join(', ')}`);
console.log(`FAQ pairs match rendered text (${pairs.length})`);
