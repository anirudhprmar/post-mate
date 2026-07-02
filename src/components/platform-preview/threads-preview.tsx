"use client";

import { useMemo } from "react";
import Image from "next/image";
import { type PlatformPreviewProps } from "./x-preview";
import { highlightMentionsAndHashtags } from "~/lib/helpers";

export default function ThreadsPreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  const formattedContent = useMemo(() => {
    if (!content) return "";
    return highlightMentionsAndHashtags(content, "text-[#0095f6]");
  }, [content]);

  // Generate handle from username
  const handle = useMemo(() => {
    const slug = username
      .toLowerCase()
      .replace(/[^a-z0-9_.]/g, "")
      .slice(0, 30);
    return slug || "user";
  }, [username]);

  return (
    <div className="w-full max-w-xl rounded-2xl border border-[#e0e0e0] bg-white p-4 text-left font-sans text-[#000000] dark:border-[#333639] dark:bg-[#101010] dark:text-[#f5f5f5]">
      <div className="flex gap-3">
        {/* Left column: avatar + thread line */}
        <div className="flex flex-col items-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efefef] text-[#999999] dark:bg-[#1e1e1e] dark:text-[#777777]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
          )}
          {/* Thread line */}
          <div className="mt-2 w-0.5 flex-1 rounded-full bg-[#e0e0e0] dark:bg-[#333639]" />
        </div>

        {/* Right column: content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="cursor-pointer text-[15px] font-semibold text-[#000000] hover:underline dark:text-[#f5f5f5]">
                {handle}
              </span>
              {/* Verified badge */}
              <svg
                viewBox="0 0 24 24"
                className="h-[15px] w-[15px] shrink-0 fill-[#0095f6]"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.406-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.406.17.867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4.5l-4-4 1.41-1.42L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#999999] dark:text-[#777777]">
                1d
              </span>
              {/* More menu */}
              <button className="rounded-full p-1 text-[#999999] transition-colors hover:bg-[#f5f5f5] dark:text-[#777777] dark:hover:bg-[#1e1e1e]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-1">
            {formattedContent ? (
              <div
                className="tiptap text-[15px] leading-normal font-normal break-all text-[#000000] dark:text-[#f5f5f5] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            ) : (
              <p className="text-[15px] text-[#999999] italic dark:text-[#777777]">
                Write something to preview...
              </p>
            )}
          </div>

          {/* Media */}
          {media.length > 0 && (
            <div
              className={`mt-3 grid max-h-[320px] gap-[2px] overflow-hidden rounded-xl ${
                media.length === 1
                  ? "grid-cols-1"
                  : media.length === 2
                    ? "grid-cols-2"
                    : media.length === 3
                      ? "grid-cols-2 grid-rows-2"
                      : "grid-cols-2 grid-rows-2"
              }`}
            >
              {media.map((m, index) => {
                const isThreeItemsAndFirst = media.length === 3 && index === 0;
                return (
                  <div
                    key={m.id}
                    className={`relative overflow-hidden bg-[#f5f5f5] dark:bg-[#1e1e1e] ${
                      isThreeItemsAndFirst ? "row-span-2 h-full" : "h-full"
                    } min-h-[100px]`}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={m.previewUrl}
                        poster={m.thumbnailPreviewUrl}
                        controls
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Row */}
          <div className="mt-3 flex items-center gap-5 text-[#999999] dark:text-[#777777]">
            {/* Like (Heart) */}
            <button className="group flex items-center gap-1 transition-colors hover:text-[#ff3040]">
              <svg
                viewBox="0 0 24 24"
                className="h-[20px] w-[20px] fill-none stroke-current stroke-[2]"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            {/* Comment */}
            <button className="group flex items-center gap-1 transition-colors hover:text-[#000000] dark:hover:text-[#f5f5f5]">
              <svg
                viewBox="0 0 24 24"
                className="h-[20px] w-[20px] fill-none stroke-current stroke-[2]"
              >
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </button>

            {/* Repost */}
            <button className="group flex items-center gap-1 transition-colors hover:text-[#00ba7c]">
              <svg
                viewBox="0 0 24 24"
                className="h-[20px] w-[20px] fill-none stroke-current stroke-[2]"
              >
                <path d="M17 1l4 4-4 4M21 5H9a4 4 0 00-4 4v3M7 23l-4-4 4-4M3 19h12a4 4 0 004-4v-3" />
              </svg>
            </button>

            {/* Share */}
            <button className="group flex items-center gap-1 transition-colors hover:text-[#000000] dark:hover:text-[#f5f5f5]">
              <svg
                viewBox="0 0 24 24"
                className="h-[20px] w-[20px] fill-none stroke-current stroke-[2]"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
