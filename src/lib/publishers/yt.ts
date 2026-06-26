
const YT_UPLOAD_API ="https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";
const YT_VIDEOS_API = "https://www.googleapis.com/youtube/v3/videos";

interface YtPublishResult {
  publishedUrl: string;
  platformPostId: string;
}


async function initiateResumableUpload(
  accessToken: string,
  title: string,
  description: string,
  mimeType: string,
  fileSizeBytes: number,
): Promise<string> {
  const res = await fetch(YT_UPLOAD_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": mimeType,
      "X-Upload-Content-Length": fileSizeBytes.toString(),
    },
    body: JSON.stringify({
      snippet: {
        title: title || "Untitled Video",
        description: description || "",
        // Default to "People & Blogs" category
        categoryId: "22",
      },
      status: {
        // "public" | "private" | "unlisted"
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `[YouTube] Failed to initiate resumable upload (${res.status}): ${errorText}`,
    );
  }

  const uploadUri = res.headers.get("Location");
  if (!uploadUri) {
    throw new Error(
      "[YouTube] No upload URI returned from resumable upload initiation",
    );
  }

  return uploadUri;
}

async function uploadVideoBytes(
  uploadUri: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const chunkSize = 8 * 1024 * 1024; // 8 MB chunks (must be 256 KB aligned)
  let offset = 0;
  let videoId: string | null = null;

  while (offset < buffer.length) {
    const chunk = buffer.subarray(offset, offset + chunkSize);
    const end = offset + chunk.length - 1;

    const res = await fetch(uploadUri, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
        "Content-Range": `bytes ${offset}-${end}/${buffer.length}`,
        "Content-Length": chunk.length.toString(),
      },
      body: new Uint8Array(chunk),
    });

    if (res.status === 308) {
      const rangeHeader = res.headers.get("Range");
      if (rangeHeader) {
        const lastByte = parseInt(rangeHeader.split("-")[1] ?? "0", 10);
        offset = lastByte + 1;
      } else {
        offset += chunk.length;
      }
      continue;
    }

    // 200 or 201 — upload complete
    if (res.status === 200 || res.status === 201) {
      const data = (await res.json()) as { id?: string };
      videoId = data.id ?? null;
      break;
    }

    // Anything else is an error
    const errorText = await res.text();
    throw new Error(
      `[YouTube] Chunk upload failed (${res.status}): ${errorText}`,
    );
  }

  if (!videoId) {
    throw new Error("[YouTube] Upload completed but no video ID was returned");
  }

  return videoId;
}

async function waitForVideoProcessing(
  videoId: string,
  accessToken: string,
): Promise<void> {
  const maxAttempts = 60; // up to 5 minutes (5s × 60)
  const intervalMs = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(
      `${YT_VIDEOS_API}?part=status&id=${encodeURIComponent(videoId)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `[YouTube] Failed to check video status (${res.status}): ${errorText}`,
      );
    }

    const data = (await res.json()) as {
      items?: { status?: { uploadStatus?: string; failureReason?: string } }[];
    };

    const status = data.items?.[0]?.status;
    if (!status) {
      throw new Error("[YouTube] Video not found after upload");
    }

    if (status.uploadStatus === "processed") {
      return;
    }

    if (status.uploadStatus === "failed") {
      throw new Error(
        `[YouTube] Video processing failed: ${status.failureReason ?? "Unknown reason"}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  console.warn(
    `[YouTube] Video ${videoId} is still processing after ${maxAttempts} attempts.`,
  );
}

async function updateVideoStatus(
  videoId: string,
  accessToken: string,
  title: string,
  description: string,
): Promise<void> {
  const res = await fetch(
    `${YT_VIDEOS_API}?part=snippet,status`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        id: videoId,
        snippet: {
          title: title || "Untitled Video",
          description: description || "",
          categoryId: "22",
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false,
          madeForKids: false,
        },
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `[YouTube] videos.update failed (${res.status}): ${errorText}`,
    );
  }
}

export async function publishToYouTube(
  title: string,
  description: string,
  accessToken: string,
  videoUrl: string,
  mimeType = "video/mp4",
): Promise<YtPublishResult> {
  const mediaResponse = await fetch(videoUrl);
  if (!mediaResponse.ok) {
    throw new Error(
      `[YouTube] Failed to download video from ${videoUrl}: ${mediaResponse.statusText}`,
    );
  }
  const buffer = Buffer.from(await mediaResponse.arrayBuffer());

  const uploadUri = await initiateResumableUpload(
    accessToken,
    title,
    description,
    mimeType,
    buffer.length,
  );

  const videoId = await uploadVideoBytes(uploadUri, buffer, mimeType);

  await waitForVideoProcessing(videoId, accessToken);

  await updateVideoStatus(videoId, accessToken, title, description);

  const publishedUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return { publishedUrl, platformPostId: videoId };
}
