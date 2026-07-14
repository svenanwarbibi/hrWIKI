import { callN8nWebhook } from "@/lib/n8n";
import type { ExecutiveSummary } from "@/types";

export const revalidate = 300;

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
