const THREADS_API = "https://graph.threads.net/v1.0";

interface ThreadsPublishResult {
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
      `${THREADS_API}/${containerId}?fields=status,error_message`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `[Threads] Failed to check container status (${res.status}): ${errorText}`,
      );
    }

    const data = (await res.json()) as {
      status: string;
      error_message?: string;
    };

    if (data.status === "FINISHED") return;

    if (data.status === "ERROR") {
      throw new Error(
        `[Threads] Container processing failed: ${data.error_message ?? "Unknown error"}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("[Threads] Container processing timed out.");
}

async function fetchPermalink(
  publishedPostId: string,
  accessToken: string,
): Promise<string> {
  try {
    const res = await fetch(
      `${THREADS_API}/${publishedPostId}?fields=permalink`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (res.ok) {
      const data = (await res.json()) as { permalink?: string };
      if (data.permalink) return data.permalink;
    }
  } catch (err) {
    console.error("[Threads] Failed to fetch permalink:", err);
  }

  return `https://www.threads.net/p/${publishedPostId}`;
}

async function createTextContainer(
  threadsUserId: string,
  accessToken: string,
  text: string,
): Promise<string> {
  const res = await fetch(`${THREADS_API}/${threadsUserId}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_type: "TEXT",
      text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `[Threads] Text container creation failed (${res.status}): ${errorText}`,
    );
  }

  const { id } = (await res.json()) as { id: string };
  return id;
}

async function createImageContainer(
  threadsUserId: string,
  accessToken: string,
  imageUrl: string,
  text?: string,
  isCarouselItem = false,
): Promise<string> {
  const body: Record<string, unknown> = {
    media_type: "IMAGE",
    image_url: imageUrl,
  };
  if (text && !isCarouselItem) body.text = text;
  if (isCarouselItem) body.is_carousel_item = true;

  const res = await fetch(`${THREADS_API}/${threadsUserId}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `[Threads] Image container creation failed (${res.status}): ${errorText}`,
    );
  }

  const { id } = (await res.json()) as { id: string };
  return id;
}

async function createVideoContainer(
  threadsUserId: string,
  accessToken: string,
  videoUrl: string,
  text?: string,
  isCarouselItem = false,
): Promise<string> {
  const body: Record<string, unknown> = {
    media_type: "VIDEO",
    video_url: videoUrl,
  };
  if (text && !isCarouselItem) body.text = text;
  if (isCarouselItem) body.is_carousel_item = true;

  const res = await fetch(`${THREADS_API}/${threadsUserId}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `[Threads] Video container creation failed (${res.status}): ${errorText}`,
    );
  }

  const { id } = (await res.json()) as { id: string };
  return id;
}

async function createCarouselContainer(
  threadsUserId: string,
  accessToken: string,
  childrenIds: string[],
  text?: string,
): Promise<string> {
  const res = await fetch(`${THREADS_API}/${threadsUserId}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_type: "CAROUSEL",
      children: childrenIds.join(","),
      text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `[Threads] Carousel container creation failed (${res.status}): ${errorText}`,
    );
  }

  const { id } = (await res.json()) as { id: string };
  return id;
}

async function publishContainer(
  threadsUserId: string,
  accessToken: string,
  containerId: string,
): Promise<string> {
  const res = await fetch(
    `${THREADS_API}/${threadsUserId}/threads_publish`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ creation_id: containerId }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `[Threads] Publish failed (${res.status}): ${errorText}`,
    );
  }

  const { id } = (await res.json()) as { id: string };
  return id;
}

export async function publishToThreads(
  text: string,
  accessToken: string,
  threadsUserId: string,
  media?: {
    url: string;
    key: string;
    type: "image" | "video";
    mimeType?: string;
  }[],
): Promise<ThreadsPublishResult> {
  const hasMedia = media && media.length > 0;

  if (!hasMedia) {
    const containerId = await createTextContainer(
      threadsUserId,
      accessToken,
      text,
    );
    await waitForContainerToProcess(containerId, accessToken);
    const publishedPostId = await publishContainer(
      threadsUserId,
      accessToken,
      containerId,
    );
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);
    return { publishedUrl, platformPostId: publishedPostId };
  }

  if (media.length === 1 && media[0]!.type === "image") {
    const containerId = await createImageContainer(
      threadsUserId,
      accessToken,
      media[0]!.url,
      text,
    );
    await waitForContainerToProcess(containerId, accessToken);
    const publishedPostId = await publishContainer(
      threadsUserId,
      accessToken,
      containerId,
    );
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);
    return { publishedUrl, platformPostId: publishedPostId };
  }

  if (media.length === 1 && media[0]!.type === "video") {
    const containerId = await createVideoContainer(
      threadsUserId,
      accessToken,
      media[0]!.url,
      text,
    );
    await waitForContainerToProcess(containerId, accessToken);
    const publishedPostId = await publishContainer(
      threadsUserId,
      accessToken,
      containerId,
    );
    const publishedUrl = await fetchPermalink(publishedPostId, accessToken);
    return { publishedUrl, platformPostId: publishedPostId };
  }

  if (media.length > 20) {
    throw new Error("[Threads] Carousel posts support a maximum of 20 items.");
  }

  const childIds: string[] = [];
  for (const item of media) {
    const childId =
      item.type === "image"
        ? await createImageContainer(
            threadsUserId,
            accessToken,
            item.url,
            undefined,
            true,
          )
        : await createVideoContainer(
            threadsUserId,
            accessToken,
            item.url,
            undefined,
            true,
          );
    childIds.push(childId);
  }

  for (const childId of childIds) {
    await waitForContainerToProcess(childId, accessToken);
  }

  const carouselContainerId = await createCarouselContainer(
    threadsUserId,
    accessToken,
    childIds,
    text,
  );

  await waitForContainerToProcess(carouselContainerId, accessToken);

  const publishedPostId = await publishContainer(
    threadsUserId,
    accessToken,
    carouselContainerId,
  );
  const publishedUrl = await fetchPermalink(publishedPostId, accessToken);

  return { publishedUrl, platformPostId: publishedPostId };
}
