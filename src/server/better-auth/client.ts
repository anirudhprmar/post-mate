import { createAuthClient } from "better-auth/react";
import { env } from "~/env";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [organizationClient()],
});

export type Session = typeof authClient.$Infer.Session;
