# HRWIKI

Internes HR-Portal: RAG-Chat über klar definierte Unternehmensdaten, plus statische Inhalte (Executive Summary, KPIs, interne/externe Ansprechpartner).

Architektur und Backend-Datenvertrag: siehe [`docs/architecture.md`](docs/architecture.md) und [`docs/data-contract.md`](docs/data-contract.md).

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS, gehostet auf Vercel. Backend-Orchestrierung über n8n, Datenspeicher Supabase (Postgres + pgvector).

## Struktur

```
hrwiki/
├── docs/
│   ├── architecture.md      Architekturüberblick, Stack-Entscheidungen, fehlende Libraries
│   └── data-contract.md     Exakte n8n-Webhook-Verträge (Request/Response-Shapes)
├── n8n/workflows/           Exportierte n8n-Workflow-JSONs (versioniert)
├── src/
│   ├── app/                 Next.js App Router: Seiten + /api Route Handler (BFF)
│   ├── components/          chat/, kpi/, contacts/
│   ├── lib/                 n8n-Client, Env-Validierung, Utils
│   ├── types/                Geteilte TS-Typen (spiegeln den Datenvertrag)
│   └── middleware.ts         Auth-Gate
└── .github/workflows/ci.yml  Lint + Typecheck + Build auf jedem PR
```

## Setup

```bash
pnpm install
cp .env.example .env.local   # Werte eintragen (n8n, Supabase, Auth.js)
pnpm dev
```

Node 20+ (siehe `.nvmrc`).

## Status

Architektur-Scaffold. Die Route Handler proxyen zu n8n-Webhooks, die noch nicht existieren — vor dem ersten `pnpm dev` mit echten Daten müssen die fünf Workflows aus `docs/data-contract.md` in n8n gebaut und `N8N_WEBHOOK_BASE_URL`/`N8N_WEBHOOK_SECRET` gesetzt werden.
