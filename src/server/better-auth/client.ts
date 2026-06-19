import { createAuthClient } from "better-auth/react";
import { env } from "~/env";
import { polarClient } from "@polar-sh/better-auth";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [organizationClient(), polarClient()],
});

export type Session = typeof authClient.$Infer.Session;
