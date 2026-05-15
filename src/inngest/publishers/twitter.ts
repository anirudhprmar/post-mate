interface TwitterPublishResult {
  publishedUrl: string;
  platformPostId: string;
}

interface TwitterMediaUploadResult {
  media_id_string: string;
}

/**
 * Upload media to Twitter using the v1.1 chunked upload endpoint.
 * Twitter API v2 still requires the v1.1 media upload for images/videos.
 *
 * Note: For OAuth 2.0 PKCE (user-context), media upload requires
 * the tweet.read, tweet.write, and users.read scopes.
 * Images must use the v1.1 endpoint with OAuth 1.0a or the newer
 * media upload v2 endpoint if available.
 *
 * For simplicity, we upload via the simple (non-chunked) method for images.
 */
async function uploadMediaToTwitter(
  mediaUrl: string,
  mimeType: string,
  accessToken: string,
): Promise<string> {
  // Download the media from our R2 storage
  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    throw new Error(`Failed to download media from ${mediaUrl}: ${mediaResponse.statusText}`);
  }
  const mediaBuffer = await mediaResponse.arrayBuffer();
  const mediaBase64 = Buffer.from(mediaBuffer).toString("base64");

  // Use v1.1 media/upload (simple) — requires OAuth 1.0a
  // Since we're using OAuth 2.0, we'll use the v2-compatible approach
  // Twitter's media upload v1.1 with OAuth 2.0 Bearer token
  const formData = new FormData();
  formData.append("media_data", mediaBase64);

  const uploadRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Twitter media upload failed (${uploadRes.status}): ${errorText}`);
  }

  const uploadData = (await uploadRes.json()) as TwitterMediaUploadResult;
  return uploadData.media_id_string;
}

/**
 * Publish a tweet using Twitter API v2.
 * Supports text-only and text+media tweets.
 */
export async function publishToTwitter(
  content: string,
  accessToken: string,
  media?: { url: string; key: string; type: "image" | "video"; mimeType?: string }[],
): Promise<TwitterPublishResult> {
  // Build the tweet payload
  const tweetPayload: {
    text: string;
    media?: { media_ids: string[] };
  } = {
    text: content,
  };

  // Upload media if present
  if (media && media.length > 0) {
    const mediaIds: string[] = [];
    for (const item of media) {
      try {
        const mediaId = await uploadMediaToTwitter(
          item.url,
          item.mimeType ?? (item.type === "image" ? "image/jpeg" : "video/mp4"),
          accessToken,
        );
        mediaIds.push(mediaId);
      } catch (err) {
        console.error(`[Twitter] Failed to upload media ${item.key}:`, err);
        // Continue without this media item
      }
    }
    if (mediaIds.length > 0) {
      tweetPayload.media = { media_ids: mediaIds };
    }
  }

  // Post the tweet via v2 API
  const res = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetPayload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Twitter API error (${res.status}): ${errorBody}`);
  }

  const data = (await res.json()) as {
    data: {
      id: string;
      text: string;
    };
  };

  const tweetId = data.data.id;

  // We need the username to build the URL. Fetch it.
  const userRes = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let publishedUrl = `https://twitter.com/i/status/${tweetId}`;

  if (userRes.ok) {
    const userData = (await userRes.json()) as {
      data: { username: string };
    };
    publishedUrl = `https://twitter.com/${userData.data.username}/status/${tweetId}`;
  }

  return {
    publishedUrl,
    platformPostId: tweetId,
  };
}
