import { and, eq, lte } from "drizzle-orm";
import { inngest } from "~/lib/inngest";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export const checkScheduledPosts = inngest.createFunction(
  {
    id: "post.check-scheduled",
    name: "Check Scheduled Posts",
    triggers: [{ cron: "* * * * *" }],
  },
  async ({ step }: { step: any }) => {
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
