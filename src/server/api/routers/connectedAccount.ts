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
        where: eq(connectedAccount.id, input.id),
      });
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
