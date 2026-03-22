import { eq, sql, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { idea, draft, scheduledPost } from "~/server/db/schema";

export const dashboardRouter = createTRPCRouter({
    getStats: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        // Run counts in parallel for efficiency
        const [ideaCountResult, draftCountResult, scheduledCountResult, recentIdeas, recentDrafts, platformRows] =
            await Promise.all([
                ctx.db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(idea)
                    .where(eq(idea.userId, userId)),
                ctx.db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(draft)
                    .where(eq(draft.userId, userId)),
                ctx.db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(scheduledPost)
                    .where(
                        and(
                            eq(scheduledPost.userId, userId),
                            eq(scheduledPost.status, "pending"),
                        ),
                    ),
                ctx.db.query.idea.findMany({
                    where: eq(idea.userId, userId),
                    orderBy: [desc(idea.createdAt)],
                    limit: 5,
                }),
                ctx.db.query.draft.findMany({
                    where: eq(draft.userId, userId),
                    orderBy: [desc(draft.createdAt)],
                    limit: 3,
                    with: { idea: true },
                }),
                ctx.db
                    .select({
                        platform: draft.platform,
                        count: sql<number>`count(*)::int`,
                    })
                    .from(draft)
                    .where(eq(draft.userId, userId))
                    .groupBy(draft.platform),
            ]);

        return {
            ideaCount: ideaCountResult[0]?.count ?? 0,
            draftCount: draftCountResult[0]?.count ?? 0,
            scheduledCount: scheduledCountResult[0]?.count ?? 0,
            recentIdeas,
            recentDrafts,
            platformBreakdown: platformRows,
        };
    }),
});
