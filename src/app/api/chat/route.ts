import { z } from "zod";
import { env } from "@/lib/env";

// n8n antwortet gemessen 15-35s (RAG-Retrieval + LLM) — über Vercels
// Standard-Timeout für Serverless Functions. Explizit anheben.
export const maxDuration = 60;

const requestSchema = z.object({
  projectId: z.string().min(1),
  sessionId: z.string(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  const { sessionId, message } = requestSchema.parse(await req.json());

  // n8n Chat Trigger erwartet chatInput/sessionId, nicht unseren eigenen
  // Contract-Shape aus docs/data-contract.md — projectId wird vom
  // aktuell einzigen, projektübergreifenden Workflow (noch) nicht
  // ausgewertet. n8n führt den Gesprächsverlauf serverseitig über
  // sessionId, daher wird hier keine history mitgeschickt.
  const upstream = await fetch(env.N8N_CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatInput: message, sessionId }),
  });

  if (!upstream.ok) {
    return Response.json(
      { error: { code: "UPSTREAM_ERROR", message: "n8n hat keine gültige Antwort geliefert." } },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as { output?: string };
  if (!data.output) {
    return Response.json(
      { error: { code: "UPSTREAM_ERROR", message: "n8n-Antwort hatte kein 'output'-Feld." } },
      { status: 502 },
    );
  }

  return Response.json({ message: data.output });
}
