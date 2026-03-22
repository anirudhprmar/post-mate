import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { niche } from "~/server/db/schema";

export const nicheRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.query.niche.findFirst({
            where: eq(niche.userId, ctx.session.user.id),
        });
    }),

    upsert: protectedProcedure
        .input(
            z.object({
                name: z.array(z.string().min(1)).min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db.query.niche.findFirst({
                where: eq(niche.userId, ctx.session.user.id),
            });

            if (existing) {
                const [updated] = await ctx.db
                    .update(niche)
                    .set({ name: input.name })
                    .where(eq(niche.id, existing.id))
                    .returning();
                return updated;
            }

            const [created] = await ctx.db
                .insert(niche)
                .values({
                    userId: ctx.session.user.id,
                    name: input.name,
                })
                .returning();
            return created;
        }),
});
