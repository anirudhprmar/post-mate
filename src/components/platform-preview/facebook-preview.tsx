"use client";

import { useMemo } from "react";
import Image from "next/image";
import { type PlatformPreviewProps } from "./x-preview";
import { ThumbsUp, MessageCircle, Share, Globe } from "lucide-react";
import { highlightMentionsAndHashtags } from "~/lib/helpers";

export default function FacebookPreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  const formattedContent = useMemo(() => {
    if (!content) return "";
    return highlightMentionsAndHashtags(
      content,
      "text-[#216fdb] dark:text-[#75b7ff] font-normal",
    );
  }, [content]);

  const timestamp = useMemo(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
    return `${dateStr} at ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  }, []);

  return (
    <div className="w-full max-w-xl rounded-xl border border-[#dddfe2] bg-white text-left font-sans text-[#1c1e21] shadow-sm dark:border-[#3a3b3c] dark:bg-[#242526] dark:text-[#e4e6eb]">
      {/* Header */}
      <div className="flex items-start gap-2.5 p-3 pb-2">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-1">
            <span className="cursor-pointer text-[15px] font-semibold text-[#050505] hover:underline dark:text-[#e4e6eb]">
              {username}
            </span>
            {/* Verified badge */}
            <svg
              viewBox="0 0 24 24"
              className="h-[15px] w-[15px] shrink-0 fill-[#1877f2]"
            >
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.406-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.406.17.867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4.5l-4-4 1.41-1.42L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <span className="text-[13px] text-[#65676b] dark:text-[#b0b3b8]">
              · Follow
            </span>
          </div>
          <div className="flex items-center gap-1 text-[13px] text-[#65676b] dark:text-[#b0b3b8]">
            <span>{timestamp}</span>
            <span>·</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>

        {/* More button */}
        <button className="rounded-full p-2 text-[#65676b] transition-colors hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pb-2">
        {formattedContent ? (
          <div
            className="tiptap text-[15px] leading-relaxed font-normal break-all text-[#050505] dark:text-[#e4e6eb] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <p className="text-[15px] text-[#65676b] italic dark:text-[#b0b3b8]">
            Write something to preview...
          </p>
        )}
      </div>

      {/* Media Grid */}
      {media.length > 0 && (
        <div
          className={`grid max-h-[420px] gap-[2px] overflow-hidden ${
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
                className={`relative overflow-hidden bg-[#f0f2f5] dark:bg-[#3a3b3c] ${
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

      {/* Engagement counts */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1" />
        <div className="flex items-center gap-3 text-[13px] text-[#65676b] dark:text-[#b0b3b8]">
          <span className="cursor-pointer hover:underline">0 comments</span>
          <span className="cursor-pointer hover:underline">0 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-3 flex justify-between border-t border-[#dddfe2] pt-1 pb-1 text-[13px] font-semibold text-[#65676b] dark:border-[#3a3b3c] dark:text-[#b0b3b8]">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 transition-all hover:bg-[#f0f2f5] active:scale-95 dark:hover:bg-[#3a3b3c]">
          <ThumbsUp className="h-5 w-5" />
          <span>Like</span>
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 transition-all hover:bg-[#f0f2f5] active:scale-95 dark:hover:bg-[#3a3b3c]">
          <MessageCircle className="h-5 w-5" />
          <span>Comment</span>
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 transition-all hover:bg-[#f0f2f5] active:scale-95 dark:hover:bg-[#3a3b3c]">
          <Share className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
