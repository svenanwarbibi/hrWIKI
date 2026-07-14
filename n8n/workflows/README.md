# n8n-Workflows

Exportierte Workflow-JSONs landen hier (`n8n export:workflow --id=<id> --output=n8n/workflows/<name>.json`), damit Änderungen versioniert und per PR review-bar sind. n8n selbst ist keine Git-native Umgebung — dieser Ordner ist der manuelle Sync-Punkt.

Geplante Workflows (siehe `docs/data-contract.md`):

- `chat.json` — RAG-Kernworkflow
- `executive-summary.json`
- `kpis.json`
- `contacts.json`
- `ingest.json` — Cron-getriebene Dokumenten-Ingestion
