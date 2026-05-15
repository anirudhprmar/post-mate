import { and, eq, lte } from "drizzle-orm";
import { inngest } from "~/lib/inngest";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

/**
 * Inngest cron function: Check for scheduled posts that are due.
 *
 * Runs every minute and triggers the "post/publish" event for any
 * posts whose scheduledFor time has passed and are still in "scheduled" status.
 */
export const checkScheduledPosts = inngest.createFunction(
  {
    id: "post.check-scheduled",
    name: "Check Scheduled Posts",
    triggers: [{ cron: "* * * * *" }],
  },
  async ({ step }: { step: any }) => {
    // Find all posts that are scheduled and due
    const duePosts = await step.run("find-due-posts", async () => {
      return db.query.posts.findMany({
        where: and(
          eq(posts.status, "scheduled"),
          lte(posts.scheduledFor, new Date()),
        ),
      });
    });

    if (duePosts.length === 0) {
      return { message: "No scheduled posts due", count: 0 };
    }

    // Trigger a publish event for each due post
    const events = duePosts.map((post: any) => ({
      name: "post/publish" as const,
      data: { postId: post.id },
    }));

    await step.sendEvent("trigger-publish-events", events);

    return {
      message: `Triggered publishing for ${duePosts.length} post(s)`,
      count: duePosts.length,
      postIds: duePosts.map((p: any) => p.id),
    };
  },
);
