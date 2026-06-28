import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

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

export async function downloadMediaFromR2(key: string): Promise<{
  buffer: Buffer;
  contentType: string;
  fileName: string;
}> {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error(`Media not found in storage: ${key}`);
  }

  const buffer = Buffer.from(await response.Body.transformToByteArray());
  const contentType = response.ContentType ?? "application/octet-stream";
  const fileName = key.split("/").pop() ?? "media";

  return { buffer, contentType, fileName };
}
