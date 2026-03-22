import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectedAccount } from "~/server/db/schema";

export const connectedAccountRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.query.connectedAccount.findMany({
            where: eq(connectedAccount.userId, ctx.session.user.id),
            orderBy: [desc(connectedAccount.createdAt)],
        });
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.connectedAccount.findFirst({
                where: and(
                    eq(connectedAccount.id, input.id),
                    eq(connectedAccount.userId, ctx.session.user.id),
                ),
            });
        }),

    create: protectedProcedure
        .input(
            z.object({
                username: z.string().min(1),
                platform: z.string().min(1),
                platformUserId: z.string().min(1),
                accessToken: z.string().min(1),
                refreshToken: z.string().optional(),
                tokenExpiresAt: z.date().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(connectedAccount)
                .values({
                    userId: ctx.session.user.id,
                    username: input.username,
                    platform: input.platform,
                    platformUserId: input.platformUserId,
                    accessToken: input.accessToken,
                    refreshToken: input.refreshToken,
                    tokenExpiresAt: input.tokenExpiresAt,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                username: z.string().min(1).optional(),
                accessToken: z.string().min(1).optional(),
                refreshToken: z.string().nullable().optional(),
                tokenExpiresAt: z.date().nullable().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(connectedAccount)
                .set(data)
                .where(
                    and(
                        eq(connectedAccount.id, id),
                        eq(connectedAccount.userId, ctx.session.user.id),
                    ),
                )
                .returning();
            return updated;
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
