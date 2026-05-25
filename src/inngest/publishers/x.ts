import { env } from "~/env";
import { buildOAuthHeader } from "~/lib/x-oauth";

interface XPublishResult {
  publishedUrl: string;
  platformPostId: string;
}

/**
 * Upload a single media item to X using the v1.1 media upload endpoint.
 * Uses chunked upload for all media types.
 *
 * @see https://developer.x.com/en/docs/x-api/v1/media/upload-media/api-reference/post-media-upload
 */
async function uploadMediaToX(
  mediaUrl: string,
  mimeType: string,
  accessToken: string,
  accessSecret: string,
): Promise<string> {
  const uploadUrl = "https://upload.x.com/1.1/media/upload.json";

  // Download media from our storage
  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    throw new Error(`Failed to download media from ${mediaUrl}: ${mediaResponse.statusText}`);
  }
  const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());

  // ── INIT ──────────────────────────────────────────────────────────────
  const initParams: Record<string, string> = {
    command: "INIT",
    total_bytes: mediaBuffer.length.toString(),
    media_type: mimeType,
  };

  const initAuth = buildOAuthHeader(
    "POST",
    uploadUrl,
    env.X_CONSUMER_KEY,
    env.X_CONSUMER_SECRET,
    accessToken,
    accessSecret,
    initParams,
  );

  const initRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: initAuth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(initParams).toString(),
  });

  if (!initRes.ok) {
    throw new Error(`X media INIT failed (${initRes.status}): ${await initRes.text()}`);
  }

  const initData = (await initRes.json()) as { media_id_string: string };
  const mediaId = initData.media_id_string;

  // ── APPEND (chunked, 5MB per chunk) ───────────────────────────────────
  const chunkSize = 5 * 1024 * 1024;
  for (let i = 0; i * chunkSize < mediaBuffer.length; i++) {
    const chunk = mediaBuffer.subarray(i * chunkSize, (i + 1) * chunkSize);

    const appendAuth = buildOAuthHeader(
      "POST",
      uploadUrl,
      env.X_CONSUMER_KEY,
      env.X_CONSUMER_SECRET,
      accessToken,
      accessSecret,
      // OAuth params only — media_data goes in the multipart body
    );

    const formData = new FormData();
    formData.append("command", "APPEND");
    formData.append("media_id", mediaId);
    formData.append("segment_index", i.toString());
    formData.append("media_data", chunk.toString("base64"));

    const appendRes = await fetch(uploadUrl, {
      method: "POST",
      headers: { Authorization: appendAuth },
      body: formData,
    });

    if (!appendRes.ok) {
      throw new Error(`X media APPEND failed (${appendRes.status}): ${await appendRes.text()}`);
    }
  }

  // ── FINALIZE ──────────────────────────────────────────────────────────
  const finalizeParams: Record<string, string> = {
    command: "FINALIZE",
    media_id: mediaId,
  };

  const finalizeAuth = buildOAuthHeader(
    "POST",
    uploadUrl,
    env.X_CONSUMER_KEY,
    env.X_CONSUMER_SECRET,
    accessToken,
    accessSecret,
    finalizeParams,
  );

  const finalizeRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: finalizeAuth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(finalizeParams).toString(),
  });

  if (!finalizeRes.ok) {
    throw new Error(`X media FINALIZE failed (${finalizeRes.status}): ${await finalizeRes.text()}`);
  }

  return mediaId;
}

/**
 * Publish a post to X using the v2 tweets endpoint with OAuth 1.0a auth.
 * Supports text-only and text+media posts.
 */
export async function publishToX(
  content: string,
  accessToken: string,
  accessSecret: string,
  media?: { url: string; key: string; type: "image" | "video"; mimeType?: string }[],
): Promise<XPublishResult> {
  const mediaIds: string[] = [];

  // Upload media if present
  if (media && media.length > 0) {
    for (const item of media) {
      try {
        const mimeType = item.mimeType ?? (item.type === "image" ? "image/jpeg" : "video/mp4");
        const mediaId = await uploadMediaToX(item.url, mimeType, accessToken, accessSecret);
        mediaIds.push(mediaId);
      } catch (err) {
        console.error(`[X] Failed to upload media ${item.key}:`, err);
      }
    }
  }

  // ── Post the tweet via v2 API ─────────────────────────────────────────
  const tweetUrl = "https://api.x.com/2/tweets";

  const tweetBody: Record<string, unknown> = { text: content };
  if (mediaIds.length > 0) {
    tweetBody.media = { media_ids: mediaIds };
  }

  const tweetAuth = buildOAuthHeader(
    "POST",
    tweetUrl,
    env.X_CONSUMER_KEY,
    env.X_CONSUMER_SECRET,
    accessToken,
    accessSecret,
  );

  const tweetRes = await fetch(tweetUrl, {
    method: "POST",
    headers: {
      Authorization: tweetAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetBody),
  });

  if (!tweetRes.ok) {
    const errorBody = await tweetRes.text();
    throw new Error(`X API error (${tweetRes.status}): ${errorBody}`);
  }

  const tweetData = (await tweetRes.json()) as { data: { id: string } };
  const tweetId = tweetData.data.id;

  // ── Build published URL ───────────────────────────────────────────────
  let publishedUrl = `https://x.com/i/status/${tweetId}`;

  try {
    const meUrl = "https://api.x.com/2/users/me";
    const meAuth = buildOAuthHeader(
      "GET",
      meUrl,
      env.X_CONSUMER_KEY,
      env.X_CONSUMER_SECRET,
      accessToken,
      accessSecret,
    );

    const meRes = await fetch(meUrl, {
      headers: { Authorization: meAuth },
    });

    if (meRes.ok) {
      const meData = (await meRes.json()) as { data: { username?: string } };
      if (meData.data?.username) {
        publishedUrl = `https://x.com/${meData.data.username}/status/${tweetId}`;
      }
    }
  } catch (e) {
    console.error("[X] Failed to fetch username for URL", e);
  }

  return {
    publishedUrl,
    platformPostId: tweetId,
  };
}
