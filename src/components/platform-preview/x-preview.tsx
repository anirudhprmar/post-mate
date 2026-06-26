"use client";

import { useMemo } from "react";
import Image from "next/image";
import { highlightMentionsAndHashtags } from "~/lib/helpers";

export interface PlatformPreviewProps {
  username: string;
  avatarUrl: string | null;
  content: string;
  media: Array<{
    id: string;
    type: "image" | "video";
    previewUrl: string;
    thumbnailPreviewUrl?: string;
  }>;
}

export default function XPreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  // Generate a realistic handle from the username
  const handle = useMemo(() => {
    const slug = username
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 15);
    return `@${slug || "user"}`;
  }, [username]);

  const formattedContent = useMemo(() => {
    if (!content) return "";
    return highlightMentionsAndHashtags(content, "text-[#1d9bf0]");
  }, [content]);

  // Format current timestamp dynamically
  const timestamp = useMemo(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${timeStr} · ${dateStr}`;
  }, []);

  return (
    <div className="w-full max-w-xl rounded-2xl border border-[#eff3f4] bg-white p-4 text-left font-sans text-[#0f1419] shadow-xl dark:border-[#2f3336] dark:bg-[#000000] dark:text-[#e7e9ea]">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eff3f4] text-[#536471] dark:bg-[#16181c] dark:text-[#71767b]">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="cursor-pointer text-[15px] font-bold text-[#0f1419] hover:underline dark:text-white">
                {username}
              </span>
              {/* Verified Blue Badge */}
              <svg
                viewBox="0 0 24 24"
                aria-label="Verified account"
                className="h-[18px] w-[18px] shrink-0 fill-[#1d9bf0]"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.406-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.406.17.867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4.5l-4-4 1.41-1.42L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <span className="text-[15px] leading-tight text-[#536471] dark:text-[#71767b]">
              {handle}
            </span>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          {/* More Actions menu */}
          <button className="rounded-full p-2 text-[#536471] transition-colors hover:bg-[#f7f7f9] hover:text-[#1d9bf0] dark:text-[#71767b] dark:hover:bg-[#16181c]">
            <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] fill-current">
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tweet Body Content */}
      <div className="mt-3">
        {formattedContent ? (
          <div
            className="tiptap text-[15px] leading-normal font-normal break-all text-[#0f1419] dark:text-[#e7e9ea] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <p className="text-[15px] text-[#536471] italic dark:text-[#71767b]">
            Write something to preview...
          </p>
        )}
      </div>

      {/* Media Grid */}
      {media.length > 0 && (
        <div
          className={`mt-3 grid max-h-[380px] gap-[2px] overflow-hidden rounded-2xl border border-[#eff3f4] dark:border-[#2f3336] ${
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
            // Layout rules for 3 items: 1st spans full height on the left, other 2 stacked on the right
            const isThreeItemsAndFirst = media.length === 3 && index === 0;
            return (
              <div
                key={m.id}
                className={`relative overflow-hidden bg-[#f7f9fa] dark:bg-[#16181c] ${
                  isThreeItemsAndFirst ? "row-span-2 h-full" : "h-full"
                } min-h-[120px]`}
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

      {/* Date/Time Row */}
      <div className="mt-3.5 pb-3.5 text-[15px] leading-normal font-normal text-[#536471] dark:text-[#71767b]">
        <span>{timestamp}</span>
      </div>

      {/* Footer Icons Row */}
      <div className="flex justify-between border-t border-[#eff3f4] px-0.5 pt-3 text-[#536471] dark:border-[#2f3336] dark:text-[#71767b]">
        {/* Reply/Comment */}
        <button className="group flex items-center transition-colors hover:text-[#1d9bf0]">
          <div className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] fill-none stroke-current stroke-[2.25]"
            >
              <path d="M12 21a9 9 0 10-9-9c0 1.48.36 2.87 1 4.1L3 21l4.9-1c1.23.64 2.62 1 4.1 1z" />
            </svg>
          </div>
        </button>

        {/* Retweet/Repost */}
        <button className="group flex items-center gap-2 transition-colors hover:text-[#00ba7c]">
          <div className="rounded-full p-2 transition-colors group-hover:bg-[#00ba7c]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] fill-none stroke-current stroke-[2.25]"
            >
              <path d="M17 1l4 4-4 4M21 5H9a4 4 0 00-4 4v3M7 23l-4-4 4-4M3 19h12a4 4 0 004-4v-3" />
            </svg>
          </div>
        </button>

        {/* Like */}
        <button className="group flex items-center transition-colors hover:text-[#f91880]">
          <div className="rounded-full p-2 transition-colors group-hover:bg-[#f91880]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] fill-none stroke-current stroke-[2.25]"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
        </button>

        {/* Bookmark */}
        <button className="group flex items-center transition-colors hover:text-[#1d9bf0]">
          <div className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] fill-none stroke-current stroke-[2.25]"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
            </svg>
          </div>
        </button>

        {/* Share */}
        <button className="group flex items-center transition-colors hover:text-[#1d9bf0]">
          <div className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] fill-none stroke-current stroke-[2.25]"
            >
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
