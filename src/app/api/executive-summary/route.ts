import { callN8nWebhook } from "@/lib/n8n";
import type { ExecutiveSummary } from "@/types";

// force-dynamic statt revalidate: sonst versucht Next.js, diese Route beim
// Build statisch zu prerendern und ruft dabei n8n live an (bricht den Build,
// wenn n8n nicht erreichbar ist). Revalidate steuert stattdessen der
// aufrufende Page-Fetch (next: { revalidate }).
export const dynamic = "force-dynamic";

export async function GET() {
  const upstream = await callN8nWebhook("/webhook/executive-summary");

  if (!upstream.ok) {
    return Response.json(
      { error: { code: "UPSTREAM_ERROR", message: "Executive Summary nicht verfuegbar." } },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as ExecutiveSummary;
  return Response.json(data);
}
