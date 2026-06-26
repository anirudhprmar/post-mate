interface InstaPublishResult {
  publishedUrl: string;
  platformPostId: string;
}

async function waitForContainerToProcess(
  containerId: string,
  accessToken: string,
): Promise<void> {
  const maxAttempts = 30;
  const intervalMs = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(
      `https://graph.instagram.com/v25.0/${containerId}?fields=status_code,error_info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to check container status (${res.status}): ${errorText}`,
      );
    }

    const data = (await res.json()) as {
      status_code: string;
      error_info?: { message: string };
    };

    if (data.status_code === "FINISHED") {
      return;
    }

    if (data.status_code === "ERROR") {
      throw new Error(
        `Instagram container processing failed: ${data.error_info?.message || "Unknown error"}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Instagram container processing timed out.");
}

async function fetchPermalink(
  publishedPostId: string,
  accessToken: string,
): Promise<string> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/v25.0/${publishedPostId}?fields=permalink`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (res.ok) {
      const data = (await res.json()) as { permalink?: string };
      if (data.permalink) return data.permalink;
    }
  } catch (error) {
    console.error("[Instagram] Failed to fetch permalink:", error);
  }
  return `https://www.instagram.com/p/${publishedPostId}`;
}

async function uploadImageToInsta(
  mediaUrl: string, //only jpeg allowed
  accessToken: string,
  igAccountId: string,
  mediaType: "STORIES" | null,
  caption?: string,
  isCarouselItem?: boolean,
) {
  const body: Record<string, any> = {
    image_url: mediaUrl,
  };

  if (mediaType) body.media_type = mediaType;
  if (caption) body.caption = caption;
  if (isCarouselItem) body.is_carousel_item = true;

  const containerRes = await fetch(
    `https://graph.instagram.com/v25.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!containerRes.ok) {
    const errorText = await containerRes.text();
    throw new Error(
      `Instagram image upload failed (${containerRes.status}): ${errorText}`,
    );
  }
  const { id: containerId } = (await containerRes.json()) as { id: string };

  return containerId;
}

async function uploadVideoToInsta(
  videoUrl: string,
  accessToken: string,
  igAccountId: string,
  mediaType: "VIDEO" | "REELS" | "STORIES",
  caption?: string,
  coverUrl?: string,
  isCarouselItem?: boolean,
) {
  const body: Record<string, any> = {
    video_url: videoUrl,
    media_type: mediaType,
  };

  if (caption) body.caption = caption;
  if (coverUrl) body.cover_url = coverUrl;
  if (isCarouselItem) body.is_carousel_item = true;

  const containerRes = await fetch(
    `https://graph.instagram.com/v25.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!containerRes.ok) {
    const errorText = await containerRes.text();
    throw new Error(
      `Instagram video upload failed (${containerRes.status}): ${errorText}`,
    );
  }
  const { id: containerId } = (await containerRes.json()) as { id: string };

  return containerId;
}

async function uploadCarouselContainer(
  uploadedCarouselMedia: string[],
  caption: string | null,
  igAccountId: string,
  accessToken: string,
) {
  const containerRes = await fetch(
    `https://graph.instagram.com/v25.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption,
        media_type: "CAROUSEL",
        children: uploadedCarouselMedia.join(","),
      }),
    },
  );

  if (!containerRes.ok) {
    const errorText = await containerRes.text();
    throw new Error(
      `Instagram carousel upload failed (${containerRes.status}): ${errorText}`,
    );
  }
  const { id: carouselContainerId } = (await containerRes.json()) as {
    id: string;
  };

  return carouselContainerId;
}

export async function publishToInsta(
  mediaType: "REELS" | "CAROUSEL" | "STORIES" | "IMAGE",
  caption: string,
  accessToken: string,
  igAccountId: string,
  media: {
    url: string;
    key: string;
    type: "image" | "video";
    mimeType?: string;
    coverUrl?: string;
  }[],
): Promise<InstaPublishResult> {
  if (mediaType == "STORIES") {
    if (media?.length > 1)
      throw new Error("Instagram stories can only have one media at a time");
    if (!media?.[0]) throw new Error("Instagram stories must have a media");

    let containerId;
    if (media[0].type === "image") {
      containerId = await uploadImageToInsta(
        media[0].url,
        accessToken,
        igAccountId,
        "STORIES",
      );
    } else {
      containerId = await uploadVideoToInsta(
        media[0].url,
        accessToken,
        igAccountId,
        "STORIES",
      );
    }

    // Wait for container to process
    await waitForContainerToProcess(containerId, accessToken);

    const publishRes = await fetch(
      `https://graph.instagram.com/v25.0/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerId,
        }),
      },
    );

    if (!publishRes.ok) {
      const errorText = await publishRes.text();
      throw new Error(
        `Instagram stories publish failed (${publishRes.status}): ${errorText}`,
      );
    }

    const { id: publishedPostId } = (await publishRes.json()) as { id: string };
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);

    return {
      publishedUrl,
      platformPostId: publishedPostId,
    };
  } else if (mediaType == "CAROUSEL") {
    if (media.length < 2) {
      throw new Error("Instagram Carousels require at least 2 items");
    }
    if (media.length > 10) {
      throw new Error("Instagram Carousels limits media to 10");
    }

    const uploadedCarouselMedia: string[] = [];
    for (const item of media) {
      if (item.type === "image") {
        const containerId = await uploadImageToInsta(
          item.url,
          accessToken,
          igAccountId,
          null,
          undefined,
          true,
        );
        uploadedCarouselMedia.push(containerId);
      } else {
        const containerId = await uploadVideoToInsta(
          item.url,
          accessToken,
          igAccountId,
          "VIDEO",
          undefined,
          item.coverUrl,
          true,
        );
        uploadedCarouselMedia.push(containerId);
      }
    }

    // Wait for all child containers to process
    for (const containerId of uploadedCarouselMedia) {
      await waitForContainerToProcess(containerId, accessToken);
    }

    // Upload parent carousel container
    const carouselContainerId = await uploadCarouselContainer(
      uploadedCarouselMedia,
      caption,
      igAccountId,
      accessToken,
    );

    // Wait for parent container to process
    await waitForContainerToProcess(carouselContainerId, accessToken);

    const publishRes = await fetch(
      `https://graph.instagram.com/v25.0/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: carouselContainerId,
        }),
      },
    );

    if (!publishRes.ok) {
      const errorText = await publishRes.text();
      throw new Error(
        `Instagram carousel publish failed (${publishRes.status}): ${errorText}`,
      );
    }

    const { id: publishedPostId } = (await publishRes.json()) as { id: string };
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);

    return {
      publishedUrl,
      platformPostId: publishedPostId,
    };
  } else if (mediaType == "REELS") {
    if (media?.length > 1)
      throw new Error("Instagram reels can only have one media at a time");
    if (!media?.[0]) throw new Error("Instagram reels must have a media");

    const containerId = await uploadVideoToInsta(
      media[0].url,
      accessToken,
      igAccountId,
      "REELS",
      caption,
      media[0].coverUrl,
    );

    // Wait for container to process
    await waitForContainerToProcess(containerId, accessToken);

    const publishRes = await fetch(
      `https://graph.instagram.com/v25.0/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerId,
        }),
      },
    );

    if (!publishRes.ok) {
      const errorText = await publishRes.text();
      throw new Error(
        `Instagram reels publish failed (${publishRes.status}): ${errorText}`,
      );
    }

    const { id: publishedPostId } = (await publishRes.json()) as { id: string };
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);

    return {
      publishedUrl,
      platformPostId: publishedPostId,
    };
  } else if (mediaType == "IMAGE") {
    if (media?.length > 1)
      throw new Error(
        "Instagram image posts can only have one media at a time",
      );
    if (!media?.[0]) throw new Error("Instagram image posts must have a media");

    const containerId = await uploadImageToInsta(
      media[0].url,
      accessToken,
      igAccountId,
      null,
      caption,
    );

    // Wait for container to process
    await waitForContainerToProcess(containerId, accessToken);

    const publishRes = await fetch(
      `https://graph.instagram.com/v25.0/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerId,
        }),
      },
    );

    if (!publishRes.ok) {
      const errorText = await publishRes.text();
      throw new Error(
        `Instagram image publish failed (${publishRes.status}): ${errorText}`,
      );
    }

    const { id: publishedPostId } = (await publishRes.json()) as { id: string };
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);

    return {
      publishedUrl,
      platformPostId: publishedPostId,
    };
  }

  throw new Error(`Unsupported Instagram media type: ${mediaType}`);
}
