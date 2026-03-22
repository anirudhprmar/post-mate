import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { draft } from "~/server/db/schema";

export const draftRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({ ideaId: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
            const conditions = [eq(draft.userId, ctx.session.user.id)];
            if (input?.ideaId) {
                conditions.push(eq(draft.ideaId, input.ideaId));
            }
            return ctx.db.query.draft.findMany({
                where: and(...conditions),
                orderBy: [desc(draft.createdAt)],
                with: { idea: true, scheduledPosts: true },
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.draft.findFirst({
                where: and(eq(draft.id, input.id), eq(draft.userId, ctx.session.user.id)),
                with: { idea: true, scheduledPosts: true },
            });
        }),

    create: protectedProcedure
        .input(
            z.object({
                ideaId: z.string(),
                content: z.string().min(1),
                platform: z.string().min(1),
                status: z.enum(["writing", "review", "ready", "published"]),
                media: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(draft)
                .values({
                    userId: ctx.session.user.id,
                    ideaId: input.ideaId,
                    content: input.content,
                    platform: input.platform,
                    status: input.status,
                    media: input.media,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                content: z.string().min(1).optional(),
                status: z.enum(["writing", "review", "ready", "published"]).optional(),
                media: z.string().nullable().optional(),
                platform: z.string().min(1).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(draft)
                .set(data)
                .where(and(eq(draft.id, id), eq(draft.userId, ctx.session.user.id)))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [deleted] = await ctx.db
                .delete(draft)
                .where(and(eq(draft.id, input.id), eq(draft.userId, ctx.session.user.id)))
                .returning();
            return deleted;
        }),
});
