import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { posts, post_targets } from "~/server/db/schema";
import { inngest } from "~/lib/inngest";

export function htmlToPlainText(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(z.object({
            content: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const plainContent = htmlToPlainText(input.content);
            const [post] = await ctx.db.insert(posts).values({
                content: plainContent,
                userId: ctx.session.user.id,
            }).returning();
            return post!;
        }),
    confirmStatus: protectedProcedure
        .input(z.object({
            postId: z.string(),
            status: z.enum(["draft", "scheduled"]),
            scheduledFor: z.date().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (input.status === "scheduled") {
                if (!input.scheduledFor) {
                    throw new Error("A scheduled date is required when scheduling a post.");
                }
                if (input.scheduledFor <= new Date()) {
                    throw new Error("Scheduled time must be in the future.");
                }
            }

            await ctx.db.update(posts).set({
                status: input.status,
                scheduledFor: input.scheduledFor,
            }).where(eq(posts.id, input.postId));
        }),
    schedule: protectedProcedure
        .input(z.object({
            postId: z.string(),
            connectedAccountId: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(post_targets).values({
                postId: input.postId,
                connectedAccountId: input.connectedAccountId
            });
        }),

    /**
     * Publish a post immediately to all its targets.
     * Triggers the Inngest "post/publish" event which handles
     * the actual platform API calls asynchronously.
     */
    publishNow: protectedProcedure
        .input(z.object({
            postId: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Verify the post belongs to this user
            const post = await ctx.db.query.posts.findFirst({
                where: eq(posts.id, input.postId),
            });

            if (!post) {
                throw new Error("Post not found");
            }

            if (post.userId !== ctx.session.user.id) {
                throw new Error("Unauthorized");
            }

            // Verify there are targets configured
            const targets = await ctx.db.query.post_targets.findMany({
                where: eq(post_targets.postId, input.postId),
            });

            if (targets.length === 0) {
                throw new Error("No connected accounts selected for this post");
            }

            // Send the Inngest event to trigger async publishing
            await inngest.send({
                name: "post/publish",
                data: { postId: input.postId },
            });

            // Update status to publishing
            await ctx.db.update(posts).set({
                status: "publishing",
            }).where(eq(posts.id, input.postId));

            return { success: true, postId: input.postId };
        }),
})