import { callN8nWebhook } from "@/lib/n8n";
import type { KpiResponse } from "@/types";

export const revalidate = 300;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period");
  const path = period ? `/webhook/kpis?period=${encodeURIComponent(period)}` : "/webhook/kpis";

  const upstream = await callN8nWebhook(path);

  if (!upstream.ok) {
    return Response.json(
      { error: { code: "UPSTREAM_ERROR", message: "KPIs nicht verfuegbar." } },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as KpiResponse;
  return Response.json(data);
}
