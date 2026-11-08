#!/usr/bin/env node
// Legt eine Version des Datensatzes bei Zenodo ab und veröffentlicht sie (DOI).
// Aufruf: ZENODO_TOKEN=… node scripts/zenodo-veroeffentlichen.mjs v2.2.0 [--concept <id>]
// Der Token kommt aus Infisical (KoeHUB/prod, ZENODO_TOKEN), nie aus einer Datei im Repo.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://zenodo.org/api';
const tok = process.env.ZENODO_TOKEN;
const tag = process.argv[2];
if (!tok || !tag) { console.error('Aufruf: ZENODO_TOKEN=… node scripts/zenodo-veroeffentlichen.mjs <tag> [--concept <id>]'); process.exit(1); }
const conceptIdx = process.argv.indexOf('--concept');
const concept = conceptIdx > 0 ? process.argv[conceptIdx + 1] : null;
const refIdx = process.argv.indexOf('--ref');
const ref = refIdx > 0 ? process.argv[refIdx + 1] : tag; // Archiv-Stand, falls Doku nach dem Tag korrigiert wurde
const version = tag.replace(/^v/, '');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cff = fs.readFileSync(path.join(root, 'CITATION.cff'), 'utf8');
const datum = cff.match(/date-released: "([^"]+)"/)[1];
const index = JSON.parse(fs.readFileSync(path.join(root, 'daten/index.json'), 'utf8'));
const anzahl = (index.datensaetze || []).reduce((s, d) => s + (d.anzahl || 0), 0);

const zip = path.join('/tmp', `promptinjections-dataset-${tag}.zip`);
execFileSync('git', ['archive', '--format=zip', `--prefix=promptinjections-dataset-${version}/`, '-o', zip, ref], { cwd: root });

const UA = 'promptinjections-dataset-zenodo/1.0 (+https://promptinjections.de/daten/)';
const h = { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json', 'User-Agent': UA };
const call = async (url, init = {}) => {
  const r = await fetch(url, { ...init, headers: { ...h, ...(init.headers || {}) } });
  if (!r.ok && r.status !== 204) throw new Error(`${init.method || 'GET'} ${url}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
};

let dep;
if (concept) {
  const alt = await call(`${API}/deposit/depositions/${concept}/actions/newversion`, { method: 'POST' });
  dep = await call(alt.links.latest_draft);
  for (const f of dep.files || []) await call(f.links.self, { method: 'DELETE' });
} else {
  dep = await call(`${API}/deposit/depositions`, { method: 'POST', body: '{}' });
}

const bucket = dep.links.bucket;
const up = await fetch(`${bucket}/${path.basename(zip)}`, { method: 'PUT', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/octet-stream', 'User-Agent': UA }, body: fs.readFileSync(zip) });
if (!up.ok) throw new Error(`upload ${up.status} ${await up.text()}`);

const metadata = {
  title: 'Prompt Injection und LLM-Sicherheit: ein deutschsprachiger Datensatz',
  upload_type: 'dataset',
  publication_date: datum,
  version,
  language: 'deu',
  creators: [{ name: 'Köse, Gökhan', affiliation: 'koeseo, Bochum' }],
  description: `<p>Offene, belegte Daten zu Angriffen auf Anwendungen mit großen Sprachmodellen: Angriffstechniken, Glossar, Werkzeuge, Modelle, Vorfälle, OWASP Top 10 für LLM-Anwendungen (deutsche Einordnung), CVE-Verzeichnis (NVD-geprüft) und der monatliche Prompt Injection Threat Index. ${anzahl} Einträge, jeder mit verlinkter Primärquelle.</p><p>Herausgegeben von <a href="https://promptinjections.de/">promptinjections.de</a>. Der Datensatz wird aus dem Portal erzeugt; dieselben Daten liegen als API unter <a href="https://promptinjections.de/api/">promptinjections.de/api/</a>. Version ${version}: Threat Index September und Oktober 2026, CVE-Verzeichnis mit 52 Einträgen.</p><p>Lizenz CC BY 4.0; die OWASP-Einordnung steht unter CC BY-SA 4.0 (siehe NOTICE).</p>`,
  access_right: 'open',
  license: 'cc-by-4.0',
  keywords: ['prompt injection', 'LLM security', 'KI-Sicherheit', 'OWASP LLM Top 10', 'CVE', 'threat index', 'deutsch'],
  related_identifiers: [
    { identifier: `https://github.com/koeseo/promptinjections-dataset/tree/${tag}`, relation: 'isSupplementTo', scheme: 'url' },
    { identifier: 'https://promptinjections.de/daten/', relation: 'isDescribedBy', scheme: 'url' },
  ],
};
dep = await call(dep.links.self, { method: 'PUT', body: JSON.stringify({ metadata }) });
const pub = await call(dep.links.publish, { method: 'POST' });
console.log(JSON.stringify({ id: pub.id, conceptrecid: pub.conceptrecid, doi: pub.doi, conceptdoi: pub.conceptdoi, url: pub.links.html, files: (pub.files || []).map((f) => `${f.filename} ${f.filesize}`) }, null, 1));
fs.unlinkSync(zip);
