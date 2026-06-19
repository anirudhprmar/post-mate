import { eq } from "drizzle-orm";
import { inngest } from "~/lib/inngest";
import { db } from "~/server/db";
import { posts, post_targets } from "~/server/db/schema";
import { publishToX } from "~/inngest/publishers/x";
import { publishToLinkedIn } from "~/inngest/publishers/linkedin";
import { publishToInsta } from "~/inngest/publishers/instagram";

type PostMedia = {
  url: string;
  key: string;
  type: "image" | "video";
  mimeType?: string;
  thumbnailUrl?: string;
};

export const publishPost = inngest.createFunction(
  {
    id: "post.publish",
    name: "Publish Scheduled Post",
    retries: 3,
    triggers: [{ event: "post/publish" }],
  },
  async ({
    event,
    step,
  }: {
    event: { data: { postId: string } };
    step: any;
  }) => {
    const { postId } = event.data;

    const post = await step.run("fetch-post", async () => {
      const result = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });

      if (!result) {
        throw new Error(`Post ${postId} not found`);
      }

      if (result.status === "published") {
        throw new Error(`Post ${postId} is already published`);
      }

      return result;
    });

    const targets = await step.run("fetch-targets", async () => {
      const results = await db.query.post_targets.findMany({
        where: eq(post_targets.postId, postId),
        with: {
          connectedAccount: true,
        },
      });

      if (results.length === 0) {
        throw new Error(`Post ${postId} has no targets configured`);
      }

      return results;
    });

    await step.run("mark-post-publishing", async () => {
      await db
        .update(posts)
        .set({ status: "publishing" })
        .where(eq(posts.id, postId));
    });

    const results = await Promise.allSettled(
      targets.map((target: any) =>
        step.run(
          `publish-to-${target.connectedAccount.platform}-${target.id}`,
          async () => {
            await db
              .update(post_targets)
              .set({ status: "publishing" })
              .where(eq(post_targets.id, target.id));

            const account = target.connectedAccount;
            const media = (post.media as PostMedia[] | null) ?? [];

            try {
              let publishedUrl: string;

              switch (account.platform) {
                case "x": {
                  const platformData = account.platformSpecificData as {
                    oauthTokenSecret?: string;
                  } | null;
                  const oauthTokenSecret = platformData?.oauthTokenSecret;
                  if (!oauthTokenSecret) {
                    throw new Error("Missing OAuth token secret for X account");
                  }

                  const result = await publishToX(
                    post.content,
                    account.accessToken,
                    oauthTokenSecret,
                    media.length > 0 ? media : undefined,
                  );
                  publishedUrl = result.publishedUrl;
                  break;
                }

                case "linkedin": {
                  const result = await publishToLinkedIn(
                    post.content,
                    account.accessToken,
                    account.accountId,
                    media.length > 0 ? media : undefined,
                  );
                  publishedUrl = result.publishedUrl;
                  break;
                }

                case "instagram": {
                  if (media.length === 0) {
                    throw new Error(
                      "Instagram requires at least one image or video to publish",
                    );
                  }

                  let mediaType: "REELS" | "CAROUSEL" | "STORIES" | "IMAGE";
                  if (media.length > 1) {
                    mediaType = "CAROUSEL";
                  } else if (media[0]?.type === "video") {
                    mediaType = "REELS";
                  } else {
                    mediaType = "IMAGE";
                  }

                  const result = await publishToInsta(
                    mediaType,
                    post.content,
                    account.accessToken,
                    account.accountId,
                    media.map((m) => ({
                      url: m.url,
                      key: m.key,
                      type: m.type,
                      mimeType: m.mimeType,
                      coverUrl: m.thumbnailUrl,
                    })),
                  );
                  publishedUrl = result.publishedUrl;
                  break;
                }

                default:
                  throw new Error(`Unsupported platform: ${account.platform}`);
              }

              await db
                .update(post_targets)
                .set({
                  status: "published",
                  publishedUrl,
                  postedAt: new Date(),
                })
                .where(eq(post_targets.id, target.id));

              return {
                targetId: target.id,
                platform: account.platform,
                status: "published" as const,
                publishedUrl,
              };
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";

              await db
                .update(post_targets)
                .set({
                  status: "failed",
                  errorMessage,
                })
                .where(eq(post_targets.id, target.id));

              return {
                targetId: target.id,
                platform: account.platform,
                status: "failed" as const,
                error: errorMessage,
              };
            }
          },
        ),
      ),
    );

    await step.run("finalize-post-status", async () => {
      const outcomes = results.map((r) =>
        r.status === "fulfilled" ? r.value : { status: "failed" as const },
      );

      const allPublished = outcomes.every((o: any) => o.status === "published");
      const allFailed = outcomes.every((o: any) => o.status === "failed");

      let finalStatus: "published" | "failed" | "partially_failed";

      if (allPublished) {
        finalStatus = "published";
      } else if (allFailed) {
        finalStatus = "failed";
      } else {
        finalStatus = "partially_failed";
      }

      await db
        .update(posts)
        .set({
          status: finalStatus,
          publishedAt: finalStatus !== "failed" ? new Date() : undefined,
        })
        .where(eq(posts.id, postId));

      return { postId, finalStatus, outcomes };
    });
  },
);
