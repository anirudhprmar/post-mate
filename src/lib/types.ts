export type Platform =
  | "instagram"
  | "x"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "threads";

export type PostStatus =
  | "draft"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"
  | "partially_failed";

export type DraftStatus = "draft" | "published";

export interface DraftMediaItem {
  id: string;
  url?: string;
  key?: string;
  type: "image" | "video";
  mimeType?: string;
  thumbnailUrl?: string;
  file?: File;
  previewUrl?: string;
}
