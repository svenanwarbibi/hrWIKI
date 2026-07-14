# HRWIKI — Architektur

Internes Portal: Nutzer chatten (RAG) mit klar definierten Unternehmensdaten und sehen zusätzlich statische Inhalte (Executive Summary, KPIs, interne/externe Ansprechpartner).

**Entscheidung:** Next.js (App Router) auf Vercel als Frontend/BFF, n8n als Orchestrierungs-Backend, Supabase (Postgres + pgvector) als einheitlicher Datenspeicher für strukturierte Daten *und* Vektor-Embeddings.

---

## Architektur im Überblick

```
                         ┌──────────────────────────┐
                         │        Browser            │
                         │  Next.js Client (React)   │
                         └─────────────┬──────────────┘
                                       │ HTTPS
                                       ▼
                         ┌──────────────────────────┐
                         │   Next.js auf Vercel      │
                         │  App Router + Route        │
                         │  Handlers (/api/*) als BFF │
                         │  → verbirgt n8n-Secrets     │
                         └──────┬──────────────┬──────┘
                                │              │
                    statische Daten      Chat / RAG (stream)
                                │              │
                                ▼              ▼
                         ┌──────────────────────────┐
                         │         n8n                │
                         │  Webhook-Workflows:         │
                         │  - chat (RAG)               │
                         │  - executive-summary        │
                         │  - kpis                     │
                         │  - contacts/internal         │
                         │  - contacts/external          │
                         │  - ingest (Cron/Trigger)      │
                         └──────┬──────────────┬──────┘
                                │              │
                     strukturierte Daten   Retrieval + LLM
                                │              │
                                ▼              ▼
                    ┌──────────────────┐  ┌──────────────────────┐
                    │     Supabase       │  │  LLM-Provider          │
                    │  Postgres           │  │  (Anthropic / OpenAI)  │
                    │  - kpis              │  │  Embeddings + Chat     │
                    │  - contacts          │  └──────────────────────┘
                    │  - exec_summary      │
                    │  pgvector             │
                    │  - document_chunks    │
                    └──────────────────┘
                                ▲
                                │ Ingestion (Cron/Webhook-Trigger)
                    ┌──────────────────────────┐
                    │ Quelldokumente             │
                    │ (SharePoint / Drive /        │
                    │  Confluence / PDF-Upload)    │
                    └──────────────────────────┘
```

---

## Warum dieser Zuschnitt

- **Next.js ist nie direkter Endpunkt für n8n-Secrets.** Der Browser ruft ausschließlich `/api/*`-Route-Handler in Next.js auf (BFF-Pattern). Diese Route-Handler halten das n8n-Webhook-Secret server-seitig (Vercel Env Var) und reichen die Anfrage weiter. So ist das n8n-Webhook nie im Client-Bundle sichtbar und nicht direkt von außen aufrufbar.
- **n8n bleibt reine Orchestrierung, kein Datenspeicher.** KPIs, Ansprechpartner und Executive Summary könnten technisch auch als n8n-interne Datenstrukturen (Set-Node, Google Sheet) existieren — das skaliert aber schlecht für Auth/Filterung/Historie. Eine echte Datenbank (Supabase) dahinter macht die Workflows dünn: n8n liest/schreibt nur, die Fachlogik (Validierung, Relationen) liegt in Postgres.
- **Ein Datenspeicher für strukturierte Daten *und* Vektoren.** Supabase pgvector erspart einen zusätzlichen Vektor-DB-Dienst (Pinecone/Qdrant) für den Start. Migration auf eine dedizierte Vektor-DB ist möglich, falls Embedding-Volumen/Latenz das später verlangen — siehe *Lock-in-Audit*.
- **RAG-Antworten sind nur so vertrauenswürdig wie ihre Quellenangaben.** Jede Chat-Antwort liefert `sources[]` mit Dokumenttitel + Chunk-Referenz zurück, die im UI als Zitat angezeigt werden. Ohne Quellenangabe kein "definierte Daten"-Versprechen.

---

## Frontend — Next.js auf Vercel

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI-Komponenten:** shadcn/ui (Radix-Primitives, im Repo besessen, kein Lock-in)
- **Rendering-Strategie:**
  - Statische Seiten (Executive Summary, KPIs, Ansprechpartner): Server Components mit `fetch` + `revalidate` (ISR, z. B. alle 5 Minuten) — Daten ändern sich selten, kein Grund für Client-seitiges Polling.
  - Chat: Client Component, Streaming über die Vercel AI SDK (`ai`/`@ai-sdk/react`, `useChat`), die gegen den eigenen `/api/chat`-Route-Handler spricht.
- **Auth:** Auth.js (NextAuth) mit Microsoft-Entra-ID-Provider (SSO für Mitarbeitende) — HR-Daten sind nicht für anonyme Nutzer gedacht. Middleware (`src/middleware.ts`) sperrt alle Routen außer `/login` hinter einer gültigen Session.
- **Route Handler als BFF:**
  - `POST /api/chat` — proxyt zu n8n-Chat-Webhook, reicht Streaming-Response durch
  - `GET /api/executive-summary`, `GET /api/kpis`, `GET /api/contacts?type=internal|external` — proxyt zu den jeweiligen n8n-Webhooks, cached serverseitig

## Backend-Orchestrierung — n8n

n8n hält keine Geschäftsdaten dauerhaft, sondern verbindet Frontend-Anfragen mit Supabase und dem LLM-Provider. Fünf Workflows:

1. **`chat` (Webhook, POST, streaming)** — RAG-Kernworkflow, siehe `data-contract.md`
2. **`executive-summary` (Webhook, GET)** — liest Singleton-Zeile aus Supabase
3. **`kpis` (Webhook, GET)** — liest KPI-Tabelle, optional gefiltert nach Zeitraum
4. **`contacts` (Webhook, GET)** — liest Kontakt-Tabelle, gefiltert nach `type=internal|external`
5. **`ingest` (Cron oder manueller Trigger)** — holt neue/geänderte Quelldokumente, chunked, embedded, schreibt in `document_chunks`

Alle Webhooks sind mit einem Shared Secret (Header `X-HRWIKI-Secret`) abgesichert, das nur Next.js (server-seitig) kennt.

## Datenspeicher — Supabase (Postgres + pgvector)

- **Strukturierte Tabellen:** `executive_summary` (Singleton), `kpis`, `contacts`, `chat_sessions`, `chat_messages` (für Verlauf/Audit)
- **Vektor-Tabelle:** `document_chunks` (Spalten: `id`, `document_id`, `title`, `source_url`, `chunk_text`, `embedding vector(1536)`, `updated_at`) — Ähnlichkeitssuche über `pgvector`-Cosine-Distanz
- **Warum Supabase statt reinem n8n-Datenhaltung:** Zugriffskontrolle (Row Level Security), Skalierung der Vektorsuche, und ein Ort für Chat-Historie/Audit-Log — HR-Kontext macht Nachvollziehbarkeit relevant.

## Ingestion-Pipeline (RAG-Grundlage)

1. Quelle (SharePoint/Drive/Confluence/manueller Upload) liefert Rohdokumente.
2. n8n-Workflow `ingest`: Dokument laden → Text extrahieren → Chunking (z. B. 500–800 Tokens, Overlap ~100) → Embeddings erzeugen (LLM-Provider) → Upsert in `document_chunks`.
3. Läuft auf Cron (z. B. stündlich) oder bei Webhook-Trigger der Quelle (z. B. SharePoint-Änderungsbenachrichtigung).
4. **Wichtig:** "klar definierte Daten" heißt, die Quellmenge ist explizit kuratiert (eine Liste erlaubter Dokumente/Ordner), nicht ein offener Crawl — reduziert Halluzinationsrisiko und macht Zitate belastbar.

## Hosting & Infrastruktur

| Layer | Dienst | Hinweis |
|---|---|---|
| Frontend | Vercel | Next.js, Preview-Deploys pro PR |
| Orchestrierung | n8n (Cloud oder self-hosted) | Self-hosted empfehlenswert bei sensiblen HR-Daten (Datenresidenz) |
| Datenbank | Supabase | Postgres + pgvector, Row Level Security |
| LLM | Anthropic (Claude) oder OpenAI | Über n8n-Node, Modellwahl konfigurierbar |
| Auth | Microsoft Entra ID via Auth.js | SSO, kein separates Passwort-System |
| Secrets | Vercel Env Vars + n8n Credentials Store | nie im Client-Bundle |

## CI/CD

- GitHub Actions: Lint (`eslint`), Typecheck (`tsc --noEmit`), Build auf jedem PR
- Vercel: automatische Preview-Deploys pro Branch, Produktion auf `main`
- n8n-Workflows werden versioniert als JSON-Export im Repo (`n8n/workflows/*.json`) gepflegt und bei Bedarf manuell/über n8n-CLI importiert — n8n selbst ist keine Git-native Umgebung.

---

## Fehlende Bibliotheken (Stack-Lücken)

Der genannte Stack (n8n, Vercel, Next.js, JS/TS, Tailwind, React) beschreibt Hosting + Framework, aber keine der Bibliotheken, die eine RAG-Chat-Oberfläche und ein Daten-Dashboard tatsächlich brauchen:

| Zweck | Paket | Warum nötig |
|---|---|---|
| Streaming-Chat-UI | `ai`, `@ai-sdk/react` | `useChat`-Hook, SSE/Streaming-Handling gegen `/api/chat` — sonst muss Streaming manuell mit `ReadableStream` gebaut werden |
| UI-Komponenten | `shadcn/ui` (Radix + `class-variance-authority`, `clsx`, `tailwind-merge`) | Accessible Primitives (Dialog, Dropdown, Tabs) fehlen in reinem Tailwind |
| Icons | `lucide-react` | Kein Icon-Set im genannten Stack enthalten |
| Formulare/Validierung | `react-hook-form`, `zod` | Admin-Formulare (KPI/Kontakt pflegen) brauchen Validierung; `zod` zusätzlich für API-Response-Validierung |
| Auth | `next-auth` (Auth.js) | SSO/Session-Handling ist nicht Teil von Next.js selbst |
| Markdown-Rendering | `react-markdown`, `remark-gfm`, `rehype-sanitize` | RAG-Antworten kommen als Markdown zurück; `rehype-sanitize` verhindert XSS aus LLM-Output |
| Charts (KPI-Darstellung) | `recharts` | Trendlinien/Balken für KPIs — kein Charting im Stack enthalten |
| Datum/Zeit | `date-fns` | KPI-Zeiträume, "zuletzt aktualisiert"-Anzeigen |
| Supabase-Client | `@supabase/supabase-js` | DB-Zugriff aus Route Handlern |
| Env-Validierung | `@t3-oss/env-nextjs` | Verhindert fehlkonfigurierte Deploys (fehlende Secrets erst zur Laufzeit bemerkt) |
| Rate Limiting | `@upstash/ratelimit`, `@upstash/redis` | Chat-Endpoint ist der teuerste Aufruf (LLM-Kosten) — ohne Limit missbrauchbar |
| Testing | `vitest`, `@testing-library/react`, `playwright` | Kein Test-Setup im genannten Stack |
| Formatierung | `prettier`, `prettier-plugin-tailwindcss` | Konsistente Klassen-Reihenfolge, Formatierung |
| Vercel-Observability | `@vercel/analytics`, `@vercel/speed-insights` | Optional, aber Standard bei Vercel-Deploys |

Alle in `package.json` des Scaffolds bereits eingetragen (siehe `apps/`-Struktur unten).

---

## Lock-in-Audit

| Layer | Anbieter | Kosten beim Wechsel |
|---|---|---|
| Hosting | Vercel | Gering — Next.js läuft auch auf Cloudflare/Netlify/eigenem Node-Server |
| Orchestrierung | n8n | Gering bei self-hosted (Open Source, Workflows als JSON exportierbar); mittel bei n8n Cloud (Migration der Workflows nötig, aber gleiches Format) |
| Datenbank | Supabase | Gering — Standard-Postgres, pgvector ist eine offene Postgres-Extension, kein proprietäres Format |
| Auth | Microsoft Entra ID | Mittel — Nutzer-Migration nötig, aber Standard-OIDC |
| UI | shadcn/ui | Keins — Komponenten liegen im eigenen Repo |
| LLM | Anthropic/OpenAI | Gering — hinter n8n-Node austauschbar, RAG-Kontext ist providerunabhängig |

---

## Offene Punkte für die nächste Iteration

- Zugriffssteuerung pro KPI/Kontakt-Kategorie (z. B. Executive Summary nur für Führungsebene)?
- Mehrsprachigkeit (DE/EN) — analog zum Hokua-Projekt: aus Kostengründen zunächst einsprachig, Strings aber von Anfang an nicht hart in JSX verdrahten
- Feedback-Mechanismus (Daumen hoch/runter) auf Chat-Antworten, um RAG-Qualität zu messen
- Admin-UI zum Pflegen von KPIs/Ansprechpartnern (aktuell nicht Teil des Scaffolds — Daten kommen vorerst über n8n/Supabase direkt)
