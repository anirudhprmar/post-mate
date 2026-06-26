import { downloadMediaFromR2 } from "~/lib/r2-download";

interface FBPublishResult {
  publishedUrl: string;
  platformPostId: string;
}

interface FBMediaItem {
  url: string;
  key: string;
  type: "image" | "video";
  mimeType?: string;
}

function parseFacebookError(errorText: string): string {
  try {
    const parsed = JSON.parse(errorText) as {
      error?: { message: string; code?: number; type?: string };
    };
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // keep raw text
  }
  return errorText;
}

function bufferToBlobPart(buffer: Buffer): BlobPart {
  return new Uint8Array(buffer);
}

async function loadMediaFile(media: FBMediaItem) {
  try {
    return await downloadMediaFromR2(media.key);
  } catch (r2Error) {
    const res = await fetch(media.url);
    if (!res.ok) {
      throw new Error(
        `Failed to load media for Facebook (${media.key}): ${r2Error instanceof Error ? r2Error.message : "R2 error"}; URL fetch ${res.status}`,
      );
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return {
      buffer,
      contentType:
        media.mimeType ??
        res.headers.get("content-type") ??
        "application/octet-stream",
      fileName: media.key.split("/").pop() ?? "media",
    };
  }
}

async function publishTextToPage(
  message: string,
  pageAccessToken: string,
  pageId: string,
): Promise<FBPublishResult> {
  const res = await fetch(
    `https://graph.facebook.com/v25.0/${pageId}/feed?${new URLSearchParams({
      access_token: pageAccessToken,
    })}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Facebook text post failed (${res.status}): ${parseFacebookError(errorText)}`,
    );
  }

  const data = (await res.json()) as { id: string };
  const postId = data.id;

  return {
    platformPostId: postId,
    publishedUrl: `https://www.facebook.com/${postId.replace("_", "/posts/")}`,
  };
}

async function publishSinglePhotoToPage(
  caption: string,
  pageAccessToken: string,
  pageId: string,
  media: FBMediaItem,
): Promise<FBPublishResult> {
  const { buffer, contentType, fileName } = await loadMediaFile(media);

  const form = new FormData();
  form.append("access_token", pageAccessToken);
  if (caption) form.append("caption", caption);
  form.append(
    "source",
    new Blob([bufferToBlobPart(buffer)], { type: contentType }),
    fileName,
  );

  const res = await fetch(`https://graph.facebook.com/v25.0/${pageId}/photos`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Facebook photo post failed (${res.status}): ${parseFacebookError(errorText)}`,
    );
  }

  const data = (await res.json()) as { id: string; post_id?: string };
  const postId = data.post_id ?? data.id;

  return {
    platformPostId: postId,
    publishedUrl: `https://www.facebook.com/${postId.replace("_", "/posts/")}`,
  };
}

async function publishMultiPhotoToPage(
  message: string,
  pageAccessToken: string,
  pageId: string,
  mediaItems: FBMediaItem[],
): Promise<FBPublishResult> {
  const photoIds: string[] = [];

  for (const media of mediaItems) {
    const { buffer, contentType, fileName } = await loadMediaFile(media);

    const form = new FormData();
    form.append("access_token", pageAccessToken);
    form.append("published", "false");
    form.append(
      "source",
      new Blob([bufferToBlobPart(buffer)], { type: contentType }),
      fileName,
    );

    const uploadRes = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}/photos`,
      { method: "POST", body: form },
    );

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(
        `Facebook photo upload failed (${uploadRes.status}): ${parseFacebookError(errorText)}`,
      );
    }

    const uploadData = (await uploadRes.json()) as { id: string };
    photoIds.push(uploadData.id);
  }

  const attached_media = photoIds.map((id) => ({ media_fbid: id }));

  const feedRes = await fetch(
    `https://graph.facebook.com/v25.0/${pageId}/feed?${new URLSearchParams({
      access_token: pageAccessToken,
    })}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, attached_media }),
    },
  );

  if (!feedRes.ok) {
    const errorText = await feedRes.text();
    throw new Error(
      `Facebook multi-photo post failed (${feedRes.status}): ${parseFacebookError(errorText)}`,
    );
  }

  const data = (await feedRes.json()) as { id: string };
  const postId = data.id;

  return {
    platformPostId: postId,
    publishedUrl: `https://www.facebook.com/${postId.replace("_", "/posts/")}`,
  };
}

async function publishVideoToPage(
  description: string,
  pageAccessToken: string,
  pageId: string,
  media: FBMediaItem,
): Promise<FBPublishResult> {
  const { buffer, contentType, fileName } = await loadMediaFile(media);

  const form = new FormData();
  form.append("access_token", pageAccessToken);
  if (description) form.append("description", description);
  form.append(
    "source",
    new Blob([bufferToBlobPart(buffer)], { type: contentType }),
    fileName,
  );

  const res = await fetch(`https://graph.facebook.com/v25.0/${pageId}/videos`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Facebook video post failed (${res.status}): ${parseFacebookError(errorText)}`,
    );
  }

  const data = (await res.json()) as { id: string };
  const videoId = data.id;

  return {
    platformPostId: videoId,
    publishedUrl: `https://www.facebook.com/video.php?v=${videoId}`,
  };
}

export async function publishToFacebook(
  content: string,
  pageAccessToken: string,
  pageId: string,
  media?: FBMediaItem[],
): Promise<FBPublishResult> {
  const imageMedia = media?.filter((m) => m.type === "image") ?? [];
  const videoMedia = media?.filter((m) => m.type === "video") ?? [];

  if (videoMedia.length > 0) {
    return publishVideoToPage(
      content,
      pageAccessToken,
      pageId,
      videoMedia[0]!,
    );
  }

  if (imageMedia.length === 1) {
    return publishSinglePhotoToPage(
      content,
      pageAccessToken,
      pageId,
      imageMedia[0]!,
    );
  }

  if (imageMedia.length > 1) {
    return publishMultiPhotoToPage(
      content,
      pageAccessToken,
      pageId,
      imageMedia,
    );
  }

  return publishTextToPage(content, pageAccessToken, pageId);
}
