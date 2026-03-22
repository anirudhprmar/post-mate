import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { idea } from "~/server/db/schema";

export const ideaRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.query.idea.findMany({
            where: eq(idea.userId, ctx.session.user.id),
            orderBy: [desc(idea.createdAt)],
            with: { drafts: true },
        });
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.idea.findFirst({
                where: and(eq(idea.id, input.id), eq(idea.userId, ctx.session.user.id)),
                with: { drafts: true },
            });
        }),

    create: protectedProcedure
        .input(
            z.object({
                content: z.string().min(1),
                status: z.enum(["raw", "refined", "drafting", "done"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(idea)
                .values({
                    userId: ctx.session.user.id,
                    content: input.content,
                    status: input.status,
                })
                .returning();
            return created;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                content: z.string().min(1).optional(),
                status: z.enum(["raw", "refined", "drafting", "done"]).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            const [updated] = await ctx.db
                .update(idea)
                .set(data)
                .where(and(eq(idea.id, id), eq(idea.userId, ctx.session.user.id)))
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [deleted] = await ctx.db
                .delete(idea)
                .where(and(eq(idea.id, input.id), eq(idea.userId, ctx.session.user.id)))
                .returning();
            return deleted;
        }),
});
