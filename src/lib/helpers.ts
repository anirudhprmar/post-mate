import type { PostStatus } from "./types";
import {
  FileEdit,
  CalendarCheck2,
  SendHorizonal,
  AlertTriangle,
  Loader2,
  type LucideIcon,
} from "lucide-react";

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function getDraftStatusLabel(status: string): string {
  if (status === "all") return "All Status";
  if (status === "published") return "Published";
  if (status === "draft") return "Draft";
  return status;
}

export type StatusConfigEntry = {
  label: string;
  icon: LucideIcon;
  badge: "default" | "secondary" | "outline" | "destructive";
};

/** Visual config (label + icon + badge variant) for every PostStatus value. */
export const POST_STATUS_CONFIG: Record<PostStatus, StatusConfigEntry> = {
  draft: { label: "Draft", icon: FileEdit, badge: "secondary" },
  scheduled: { label: "Scheduled", icon: CalendarCheck2, badge: "outline" },
  publishing: { label: "Publishing…", icon: Loader2, badge: "outline" },
  published: { label: "Published", icon: SendHorizonal, badge: "default" },
  failed: { label: "Failed", icon: AlertTriangle, badge: "destructive" },
  partially_failed: {
    label: "Partial",
    icon: AlertTriangle,
    badge: "destructive",
  },
};

export function highlightMentionsAndHashtags(
  html: string,
  color: string,
): string {
  let result = html;

  // @mentions (not inside HTML attributes)
  result = result.replace(
    /(?<![a-zA-Z0-9_="/@])@([a-zA-Z0-9_]+)/g,
    `<span class="${color} hover:underline cursor-pointer">@$1</span>`,
  );

  // #hashtags (not inside HTML attributes)
  result = result.replace(
    /(?<![a-zA-Z0-9_="/#])#([a-zA-Z0-9_]+)/g,
    `<span class="${color} hover:underline cursor-pointer">#$1</span>`,
  );

  return result;
}

export function getMediaUrl(url: string, key?: string) {
  if (key) {
    return `/api/media?key=${encodeURIComponent(key)}`;
  }
  return url;
}

export function getThumbnailUrl(url?: string) {
  if (!url) return "";
  try {
    if (url.startsWith("http")) {
      const match = url.match(/([^/]+\/thumb-[^?#]+)/);
      if (match?.[1]) {
        return `/api/media?key=${encodeURIComponent(match[1])}`;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return url;
}
