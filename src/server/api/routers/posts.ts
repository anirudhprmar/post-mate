import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { posts, post_targets, connectedAccount } from "~/server/db/schema";
import { qstash } from "~/lib/qstash";
import { env } from "~/env";
import { publishToX } from "~/lib/publishers/x";
import { publishToLinkedIn } from "~/lib/publishers/linkedin";
import { publishToInsta } from "~/lib/publishers/instagram";
import { publishToThreads } from "~/lib/publishers/threads";
import { publishToYouTube } from "~/lib/publishers/yt";
import { publishToFacebook } from "~/lib/publishers/fb";
import { refreshAccountToken } from "~/lib/social-oauth/refresh";

function toBold(char: string): string {
  const code = char.codePointAt(0);
  if (!code) return char;
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(code + 119743);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(code + 119737);
  }
  if (code >= 48 && code <= 57) {
    return String.fromCodePoint(code + 120734);
  }
  return char;
}

function toItalic(char: string): string {
  const code = char.codePointAt(0);
  if (!code) return char;
  if (char === "h") return "\u210e";
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(code + 119795);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(code + 119789);
  }
  return char;
}

function toBoldItalic(char: string): string {
  const code = char.codePointAt(0);
  if (!code) return char;
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(code + 119847);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(code + 119841);
  }
  return char;
}

interface FormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
}

function formatChar(char: string, state: FormattingState): string {
  let result = char;

  if (state.bold && state.italic) {
    result = toBoldItalic(char);
  } else if (state.bold) {
    result = toBold(char);
  } else if (state.italic) {
    result = toItalic(char);
  }

  if (state.underline) {
    result = result + "\u0332";
  }

  if (state.strike) {
    result = result + "\u0336";
  }

  return result;
}

function formatText(text: string, state: FormattingState): string {
  let result = "";
  for (const char of text) {
    if (char === "\n" || char === "\r") {
      result += char;
      continue;
    }
    const codePoint = char.codePointAt(0);
    if (codePoint !== undefined && codePoint > 127) {
      let formattedEmoji = char;
      if (state.underline) {
        formattedEmoji += "\u0332";
      }
      if (state.strike) {
        formattedEmoji += "\u0336";
      }
      result += formattedEmoji;
    } else {
      result += formatChar(char, state);
    }
  }
  return result;
}

export function htmlToPlainText(html: string): string {
  let result = "";
  let i = 0;

  const state = {
    bold: 0,
    italic: 0,
    underline: 0,
    strike: 0,
  };

  function getFormattingState(): FormattingState {
    return {
      bold: state.bold > 0,
      italic: state.italic > 0,
      underline: state.underline > 0,
      strike: state.strike > 0,
    };
  }

  while (i < html.length) {
    if (html[i] === "<") {
      const start = i;
      const end = html.indexOf(">", start);
      if (end === -1) {
        result += html.substring(start);
        break;
      }

      const tagContent = html.substring(start + 1, end).trim();
      i = end + 1;

      const isClosing = tagContent.startsWith("/");
      const tagNameMatch = tagContent.match(/^\/?([a-zA-Z0-9]+)/);
      const tagName = tagNameMatch?.[1] ? tagNameMatch[1].toLowerCase() : "";

      if (isClosing) {
        if (tagName === "strong" || tagName === "b") {
          state.bold = Math.max(0, state.bold - 1);
        } else if (tagName === "em" || tagName === "i") {
          state.italic = Math.max(0, state.italic - 1);
        } else if (tagName === "u") {
          state.underline = Math.max(0, state.underline - 1);
        } else if (
          tagName === "s" ||
          tagName === "del" ||
          tagName === "strike"
        ) {
          state.strike = Math.max(0, state.strike - 1);
        } else if (tagName === "p" || tagName === "li") {
          result += "\n";
        }
      } else {
        const isSelfClosing = tagContent.endsWith("/");
        if (!isSelfClosing) {
          if (tagName === "strong" || tagName === "b") {
            state.bold++;
          } else if (tagName === "em" || tagName === "i") {
            state.italic++;
          } else if (tagName === "u") {
            state.underline++;
          } else if (
            tagName === "s" ||
            tagName === "del" ||
            tagName === "strike"
          ) {
            state.strike++;
          }
        }

        if (tagName === "br") {
          result += "\n";
        }
      }
    } else {
      const start = i;
      const nextTag = html.indexOf("<", start);
      const textEnd = nextTag === -1 ? html.length : nextTag;
      const text = html.substring(start, textEnd);
      i = textEnd;

      const decodedText = text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, " ");

      result += formatText(decodedText, getFormattingState());
    }
  }

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

export const postRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany({
      where: eq(posts.userId, ctx.session.user.id),
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      with: {
        targets: {
          with: {
            connectedAccount: true,
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          targets: {
            with: {
              connectedAccount: true,
            },
          },
        },
      });
    }),

  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const plainContent = htmlToPlainText(input.content);
      const [post] = await ctx.db
        .insert(posts)
        .values({
          content: plainContent,
          userId: ctx.session.user.id,
        })
        .returning();
      return post!;
    }),

  confirmStatus: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        status: z.enum(["draft", "scheduled"]),
        scheduledFor: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.status === "scheduled") {
        if (!input.scheduledFor) {
          throw new Error(
            "A scheduled date is required when scheduling a post.",
          );
        }
        if (input.scheduledFor <= new Date()) {
          throw new Error("Scheduled time must be in the future.");
        }
      }

      await ctx.db
        .update(posts)
        .set({
          status: input.status,
          scheduledFor: input.scheduledFor,
        })
        .where(eq(posts.id, input.postId));
    }),

  schedule: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        connectedAccountId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(post_targets).values({
        postId: input.postId,
        connectedAccountId: input.connectedAccountId,
      });
    }),

  publishNow: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.status === "published") {
        return { success: true, postId: input.postId, message: "Already published" };
      }

      const targets = await ctx.db.query.post_targets.findMany({
        where: eq(post_targets.postId, input.postId),
        with: { connectedAccount: true },
      });

      if (targets.length === 0) {
        throw new Error("No connected accounts selected for this post");
      }

      await ctx.db
        .update(posts)
        .set({ status: "publishing" })
        .where(eq(posts.id, input.postId));

      type PostMedia = {
        url: string;
        key: string;
        type: "image" | "video";
        mimeType?: string;
        thumbnailUrl?: string;
      };
      const media = (post.media as PostMedia[] | null) ?? [];

      const results = await Promise.allSettled(
        targets.map(async (target) => {
          const account = target.connectedAccount;
          await ctx.db
            .update(post_targets)
            .set({ status: "publishing" })
            .where(eq(post_targets.id, target.id));

          if (account.platform !== "x" && account.expiresAt) {
            const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
            if (account.expiresAt <= twoHoursFromNow) {
              await refreshAccountToken(account.id);
              const refreshed = await ctx.db.query.connectedAccount.findFirst({
                where: eq(connectedAccount.id, account.id),
              });
              if (refreshed) Object.assign(account, refreshed);
            }
          }

          try {
            let publishedUrl: string;
            switch (account.platform) {
              case "x": {
                const pd = account.platformSpecificData as {
                  oauthTokenSecret?: string;
                } | null;
                if (!pd?.oauthTokenSecret)
                  throw new Error("Missing OAuth token secret for X");
                const res = await publishToX(
                  post.content,
                  account.accessToken,
                  pd.oauthTokenSecret,
                  media.length > 0 ? media : undefined,
                );
                publishedUrl = res.publishedUrl;
                break;
              }
              case "linkedin": {
                const res = await publishToLinkedIn(
                  post.content,
                  account.accessToken,
                  account.accountId,
                  media.length > 0 ? media : undefined,
                );
                publishedUrl = res.publishedUrl;
                break;
              }
              case "instagram": {
                if (media.length === 0)
                  throw new Error("Instagram requires at least one image or video");
                let mediaType: "REELS" | "CAROUSEL" | "STORIES" | "IMAGE";
                if (media.length > 1) mediaType = "CAROUSEL";
                else if (media[0]?.type === "video") mediaType = "REELS";
                else mediaType = "IMAGE";
                const res = await publishToInsta(
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
                publishedUrl = res.publishedUrl;
                break;
              }
              case "threads": {
                const res = await publishToThreads(
                  post.content,
                  account.accessToken,
                  account.accountId,
                  media.length > 0 ? media : undefined,
                );
                publishedUrl = res.publishedUrl;
                break;
              }
              case "youtube": {
                const videoItem = media.find((m) => m.type === "video");
                if (!videoItem) {
                  throw new Error("YouTube requires a video file");
                }
                const ytTitle = post.content
                  .split("\n")[0]
                  ?.trim()
                  .slice(0, 100) || "Untitled Video";
                const res = await publishToYouTube(
                  ytTitle,
                  post.content,
                  account.accessToken,
                  videoItem.url,
                  videoItem.mimeType ?? "video/mp4",
                );
                publishedUrl = res.publishedUrl;
                break;
              }
              case "facebook": {
                const pd = account.platformSpecificData as {
                  pageAccessToken?: string;
                  pageId?: string;
                } | null;
                const pageAccessToken =
                  pd?.pageAccessToken ?? account.accessToken;
                const pageId = pd?.pageId ?? account.accountId;
                if (!pageAccessToken || !pageId)
                  throw new Error("Missing page access token or page ID for Facebook");
                const res = await publishToFacebook(
                  post.content,
                  pageAccessToken,
                  pageId,
                  media.length > 0 ? media : undefined,
                );
                publishedUrl = res.publishedUrl;
                break;
              }
              default:
                throw new Error(`Unsupported platform: ${account.platform}`);
            }
            await ctx.db
              .update(post_targets)
              .set({ status: "published", publishedUrl, postedAt: new Date() })
              .where(eq(post_targets.id, target.id));
            return {
              targetId: target.id,
              platform: account.platform,
              status: "published" as const,
              publishedUrl,
            };
          } catch (error) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            await ctx.db
              .update(post_targets)
              .set({ status: "failed", errorMessage: msg })
              .where(eq(post_targets.id, target.id));
            return {
              targetId: target.id,
              platform: account.platform,
              status: "failed" as const,
              error: msg,
            };
          }
        }),
      );

      const outcomes = results.map((r) =>
        r.status === "fulfilled" ? r.value : { status: "failed" as const },
      );
      const allPublished = outcomes.every((o) => o.status === "published");
      const allFailed = outcomes.every((o) => o.status === "failed");
      const finalStatus = allPublished
        ? "published"
        : allFailed
          ? "failed"
          : "partially_failed";

      await ctx.db
        .update(posts)
        .set({
          status: finalStatus,
          publishedAt: finalStatus !== "failed" ? new Date() : undefined,
        })
        .where(eq(posts.id, input.postId));

      return { success: true, postId: input.postId, finalStatus };
    }),

  schedulePublish: protectedProcedure
    .input(z.object({ postId: z.string(), scheduledAtMs: z.number().optional() }))
    .mutation(async ({ input }) => {
      const now = Date.now();
      const delayMs = input.scheduledAtMs ? input.scheduledAtMs - now : 0;
      const delaySec = Math.max(Math.ceil(delayMs / 1000), 0);
      await qstash.publishJSON({
        url: `${env.NEXT_PUBLIC_APP_URL}/api/publish`,
        body: { postId: input.postId },
        delay: delaySec,
        retries: 3,
      });
    }),

  retrySchedule: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
      });

      if (!post) throw new Error("Post not found");
      if (post.userId !== ctx.session.user.id) throw new Error("Unauthorized");
      if (post.status === "published") {
        throw new Error("Post is already published");
      }

      const delayMs = post.scheduledFor
        ? post.scheduledFor.getTime() - Date.now()
        : 0;
      const delaySec = Math.max(Math.ceil(delayMs / 1000), 0);

      await qstash.publishJSON({
        url: `${env.NEXT_PUBLIC_APP_URL}/api/publish`,
        body: { postId: input.postId },
        delay: delaySec,
        retries: 3,
      });
    }),
});

