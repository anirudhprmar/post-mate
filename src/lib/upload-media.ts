import type { MediaItem } from "~/store/post";

interface UploadResult {
  url: string;
  key: string;
  type: "image" | "video";
  mimeType: string;
  thumbnailUrl?: string;
}

export async function uploadMediaFile(
  item: MediaItem,
  createUploadUrl: (input: {
    fileName: string;
    contentType: string;
    fileType: "image" | "video";
  }) => Promise<{ uploadUrl: string; key: string; fileType: string }>,
): Promise<UploadResult> {
  const { uploadUrl, key } = await createUploadUrl({
    fileName: item.file.name,
    contentType: item.file.type,
    fileType: item.type,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: item.file,
    headers: {
      "Content-Type": item.file.type,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload ${item.file.name}: ${response.statusText}`,
    );
  }

  let thumbnailUrl: string | undefined = undefined;
  if (item.type === "video" && item.thumbnail) {
    const thumbName = `thumb-${Date.now()}-${item.thumbnail.name || "thumbnail.jpg"}`;
    const thumbType = item.thumbnail.type || "image/jpeg";
    const { uploadUrl: thumbUploadUrl } = await createUploadUrl({
      fileName: thumbName,
      contentType: thumbType,
      fileType: "image",
    });

    const thumbResponse = await fetch(thumbUploadUrl, {
      method: "PUT",
      body: item.thumbnail,
      headers: {
        "Content-Type": thumbType,
      },
    });

    if (!thumbResponse.ok) {
      throw new Error(
        `Failed to upload thumbnail for ${item.file.name}: ${thumbResponse.statusText}`,
      );
    }
    thumbnailUrl = thumbUploadUrl.split("?")[0]!;
  }

  return {
    url: uploadUrl.split("?")[0]!,
    key,
    type: item.type,
    mimeType: item.file.type,
    thumbnailUrl,
  };
}

export async function uploadAllMedia(
  items: MediaItem[],
  createUploadUrl: (input: {
    fileName: string;
    contentType: string;
    fileType: "image" | "video";
  }) => Promise<{ uploadUrl: string; key: string; fileType: string }>,
): Promise<UploadResult[]> {
  if (items.length === 0) return [];

  const results = await Promise.all(
    items.map((item) => uploadMediaFile(item, createUploadUrl)),
  );

  return results;
}
