import { callN8nWebhook } from "@/lib/n8n";
import { z } from "zod";

export const runtime = "edge";

const requestSchema = z.object({
  projectId: z.string().min(1),
  sessionId: z.string(),
  message: z.string().min(1),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export async function POST(req: Request) {
  const body = requestSchema.parse(await req.json());

  const upstream = await callN8nWebhook("/webhook/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: { code: "UPSTREAM_ERROR", message: "n8n hat keine Antwort geliefert." } },
      { status: 502 },
    );
  }

  // Der Stream wird unveraendert an den Client durchgereicht (Vercel AI SDK
  // Data Stream Protocol) — n8n ist verantwortlich fuer das Format.
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
