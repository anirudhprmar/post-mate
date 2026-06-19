import type { MediaItem } from "~/store/post";

interface UploadResult {
  url: string;
  key: string;
  type: "image" | "video";
  mimeType: string;
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

  return {
    url: uploadUrl.split("?")[0]!,
    key,
    type: item.type,
    mimeType: item.file.type,
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
