import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    N8N_WEBHOOK_BASE_URL: z.string().url(),
    N8N_WEBHOOK_SECRET: z.string().min(1),
    // Eigene Variable statt N8N_WEBHOOK_BASE_URL + Pfad: n8n vergibt pro
    // Workflow eine eigene UUID-Webhook-URL, es gibt keinen gemeinsamen
    // Base-Pfad. Siehe docs/data-contract.md, Abschnitt 1.
    N8N_CHAT_WEBHOOK_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
});
