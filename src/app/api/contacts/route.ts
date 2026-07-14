import { callN8nWebhook } from "@/lib/n8n";
import type { ContactsResponse } from "@/types";

// force-dynamic statt revalidate, siehe Kommentar in api/executive-summary/route.ts
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "internal";

  if (type !== "internal" && type !== "external") {
    return Response.json(
      { error: { code: "INVALID_TYPE", message: "type muss 'internal' oder 'external' sein." } },
      { status: 400 },
    );
  }

  const upstream = await callN8nWebhook(`/webhook/contacts?type=${type}`);

  if (!upstream.ok) {
    return Response.json(
      { error: { code: "UPSTREAM_ERROR", message: "Ansprechpartner nicht verfuegbar." } },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as ContactsResponse;
  return Response.json(data);
}
