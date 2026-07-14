import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    N8N_WEBHOOK_BASE_URL: z.string().url(),
    N8N_WEBHOOK_SECRET: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
});
