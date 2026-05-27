interface LinkedInPublishResult {
  publishedUrl: string;
  platformPostId: string;
}

interface LinkedInImageUploadResult {
  asset: string;
}

/**
 * Register an image upload with LinkedIn and upload the binary.
 * Uses the LinkedIn API v2 images endpoint.
 */
async function uploadImageToLinkedIn(
  mediaUrl: string,
  personUrn: string,
  accessToken: string,
): Promise<string> {
  // Step 1: Register the upload
  const registerRes = await fetch("https://api.linkedin.com/v2/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202605",
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: personUrn,
      },
    }),
  });

  if (!registerRes.ok) {
    const errorText = await registerRes.text();
    throw new Error(`LinkedIn image register failed (${registerRes.status}): ${errorText}`);
  }

  const registerData = (await registerRes.json()) as {
    value: {
      uploadUrl: string;
      image: string;
    };
  };

  const { uploadUrl, image: imageUrn } = registerData.value;

  // Step 2: Download media from our R2 storage
  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    throw new Error(`Failed to download media from ${mediaUrl}: ${mediaResponse.statusText}`);
  }
  const mediaBuffer = await mediaResponse.arrayBuffer();

  // Step 3: Upload the binary to LinkedIn's upload URL
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
    },
    body: Buffer.from(mediaBuffer),
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`LinkedIn image upload failed (${uploadRes.status}): ${errorText}`);
  }

  return imageUrn;
}

/**
 * Publish a post to LinkedIn using the Posts API (v2).
 * Supports text-only posts and posts with images.
 *
 * LinkedIn Posts API reference:
 * https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */
export async function publishToLinkedIn(
  content: string,
  accessToken: string,
  linkedInAccountId: string,
  media?: { url: string; key: string; type: "image" | "video"; mimeType?: string }[],
): Promise<LinkedInPublishResult> {
  const personUrn = `urn:li:person:${linkedInAccountId}`;

  // Build the post payload
  const postPayload: Record<string, unknown> = {
    author: personUrn,
    lifecycleState: "PUBLISHED",
    visibility: "PUBLIC",
    commentary: content,
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
  };

  // Upload and attach images if present
  const imageMedia = media?.filter((m) => m.type === "image") ?? [];
  if (imageMedia.length > 0) {
    const imageUrns: string[] = [];
    for (const item of imageMedia) {
      try {
        const imageUrn = await uploadImageToLinkedIn(item.url, personUrn, accessToken);
        imageUrns.push(imageUrn);
      } catch (err) {
        console.error(`[LinkedIn] Failed to upload image ${item.key}:`, err);
      }
    }

    if (imageUrns.length === 1) {
      // Single image post
      postPayload.content = {
        media: {
          title: "Post image",
          id: imageUrns[0],
        },
      };
    } else if (imageUrns.length > 1) {
      // Multi-image post
      postPayload.content = {
        multiImage: {
          images: imageUrns.map((urn) => ({
            id: urn,
          })),
        },
      };
    }
  }

  // Create the post
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202605",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(postPayload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`LinkedIn API error (${res.status}): ${errorBody}`);
  }

  // LinkedIn returns the post ID in the x-restli-id header
  const postId = res.headers.get("x-restli-id") ?? "";

  // Build the published URL
  // LinkedIn share URLs follow this pattern
  const publishedUrl = `https://www.linkedin.com/feed/update/${postId}`;

  return {
    publishedUrl,
    platformPostId: postId,
  };
}
