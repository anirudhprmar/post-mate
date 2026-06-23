import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { posts, post_targets } from "~/server/db/schema";
import { inngest } from "~/lib/inngest";

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
        } else if (tagName === "s" || tagName === "del" || tagName === "strike") {
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
          } else if (tagName === "s" || tagName === "del" || tagName === "strike") {
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

  publishNow: protectedProcedure
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

      const targets = await ctx.db.query.post_targets.findMany({
        where: eq(post_targets.postId, input.postId),
      });

      if (targets.length === 0) {
        throw new Error("No connected accounts selected for this post");
      }

      await inngest.send({
        name: "post/publish",
        data: { postId: input.postId },
      });

      await ctx.db
        .update(posts)
        .set({
          status: "publishing",
        })
        .where(eq(posts.id, input.postId));

      return { success: true, postId: input.postId };
    }),
});
