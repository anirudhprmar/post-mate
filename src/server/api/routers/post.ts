import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { posts, post_targets } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(z.object({
            content: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const [post] = await ctx.db.insert(posts).values({
                content: input.content,
                userId: ctx.session.user.id,
            }).returning();
            return post!;
        }),
    confirmStatus: protectedProcedure
        .input(z.object({
            postId: z.string(),
            status: z.enum(["draft", "scheduled"]),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.update(posts).set({
                status: input.status,
            }).where(eq(posts.id, input.postId));
        }),
})