import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectedAccount, account } from "~/server/db/schema";

export const connectedAccountRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.query.connectedAccount.findMany({
            where: eq(connectedAccount.userId, ctx.session.user.id),
            orderBy: [desc(connectedAccount.createdAt)],
        });
    }),
    syncFromOAuth: protectedProcedure
        .input(
            z.object({
                provider: z.enum(["instagram", "x", "facebook", "linkedin", "youtube", "threads"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // 1. Read the linked OAuth account from Better Auth's account table
            const linkedAccount = await ctx.db.query.account.findFirst({
                where: and(
                    eq(account.userId, ctx.session.user.id),
                    eq(account.providerId, input.provider),
                ),
            });

            if (!linkedAccount?.accessToken) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `No linked ${input.provider} OAuth account found. Please re-connect via OAuth.`,
                });
            }

            // 2. Fetch the user's profile from the provider API (server-side only)
            let profileAccountId: string;
            let profileUsername: string;
            let profileAvatarUrl: string | undefined;

            if (input.provider === "linkedin") {
                // LinkedIn OpenID Connect userinfo endpoint
                const res = await fetch("https://api.linkedin.com/v2/userinfo", {
                    headers: { Authorization: `Bearer ${linkedAccount.accessToken}` },
                });
                if (!res.ok) {
                    throw new TRPCError({
                        code: "BAD_GATEWAY",
                        message: `LinkedIn API returned ${res.status}: ${await res.text()}`,
                    });
                }
                const data = await res.json() as {
                    sub: string;
                    name?: string;
                    given_name?: string;
                    family_name?: string;
                    picture?: string;
                    email?: string;
                };
                profileAccountId = data.sub;
                profileUsername = data.name ?? data.email ?? data.given_name ?? "LinkedIn User";
                profileAvatarUrl = data.picture;
            } else {
                // Fallback: use the Better Auth accountId as the profile identifier
                profileAccountId = linkedAccount.accountId;
                profileUsername = linkedAccount.accountId;
                profileAvatarUrl = undefined;
            }

            // 3. Upsert into connectedAccount (unique on userId + platform + accountId)
            const [upserted] = await ctx.db
                .insert(connectedAccount)
                .values({
                    userId: ctx.session.user.id,
                    platform: input.provider,
                    accountId: profileAccountId,
                    username: profileUsername,
                    avatarUrl: profileAvatarUrl,
                    accessToken: linkedAccount.accessToken,
                    refreshToken: linkedAccount.refreshToken ?? undefined,
                    expiresAt: linkedAccount.accessTokenExpiresAt ?? undefined,
                    status: "active",
                    lastRefreshed: new Date(),
                })
                .onConflictDoUpdate({
                    target: [connectedAccount.userId, connectedAccount.platform, connectedAccount.accountId],
                    set: {
                        username: profileUsername,
                        avatarUrl: profileAvatarUrl,
                        accessToken: linkedAccount.accessToken,
                        refreshToken: linkedAccount.refreshToken ?? null,
                        expiresAt: linkedAccount.accessTokenExpiresAt ?? null,
                        status: "active",
                        lastRefreshed: new Date(),
                        updatedAt: new Date(),
                    },
                })
                .returning();

            return upserted;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [deleted] = await ctx.db
                .delete(connectedAccount)
                .where(
                    and(
                        eq(connectedAccount.id, input.id),
                        eq(connectedAccount.userId, ctx.session.user.id),
                    ),
                )
                .returning();
            return deleted;
        }),
});
