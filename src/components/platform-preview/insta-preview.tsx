"use client";

import { useMemo } from "react";
import Image from "next/image";
import { type PlatformPreviewProps } from "./x-preview";

export default function InstagramPreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  // Format content (no special link coloring is usually needed on native Instagram client,
  // but let's parse tags so they look like links)
  const formattedContent = useMemo(() => {
    if (!content) return "";
    let html = content;

    // Highlight mentions: @username
    html = html.replace(
      /(?<![a-zA-Z0-9_="/])@([a-zA-Z0-9_]+)/g,
      '<span class="text-[#00376b] dark:text-[#e0f1ff] hover:underline cursor-pointer">@$1</span>'
    );

    // Highlight hashtags: #hashtag
    html = html.replace(
      /(?<![a-zA-Z0-9_="/])#([a-zA-Z0-9_]+)/g,
      '<span class="text-[#00376b] dark:text-[#e0f1ff] hover:underline cursor-pointer">#$1</span>'
    );

    return html;
  }, [content]);

  return (
    <div className="w-full max-w-xl rounded-xl border border-[#ecebeb] dark:border-[#262626] bg-white dark:bg-[#000000] text-left font-sans text-[#262626] dark:text-[#f5f5f5] shadow-sm overflow-hidden">
      {/* Header Info Row */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2.5">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover shrink-0 border border-black/5 dark:border-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff3f4] dark:bg-[#16181c] text-[#536471] dark:text-[#71767b]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#262626] dark:text-[#f5f5f5] hover:opacity-75 cursor-pointer leading-none">
              {username}
            </span>
            <span className="text-[10px] text-[#737373] dark:text-[#a8a8a8] mt-0.5 leading-none">
              Original Audio
            </span>
          </div>
        </div>

        {/* Top Right Control (Three Dots) */}
        <button className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-60 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M12 9.75A1.25 1.25 0 1013.25 11 1.25 1.25 0 0012 9.75zM12 4.75A1.25 1.25 0 1013.25 6 1.25 1.25 0 0012 4.75zM12 14.75A1.25 1.25 0 1013.25 16 1.25 1.25 0 0012 14.75z" />
          </svg>
        </button>
      </div>

      {/* Main Visual Display */}
      {media.length > 0 ? (
        <div className="relative w-full aspect-square bg-[#fafafa] dark:bg-[#121212] flex items-center justify-center overflow-hidden border-y border-[#ecebeb] dark:border-[#262626]">
          {/* Render first asset as main focal frame */}
          {media[0]?.type === "image" ? (
            <img
              src={media[0]?.previewUrl}
              alt="Instagram Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={media[0]?.previewUrl}
              poster={media[0]?.thumbnailPreviewUrl}
              controls
              className="h-full w-full object-cover"
            />
          )}

          {/* Indicator if multiple media exist */}
          {media.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/75 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full z-10">
              1/{media.length}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full aspect-square bg-[#fafafa] dark:bg-[#121212] flex flex-col items-center justify-center text-center p-6 border-y border-[#ecebeb] dark:border-[#262626]">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#737373] dark:border-[#a8a8a8] flex items-center justify-center text-[#737373] dark:text-[#a8a8a8] mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-none stroke-current stroke-2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#737373] dark:text-[#a8a8a8]">
            No Media Selected
          </p>
          <p className="text-xs text-[#737373] dark:text-[#a8a8a8] max-w-[240px] mt-1">
            Instagram posts require at least one photo or video to preview.
          </p>
        </div>
      )}

      {/* Action Icons Row */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4 text-[#262626] dark:text-[#f5f5f5]">
          {/* Like (Heart) */}
          <button className="hover:opacity-60 transition-opacity">
            <svg
              viewBox="0 0 24 24"
              className="w-[24px] h-[24px] fill-none stroke-current stroke-2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Comment */}
          <button className="hover:opacity-60 transition-opacity">
            <svg
              viewBox="0 0 24 24"
              className="w-[24px] h-[24px] fill-none stroke-current stroke-2"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          </button>

          {/* Share/Direct */}
          <button className="hover:opacity-60 transition-opacity">
            <svg
              viewBox="0 0 24 24"
              className="w-[24px] h-[24px] fill-none stroke-current stroke-2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Bookmark (Right Side) */}
        <button className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-60 transition-opacity">
          <svg
            viewBox="0 0 24 24"
            className="w-[24px] h-[24px] fill-none stroke-current stroke-2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
          </svg>
        </button>
      </div>

      {/* Caption Content Area */}
      <div className="px-3 pb-4">
        {/* Likes Indicator */}
        <p className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1">
          1 like
        </p>

        {/* Username + Inline Text Caption */}
        <div className="text-xs leading-relaxed text-[#262626] dark:text-[#f5f5f5]">
          <span className="font-semibold mr-1.5 hover:opacity-75 cursor-pointer">
            {username}
          </span>
          {formattedContent ? (
            <span
              className="tiptap break-all inline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:inline"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          ) : (
            <span className="text-[#737373] dark:text-[#a8a8a8] italic">
              Write a caption...
            </span>
          )}
        </div>

        {/* Time Stamp */}
        <span className="text-[10px] tracking-wide text-[#737373] dark:text-[#a8a8a8] mt-2.5 block uppercase">
          1 minute ago
        </span>
      </div>
    </div>
  );
}
