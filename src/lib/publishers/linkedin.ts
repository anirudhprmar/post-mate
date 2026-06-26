interface LinkedInPublishResult {
  publishedUrl: string;
  platformPostId: string;
}

async function uploadImageToLinkedIn(
  mediaUrl: string,
  personUrn: string,
  accessToken: string,
): Promise<string> {
  const registerRes = await fetch(
    "https://api.linkedin.com/v2/images?action=initializeUpload",
    {
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
    },
  );

  if (!registerRes.ok) {
    const errorText = await registerRes.text();
    throw new Error(
      `LinkedIn image register failed (${registerRes.status}): ${errorText}`,
    );
  }

  const registerData = (await registerRes.json()) as {
    value: {
      uploadUrl: string;
      image: string;
    };
  };

  const { uploadUrl, image: imageUrn } = registerData.value;

  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    throw new Error(
      `Failed to download media from ${mediaUrl}: ${mediaResponse.statusText}`,
    );
  }
  const mediaBuffer = await mediaResponse.arrayBuffer();

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
    throw new Error(
      `LinkedIn image upload failed (${uploadRes.status}): ${errorText}`,
    );
  }

  return imageUrn;
}

export async function publishToLinkedIn(
  content: string,
  accessToken: string,
  linkedInAccountId: string,
  media?: {
    url: string;
    key: string;
    type: "image" | "video";
    mimeType?: string;
  }[],
): Promise<LinkedInPublishResult> {
  const personUrn = `urn:li:person:${linkedInAccountId}`;

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

  const imageMedia = media?.filter((m) => m.type === "image") ?? [];
  if (imageMedia.length > 0) {
    const imageUrns: string[] = [];
    for (const item of imageMedia) {
      try {
        const imageUrn = await uploadImageToLinkedIn(
          item.url,
          personUrn,
          accessToken,
        );
        imageUrns.push(imageUrn);
      } catch (err) {
        console.error(`[LinkedIn] Failed to upload image ${item.key}:`, err);
      }
    }

    if (imageUrns.length === 1) {
      postPayload.content = {
        media: {
          title: "Post image",
          id: imageUrns[0],
        },
      };
    } else if (imageUrns.length > 1) {
      postPayload.content = {
        multiImage: {
          images: imageUrns.map((urn) => ({
            id: urn,
          })),
        },
      };
    }
  }

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

  const postId = res.headers.get("x-restli-id") ?? "";

  const publishedUrl = `https://www.linkedin.com/feed/update/${postId}`;

  return {
    publishedUrl,
    platformPostId: postId,
  };
}
