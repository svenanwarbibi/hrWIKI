# HRWIKI — Backend-Datenvertrag (n8n)

Companion zu `architecture.md`. Beschreibt exakt, welche Endpunkte n8n bereitstellen muss, mit Request/Response-Shapes. Next.js-Route-Handler sind dünne Proxys vor diesen Webhooks — die Shapes hier sind die Wahrheit, die TypeScript-Typen in `src/types/` spiegeln sie 1:1.

Alle Endpunkte: Base-URL `N8N_WEBHOOK_BASE_URL`, Header `X-HRWIKI-Secret: <shared secret>` (serverseitig, nie im Client).

**Seitenstruktur:** HRWIKI ist projektbasiert. `/projects` listet alle Bauvorhaben, `/projects/[slug]` zeigt eine Projektseite (Executive Summary → KPIs → projektgescopter Chat). Endpunkte 0a/0b liefern diese Projektdaten; Endpunkt 1 (Chat) ist pro Projekt gescoped über `projectId`.

---

## 0a. Projektliste — `GET /webhook/projects`

Für die Übersichtsseite `/projects`.

**Response**

```json
{
  "updatedAt": "2026-07-01T09:00:00Z",
  "projects": [
    {
      "id": "gymnasium-planegg",
      "slug": "gymnasium-planegg",
      "title": "Gymnasium Planegg",
      "client": "Gemeinde Planegg",
      "category": "bildung",
      "status": "in_progress",
      "thumbnailUrl": "https://.../planegg.jpg"
    }
  ]
}
```

- `status`: `"in_progress" | "completed" | "planned"`
- `category`: freier String, spiegelt die Kategorien der bestehenden Website-Navigation (`bestand`, `holz`, `bildung`, `wohnen`, `verwaltung`, …)

---

## 0b. Projektdetail — `GET /webhook/project?slug=<slug>`

Für `/projects/[slug]`. Liefert alle Daten für Executive Summary und KPI-Bereich einer Projektseite in einem Aufruf.

**Response**

```json
{
  "id": "gymnasium-planegg",
  "slug": "gymnasium-planegg",
  "title": "Gymnasium Planegg",
  "updatedAt": "2026-07-01T09:00:00Z",
  "executiveSummary": {
    "aufgabe": "Erweiterung und energetische Sanierung des Gymnasiums Planegg um zusätzliche Klassen- und Fachräume sowie eine neue Mensa, bei laufendem Schulbetrieb.",
    "herausforderungen": "Bauen im laufenden Betrieb, denkmalrechtliche Auflagen am Bestandsbau der 1970er Jahre, verdichteter Baustellenzugang durch angrenzende Wohnbebauung.",
    "ergebnis": "Fertigstellung von 12 neuen Klassenräumen, einer Mensa für 300 Personen und einer auf Passivhaus-Niveau sanierten Fassade; Übergabe drei Monate vor Fertigstellungstermin des Fachplaners."
  },
  "kpis": {
    "client": "Gemeinde Planegg",
    "startDate": "2023-03-01",
    "endDate": "2026-09-30",
    "budget": {
      "currency": "EUR",
      "plan": 18500000,
      "actual": 19150000
    },
    "externalProviders": [
      {
        "id": "ep-001",
        "name": "Müller Tragwerksplanung GmbH",
        "category": "Statik",
        "address": "Rosenheimer Str. 12, 81669 München"
      }
    ],
    "internalStaff": [
      {
        "id": "is-001",
        "name": "Anna Keller",
        "role": "Projektleitung"
      }
    ]
  }
}
```

- 404 (`{ "error": { "code": "NOT_FOUND", ... } }`), falls `slug` nicht existiert
- `budget.actual` kann während der Bauphase `null` sein (noch nicht final abgerechnet) — UI zeigt dann nur `plan`
- `externalProviders[].category` ist ein freier String (z. B. `Statik`, `TGA`, `Freianlagen`, `Bauphysik`)
- `internalStaff[].role` ist ein freier String (z. B. `Projektleitung`, `Bauleitung`, `Entwurf`)

---

## 1. Chat / RAG — n8n Chat Trigger (Ist-Zustand)

**Abweichung vom ursprünglichen Plan:** Als der erste echte n8n-Workflow stand, stellte sich heraus, dass er über n8n's eingebauten **Chat Trigger** läuft, nicht über einen selbst gebauten Webhook mit dem unten ursprünglich geplanten Streaming-Contract. Chat Trigger hat sein eigenes, festes Request/Response-Format und liefert synchrones JSON statt eines Streams. Statt n8n auf das ursprüngliche Format umzubauen, übersetzt unser `/api/chat`-Route-Handler zwischen unserem Contract (Client → Next.js) und n8ns Format (Next.js → n8n). Der ursprünglich geplante Streaming-Contract steht als Referenz weiter unten, ist aber **nicht mehr die Wahrheit**.

**Webhook-URL:** volle URL in `N8N_CHAT_WEBHOOK_URL` (eigene Env-Var, keine Base-URL+Pfad-Kombination — n8n vergibt pro Workflow eine UUID-Webhook-Adresse). Aktuell **ohne Auth** am Webhook selbst (kein `X-HRWIKI-Secret`-Check n8n-seitig).

**Request an n8n** (von `/api/chat` gesendet)

```json
{ "chatInput": "Wie hoch war die Budgetabweichung?", "sessionId": "uuid" }
```

**Response von n8n** — einmaliges JSON, kein Stream:

```json
{ "output": "Im ersten Jahr … [Quelle](https://drive.google.com/...)" }
```

- `output` ist Markdown-Text; Quellenangaben sind als normale Markdown-Links **inline im Text**, keine separate `sources[]`-Struktur
- Gesprächsverlauf wird von n8n serverseitig über `sessionId` geführt (vermutlich LangChain Memory Node) — `/api/chat` schickt deshalb **keine** `history` an n8n
- **`projectId` wird vom Workflow aktuell nicht ausgewertet** — es gibt nur diesen einen, projektübergreifenden Chat-Workflow. `/api/chat` nimmt `projectId` weiterhin vom Client entgegen (Contract-Stabilität für später), reicht es aber nicht durch
- Kein erkennbarer "kein Kontext gefunden"-Fall — das Modell antwortet stattdessen mit Rückfragen (siehe Beispielantwort oben im Test)

**Request an `/api/chat`** (Client → Next.js, unverändert von Next.js aus gesehen)

```json
{ "projectId": "gymnasium-planegg", "sessionId": "uuid", "message": "Wie hoch war die Budgetabweichung?" }
```

**Response von `/api/chat`** (Next.js → Client)

```json
{ "message": "Im ersten Jahr … [Quelle](https://drive.google.com/...)" }
```

### Ursprünglich geplanter Contract (Referenz, aktuell nicht implementiert)

Für den Fall, dass später ein eigener, projektgescopter Webhook mit Streaming und expliziten Quellenangaben gebaut wird (siehe "Offene Punkte" unten):

**Request**

```json
{
  "projectId": "gymnasium-planegg",
  "sessionId": "uuid",
  "message": "Wie hoch war die Budgetabweichung?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response — Streaming (Vercel AI SDK Data Stream Protocol)**

```
data: {"type":"text-delta","text":"Im ersten Jahr "}
data: {"type":"text-delta","text":"stehen dir 24 Urlaubstage zu."}
data: {"type":"sources","sources":[
  {"documentId":"pol-urlaub-2026","title":"Urlaubsrichtlinie 2026","sourceUrl":"https://.../urlaubsrichtlinie.pdf","chunkExcerpt":"...","score":0.89}
]}
data: {"type":"finish"}
```

**Fehlerfall** (kein passender Kontext gefunden):

```json
{ "type": "no-context", "message": "Dazu habe ich keine passende Quelle gefunden. Bitte an HR wenden." }
```

Pflichtverhalten wäre gewesen: Embedding der Frage → Ähnlichkeitssuche gefiltert auf `project_id` → bei keinem Treffer über Score-Schwelle `no-context` ohne LLM-Call → sonst Chunks als Kontext ans LLM, Zitierpflicht nur aus gelieferten Chunks → Verlauf inkl. `project_id` persistieren.

---

## Legacy-Endpunkte (unternehmensweit, nicht projektgescoped)

Die folgenden Endpunkte 2–4 stammen aus der ursprünglichen HR-Portal-Fassung (`/`, `/contacts/*`) und bestehen unverändert fort, sind aber **nicht** Teil der neuen Projektseiten (`/projects/[slug]` nutzt stattdessen 0b). Nur relevant, falls die generischen Company-Wide-Seiten weitergeführt werden.

## 2. Executive Summary — `GET /webhook/executive-summary`

Statischer Singleton-Inhalt.

**Response**

```json
{
  "updatedAt": "2026-07-01T09:00:00Z",
  "headline": "Q2 2026 im Überblick",
  "body": "Markdown-formatierter Fließtext ...",
  "highlights": ["Umsatz +12% ggü. Vorquartal", "Neue Standorte: 2"]
}
```

`body` ist Markdown (gerendert mit `react-markdown` + `rehype-sanitize` im Frontend).

---

## 3. KPIs — `GET /webhook/kpis?period=<optional>`

**Response**

```json
{
  "updatedAt": "2026-07-01T09:00:00Z",
  "kpis": [
    {
      "id": "headcount",
      "label": "Mitarbeitende gesamt",
      "value": 248,
      "unit": "Personen",
      "trend": "up",
      "changePct": 4.2,
      "period": "2026-Q2",
      "target": 260
    }
  ]
}
```

- `trend`: `"up" | "down" | "flat"`
- `target` optional — wenn vorhanden, zeigt UI einen Fortschrittsbalken
- Leere Liste ist ein gültiger Zustand (kein Fehler) — UI zeigt "Keine KPIs für diesen Zeitraum"

---

## 4. Ansprechpartner — `GET /webhook/contacts?type=internal|external`

**Response**

```json
{
  "updatedAt": "2026-07-01T09:00:00Z",
  "contacts": [
    {
      "id": "c-001",
      "type": "internal",
      "name": "Erika Musterfrau",
      "role": "HR Business Partner",
      "department": "People & Culture",
      "email": "erika.musterfrau@firma.de",
      "phone": "+49 30 1234567",
      "photoUrl": "https://.../erika.jpg"
    },
    {
      "id": "c-002",
      "type": "external",
      "name": "Rechtsanwaltskanzlei Beispiel",
      "role": "Arbeitsrecht",
      "company": "Beispiel & Partner",
      "email": "kontakt@beispiel-partner.de",
      "phone": "+49 30 7654321",
      "category": "Legal"
    }
  ]
}
```

- `type: "internal"` Kontakte haben `department`, kein `company`/`category`
- `type: "external"` Kontakte haben `company` + `category` (z. B. `Legal`, `Payroll`, `IT`, `Facility`), kein `department`
- Next.js filtert clientseitig nicht neu — der Query-Parameter `type` wird 1:1 durchgereicht, damit Berechtigungen (falls später nötig) serverseitig entschieden werden können

---

## 5. Ingestion-Trigger — `POST /webhook/ingest` (intern, kein Frontend-Aufruf)

Von Cron oder manuell aus n8n selbst ausgelöst, nicht von Next.js. Dokumentiert hier der Vollständigkeit halber, da er den Datenbestand für Endpunkt 1 füllt.

**Request** (bei manuellem Trigger, z. B. aus Admin-Tooling später)

```json
{ "documentIds": ["optional, sonst alle konfigurierten Quellen"] }
```

**Response**

```json
{ "processed": 12, "chunksCreated": 340, "errors": [] }
```

---

## Fehlerformat (einheitlich über alle Endpunkte)

```json
{
  "error": {
    "code": "UPSTREAM_TIMEOUT",
    "message": "n8n hat nicht innerhalb von 10s geantwortet."
  }
}
```

HTTP-Status folgt der Fehlerursache (`502` für n8n nicht erreichbar, `504` für Timeout, `401` für fehlendes/falsches Secret). Next.js-Route-Handler übersetzen dies in benutzerfreundliche UI-Fehlermeldungen, loggen den Originalfehler aber serverseitig.

## Caching-Verhalten (Next.js-Seite)

| Endpunkt | Next.js-Strategie |
|---|---|
| `/api/projects` | `revalidate: 900` (15 Min, Projektliste ändert sich selten) |
| `/api/projects/[slug]` | `revalidate: 300` (5 Min, Budget/KPIs können sich während der Bauphase ändern) |
| `/api/executive-summary` | `revalidate: 300` (5 Min) |
| `/api/kpis` | `revalidate: 300` |
| `/api/contacts` | `revalidate: 900` (15 Min, ändert sich selten) |
| `/api/chat` | kein Caching, immer live |
