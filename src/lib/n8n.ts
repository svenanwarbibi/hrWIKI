import { env } from "@/lib/env";

/**
 * Server-only fetch wrapper for n8n webhooks. Never import this from a
 * Client Component — the secret must stay on the server.
 */
export async function callN8nWebhook(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = new URL(path, env.N8N_WEBHOOK_BASE_URL);

  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      "X-HRWIKI-Secret": env.N8N_WEBHOOK_SECRET,
      "Content-Type": "application/json",
    },
  });
}
