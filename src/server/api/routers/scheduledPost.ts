import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { scheduledPost } from "~/server/db/schema";

export const scheduledPostRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(
            z
                .object({
                    status: z.enum(["pending", "publishing", "published", "failed"]).optional(),
                })
                .optional(),
        )
        .query(async ({ ctx, input }) => {
            const conditions = [eq(scheduledPost.userId, ctx.session.user.id)];
            if (input?.status) {
                conditions.push(eq(scheduledPost.status, input.status));
            }
            return ctx.db.query.scheduledPost.findMany({
                where: and(...conditions),
                orderBy: [desc(scheduledPost.publishAt)],
                with: { draft: true },
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.scheduledPost.findFirst({
                where: and(
                    eq(scheduledPost.id, input.id),
                    eq(scheduledPost.userId, ctx.session.user.id),
                ),
                with: { draft: true },
            });
        }),

    create: protectedProcedure
        .input(
            z.object({
                draftId: z.string(),
                publishAt: z.date(),
                status: z.enum(["pending", "publishing", "published", "failed"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(scheduledPost)
                .values({
                    userId: ctx.session.user.id,
                    draftId: input.draftId,
                    publishAt: input.publishAt,
                    status: input.status,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                publishAt: z.date().optional(),
                status: z.enum(["pending", "publishing", "published", "failed"]).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(scheduledPost)
                .set(data)
                .where(
                    and(
                        eq(scheduledPost.id, id),
                        eq(scheduledPost.userId, ctx.session.user.id),
                    ),
                )
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [deleted] = await ctx.db
                .delete(scheduledPost)
                .where(
                    and(
                        eq(scheduledPost.id, input.id),
                        eq(scheduledPost.userId, ctx.session.user.id),
                    ),
                )
                .returning();
            return deleted;
        }),
});
