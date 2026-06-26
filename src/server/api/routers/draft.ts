import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { drafts } from "~/server/db/schema";
import { htmlToPlainText } from "./posts";

const platformEnum = z.enum([
  "instagram",
  "x",
  "facebook",
  "linkedin",
  "youtube",
  "threads",
]);

const mediaSchema = z.array(
  z.object({
    url: z.string(),
    key: z.string(),
    type: z.enum(["image", "video"]),
    mimeType: z.string().optional(),
    thumbnailUrl: z.string().optional(),
  }),
);

export const draftRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const conditions = [eq(drafts.userId, ctx.session.user.id)];

    return ctx.db.query.drafts.findMany({
      where: and(...conditions),
      orderBy: [desc(drafts.createdAt)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.drafts.findFirst({
        where: and(
          eq(drafts.id, input.id),
          eq(drafts.userId, ctx.session.user.id),
        ),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        platform: platformEnum,
        status: z.enum(["draft", "published"]).default("draft"),
        media: mediaSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(drafts)
        .values({
          userId: ctx.session.user.id,
          content: htmlToPlainText(input.content),
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
        status: z.enum(["draft", "published"]).optional(),
        media: mediaSchema.nullable().optional(),
        platform: platformEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(drafts)
        .set(data)
        .where(and(eq(drafts.id, id), eq(drafts.userId, ctx.session.user.id)))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(drafts)
        .where(
          and(eq(drafts.id, input.id), eq(drafts.userId, ctx.session.user.id)),
        )
        .returning();
      return deleted;
    }),
});
