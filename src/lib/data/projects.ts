import type { Project, ProjectSummary } from "@/types";
import { MOCK_PROJECT, MOCK_PROJECT_LIST } from "@/lib/mock-data/projects";

/**
 * Datenzugriff für Projektseiten. Liefert aktuell Mockdaten (siehe
 * lib/mock-data/projects.ts) — sobald die n8n-Webhooks aus
 * docs/data-contract.md (0a/0b) laufen, werden diese beiden Funktionen
 * durch callN8nWebhook("/webhook/projects") bzw. ("/webhook/project?slug=…")
 * ersetzt. Die Route Handler in app/api/projects/* rufen ausschließlich
 * diese Funktionen auf, nicht die Mockdaten direkt.
 */

export async function getProjects(): Promise<ProjectSummary[]> {
  return MOCK_PROJECT_LIST;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return slug === MOCK_PROJECT.slug ? MOCK_PROJECT : null;
}
