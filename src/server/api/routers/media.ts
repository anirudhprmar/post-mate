import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";
import { eq } from "drizzle-orm";

const s3Client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const mediaRouter = createTRPCRouter({
  createUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string(),
        fileType: z.enum(["image", "video"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = `${ctx.session.user.id}/${Date.now()}-${input.fileName}`; //images/input.filename
      const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        ContentType: input.contentType,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 5,
      });

      return {
        uploadUrl,
        key,
        fileType: input.fileType,
      };
    }),

  confirmUpload: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        media: z.array(
          z.object({
            url: z.string(),
            key: z.string(),
            type: z.enum(["image", "video"]),
            mimeType: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(posts)
        .set({
          media: input.media,
        })
        .where(eq(posts.id, input.postId));
    }),

  createDownloadUrl: protectedProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const command = new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: input.key,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
      return { url };
    }),
});
