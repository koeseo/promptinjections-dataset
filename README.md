# Prompt Injection und LLM-Sicherheit: ein deutschsprachiger Datensatz

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24054569.svg)](https://doi.org/10.5281/zenodo.24054569)

Offene, belegte Daten zu Angriffen auf Anwendungen mit großen Sprachmodellen.
**256 Einträge, jeder einzelne mit verlinkter Primärquelle.** Dieselben Daten liegen als API unter [promptinjections.de/api/v1/](https://promptinjections.de/api/).

Herausgegeben von [promptinjections.de](https://promptinjections.de), dem deutschsprachigen
Fachportal für Prompt Injection und LLM-Sicherheit. Der Datensatz wird direkt aus dem Portal
erzeugt und bleibt damit im Gleichstand mit den redaktionell gepflegten Seiten.

| Datensatz | Einträge | Inhalt |
|---|---:|---|
| [`techniken`](daten/techniken.json) | 52 | Angriffsverfahren mit Funktionsweise, Risiko-Einstufung und Schutzmaßnahmen |
| [`glossar`](daten/glossar.json) | 82 | Fachbegriffe der LLM-Sicherheit, je in zwei Sätzen definiert |
| [`werkzeuge`](daten/werkzeuge.json) | 32 | Guardrails, Scanner, Schutzmodelle und Benchmarks mit Anbieter und Lizenz |
| [`modelle`](daten/modelle.json) | 16 | Sprachmodelle und öffentlich dokumentierte Schwächen |
| [`owasp-llm-top10`](daten/owasp-llm-top10.json) | 10 | Die zehn OWASP-Risiken für LLM-Anwendungen, deutsch eingeordnet |
| [`vorfaelle`](daten/vorfaelle.json) | 9 | Real dokumentierte Zwischenfälle mit Zeitpunkt, System und Behebungsstand |
| [`cves`](daten/cves.json) | 52 | Registrierte Schwachstellen in LLM- und Agenten-Software, gegen die NVD geprüft |
| [`threat-index`](daten/threat-index.json) | 3 Ausgaben | Monatliches Lagebild: 20, 37 und 52 geprüfte Einträge (August bis Oktober 2026), je Bereich gezählt |

Jeder Eintrag liegt als JSON, als CSV und mit einem JSON-Schema vor.

## Worum es geht

**Prompt Injection** ist eine Angriffsklasse gegen Anwendungen mit großen Sprachmodellen.
Ihre Ursache ist strukturell: Systemanweisung und verarbeiteter Fremdtext teilen sich
dasselbe Kontextfenster, und das Modell kann beide nicht zuverlässig auseinanderhalten.
Wer Text in den Kontext bekommt, kann damit Anweisungen setzen. Den Begriff prägte
Simon Willison am 12. September 2022, einen Tag nach Riley Goodsides öffentlicher
Demonstration gegen einen GPT-3-Bot.

Man unterscheidet zwei Grundformen. Bei der **direkten** Injektion schreibt der Angreifer
die Anweisung selbst in die Eingabe. Bei der **indirekten** Injektion stammt sie aus
Inhalten, die das System eigenständig lädt: einer Webseite, einer E-Mail, einem Dokument,
einem Treffer aus der Vektorsuche. Der Angreifer interagiert dabei nie mit der Anwendung.
Diese Variante wurde im Februar 2023 von Kai Greshake und Kollegen akademisch gefasst
(*Not what you've signed up for*, [arXiv:2302.12173](https://arxiv.org/abs/2302.12173))
und ist heute die praktisch bedeutsamere.

Das OWASP GenAI Security Project führt Prompt Injection als **LLM01**, also als
Risiko Nummer eins für LLM-Anwendungen. Ein dokumentierter Praxisfall ist
**EchoLeak** ([CVE-2025-32711](https://nvd.nist.gov/vuln/detail/cve-2025-32711)) gegen
Microsoft 365 Copilot vom Juni 2025: Eine präparierte E-Mail im Postfach genügte, ohne
Klick des Opfers, um Daten abfließen zu lassen.

Eine allgemeine Lösung gibt es nach über drei Jahren nicht. Wirksam ist allein
Architektur, die davon ausgeht, dass die Injektion gelingt: Trennung von privilegiertem
und unprivilegiertem Modell, deterministische Prüfung vor Aktionen mit Außenwirkung,
und der Verzicht darauf, sensible Daten, nicht vertrauenswürdige Inhalte und einen
Abflusskanal im selben Agenten zu vereinen.

Ausführliche Darstellungen zu jedem dieser Punkte stehen auf
[promptinjections.de](https://promptinjections.de). Dieser Datensatz enthält die
strukturierten Fakten dahinter, nicht die Aufbereitung.

## Versionen

- **2.2.0** (2026-11-08, DOI [10.5281/zenodo.24054570](https://doi.org/10.5281/zenodo.24054570)): Threat Index um die Ausgaben September (37 Einträge) und Oktober 2026 (52 Einträge) ergänzt; CVE-Verzeichnis von 12 auf 52 Einträge (alle NVD-geprüft); Vorfälle aktualisiert. 256 Einträge gesamt.
- **2.1.0** (2026-09-05): CVE-Verzeichnis (12 Einträge, NVD-geprüft) und Prompt Injection Threat Index (Ausgabe August 2026) neu; Export und API (`/api/v1/`) aus derselben Bibliothek.
- **2.0.0** (2026-09-01): Wechsel auf die OWASP-Fassung 2026.
- **1.0.0** (2026-08-10): Erstveröffentlichung mit 198 Einträgen.

## Aufbau

Jede Datei folgt derselben Form:

```json
{
  "meta": { "titel": "…", "version": "2.2.0", "stand": "2026-11-06", "lizenz": "CC-BY-4.0", "anzahl": 52 },
  "eintraege": [ { "slug": "…", "url": "…", "quelle_url": "…", "belegt": true } ]
}
```

Zwei Felder trägt jeder Eintrag:

- **`url`** verweist auf die kanonische Seite dieses Eintrags auf promptinjections.de.
  Dort steht die ausführliche deutschsprachige Darstellung.
- **`quelle_url`** verweist auf die Primärquelle: ein Paper, ein Hersteller-Advisory,
  ein Standarddokument. **Alle 212 Einträge tragen eine solche Quelle.**

Das Feld `belegt` unterscheidet belegte Sachverhalte von redaktionellen Einschätzungen.
Die Risiko-Einstufung einer Technik ist eine Einschätzung und als solche gekennzeichnet;
die Existenz eines Angriffsverfahrens ist es nicht.

Wo eine Technik als eigenständige Entität außerhalb dieses Datensatzes geführt wird,
nennt `sameAs` die externen Referenzen, etwa MITRE ATLAS, arXiv oder Wikipedia.

## Verwendung

Direkter Zugriff ohne Klonen:

```bash
curl -s https://raw.githubusercontent.com/koeseo/promptinjections-dataset/main/daten/techniken.json

# Alle Techniken mit hoher Risiko-Einstufung
curl -s https://raw.githubusercontent.com/koeseo/promptinjections-dataset/main/daten/techniken.json \
  | jq -r '.eintraege[] | select(.risiko=="hoch") | "\(.name_de)  \(.url)"'
```

```python
import json, urllib.request

basis = "https://raw.githubusercontent.com/koeseo/promptinjections-dataset/main/daten/"
techniken = json.load(urllib.request.urlopen(basis + "techniken.json"))["eintraege"]
print(len([t for t in techniken if t["risiko"] == "hoch"]), "Techniken mit hohem Risiko")
```

Die CSV-Dateien unter [`csv/`](csv/) enthalten dieselben Daten flach; Listenfelder sind
dort mit ` | ` verbunden. Die JSON-Schemas unter [`schema/`](schema/) beschreiben jede
Struktur formal und lassen sich zur Validierung einsetzen.

## Herkunft, Pflege und Abgrenzung

Der Datensatz wird aus den Quelldaten von promptinjections.de erzeugt. Redaktionelle
Änderungen am Portal fließen mit dem nächsten Export ein; Versionen folgen
[Semantic Versioning](https://semver.org/lang/de/).

Alle Einträge sind **defensiv und erklärend** gehalten. Sie beschreiben das Wirkprinzip
einer Technik, damit Betreiber ihre Systeme prüfen und absichern können. Der Datensatz
enthält bewusst **keine einsatzfertigen Angriffs-Payloads** gegen konkrete Systeme.

Er ist kein Ersatz für die Primärquellen, sondern ein Verzeichnis, das zu ihnen führt.

## Lizenz

Der Datensatz steht unter **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de)**.
Weiterverwendung ist ausdrücklich erwünscht, auch kommerziell, unter einer Bedingung:
Namensnennung mit Verweis auf die Quelle.

> promptinjections.de (Gökhan Köse), https://promptinjections.de, CC BY 4.0

**Eine Ausnahme:** Die Datei [`daten/owasp-llm-top10.json`](daten/owasp-llm-top10.json)
bezieht sich auf das *OWASP Top 10 for LLM Applications* der OWASP Foundation, das unter
CC BY-SA 4.0 steht. Diese Datei steht deshalb ebenfalls unter **CC BY-SA 4.0**; bei
Weiterverwendung ist zusätzlich OWASP zu nennen. Die deutschen Formulierungen sind
eigene Texte und keine autorisierte Übersetzung.

## Zitieren

```
Köse, G. (2026). Prompt Injection und LLM-Sicherheit: ein deutschsprachiger Datensatz
(Version 2.2.0) [Datensatz]. promptinjections.de. https://doi.org/10.5281/zenodo.24054570
```

Für Literaturverwaltungen liegt eine [`CITATION.cff`](CITATION.cff) bei.

---

## English

**An open, source-backed dataset on prompt injection and LLM security, in German.**

212 curated entries, every single one carrying a link to its primary source: 52 attack
techniques, 82 glossary terms, 32 defensive tools, 16 language models with documented
weaknesses, the 10 OWASP risks for LLM applications, and 7 documented real-world incidents.

Prompt injection is an attack class against applications built on large language models.
Its cause is structural: the system prompt and untrusted third-party text share a single
context window, and the model cannot reliably tell them apart. Simon Willison coined the
term on 12 September 2022. The indirect variant, where the instruction arrives through
content the system itself retrieves, was formalised by Greshake et al. in February 2023
([arXiv:2302.12173](https://arxiv.org/abs/2302.12173)). OWASP tracks it as **LLM01**, the
number one risk for LLM applications.

**Why German matters here.** Every widely cited resource in this field is English:
MITRE ATLAS, the OWASP LLM Top 10, garak, HackAPrompt. No structured, source-backed
German-language dataset existed before this one. Operators and developers in
German-speaking markets work under German legal and regulatory conditions and read
German documentation. This dataset closes that gap. Field names and values are German;
the structure is documented above and in the JSON schemas, so the data is usable
regardless of language.

Every record carries `url` (its canonical page on promptinjections.de) and `quelle_url`
(the primary source). Data is provided as JSON, CSV and JSON Schema.

Licensed **CC BY 4.0**, so reuse is welcome with attribution to
promptinjections.de (Gökhan Köse). The file `daten/owasp-llm-top10.json` derives from
OWASP material and is therefore **CC BY-SA 4.0**, requiring attribution to OWASP as well.

All entries are defensive and explanatory. The dataset deliberately contains **no
ready-to-use attack payloads** against specific systems.
