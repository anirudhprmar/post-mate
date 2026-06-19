import { db } from "~/server/db";
import { connectedAccount } from "~/server/db/schema";
import { and, eq, lt } from "drizzle-orm";
import { refreshAccountToken } from "~/lib/social-oauth/refresh";
import { inngest } from "~/lib/inngest";

export const refreshTokens = inngest.createFunction(
  {
    id: "account.refresh-tokens",
    name: "Refresh Connected Account Tokens",
    triggers: [{ cron: "0 * * * *" }],
  },
  async ({ step }: { step: any }) => {
    const expiringAccounts = await step.run(
      "fetch-expiring-accounts",
      async () => {
        const timeLimit = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return db.query.connectedAccount.findMany({
          where: and(
            eq(connectedAccount.status, "active"),
            lt(connectedAccount.expiresAt, timeLimit),
          ),
        }) as Promise<any[]>;
      },
    );

    if (expiringAccounts.length === 0) {
      return { message: "No accounts need token refresh at this time." };
    }

    const results = await Promise.allSettled(
      expiringAccounts.map((account: any) =>
        step.run(`refresh-account-${account.id}`, async () => {
          const success = await refreshAccountToken(account.id);
          return { accountId: account.id, platform: account.platform, success };
        }),
      ),
    );

    return {
      message: `Processed token refresh for ${expiringAccounts.length} accounts.`,
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { error: r.reason },
      ),
    };
  },
);
