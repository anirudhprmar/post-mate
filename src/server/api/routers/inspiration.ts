import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { inspiration } from "~/server/db/schema";

export const inspirationRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.query.inspiration.findMany({
            where: eq(inspiration.userId, ctx.session.user.id),
            orderBy: [desc(inspiration.createdAt)],
        });
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.inspiration.findFirst({
                where: and(
                    eq(inspiration.id, input.id),
                    eq(inspiration.userId, ctx.session.user.id),
                ),
            });
        }),

    create: protectedProcedure
        .input(
            z.object({
                sourceProfileUrl: z.string().url(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(inspiration)
                .values({
                    userId: ctx.session.user.id,
                    sourceProfileUrl: input.sourceProfileUrl,
                })
                .returning();
            return created;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [deleted] = await ctx.db
                .delete(inspiration)
                .where(
                    and(
                        eq(inspiration.id, input.id),
                        eq(inspiration.userId, ctx.session.user.id),
                    ),
                )
                .returning();
            return deleted;
        }),
});
