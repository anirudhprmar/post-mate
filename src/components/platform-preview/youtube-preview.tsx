"use client";

import { useMemo } from "react";
import Image from "next/image";
import { type PlatformPreviewProps } from "./x-preview";
import { Play } from "lucide-react";

export default function YouTubePreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  const videoTitle = useMemo(() => {
    if (!content) return "Your Video Title Goes Here";
    const stripped = content.replace(/<[^>]+>/g, "").trim();
    return stripped || "Your Video Title Goes Here";
  }, [content]);

  const firstVideo = media.find((m) => m.type === "video");
  const thumbnail = firstVideo?.thumbnailPreviewUrl ?? firstVideo?.previewUrl;
  const firstImage = media.find((m) => m.type === "image");
  const thumbnailSrc = thumbnail ?? firstImage?.previewUrl;

  return (
    <div className="w-full max-w-xl text-left font-sans">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#f2f2f2] dark:bg-[#272727]">
        {thumbnailSrc ? (
          firstVideo && !firstVideo.thumbnailPreviewUrl ? (
            <video
              src={firstVideo.previewUrl}
              className="h-full w-full object-cover"
              muted
            />
          ) : (
            <img
              src={thumbnailSrc}
              alt="Video Thumbnail"
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-[#717171] dark:text-[#aaaaaa]">
            <svg
              viewBox="0 0 24 24"
              className="mb-2 h-12 w-12 fill-none stroke-current stroke-1"
            >
              <Play />
            </svg>
            <span className="text-sm">Thumbnail Preview</span>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          10:00
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3 pt-3">
        {/* Channel avatar */}
        <div className="shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#606060] text-white">
              <span className="text-sm font-semibold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-sans text-[14px] leading-snug font-semibold text-[#0f0f0f] dark:text-[#f1f1f1]">
            {videoTitle}
          </h3>
          <p className="mt-0.5 text-[12px] text-[#606060] dark:text-[#aaaaaa]">
            {username}
          </p>
          <p className="text-[12px] text-[#606060] dark:text-[#aaaaaa]">
            1M views • 2 hours ago
          </p>
        </div>
      </div>
    </div>
  );
}
