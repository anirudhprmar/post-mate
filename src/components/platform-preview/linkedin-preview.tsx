"use client";

import { useMemo } from "react";
import Image from "next/image";
import { type PlatformPreviewProps } from "./x-preview";
import { Repeat, ThumbsUp } from "lucide-react";
import { highlightMentionsAndHashtags } from "~/lib/helpers";

export default function LinkedInPreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  const formattedContent = useMemo(() => {
    if (!content) return "";
    return highlightMentionsAndHashtags(
      content,
      "text-[#0a66c2] dark:text-[#70b5f9] font-normal",
    );
  }, [content]);

  return (
    <div className="w-full max-w-xl rounded-xl border border-[#ecebeb] bg-white p-4 text-left font-sans text-[#191919] shadow-sm dark:border-[#2f3336] dark:bg-[#1d2226] dark:text-[#e7e9ea]">
      {/* Header Info Row */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={username}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff3f4] text-[#536471] dark:bg-[#16181c] dark:text-[#71767b]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
            )}
            {/* LinkedIn Small Overlay Badge */}
            <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-[1.5px] dark:bg-[#1d2226]">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0a66c2] text-[9px] font-bold text-white">
                in
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 leading-tight">
              <span className="cursor-pointer text-sm font-semibold text-[#191919] hover:text-[#0a66c2] hover:underline dark:text-[#f3f2f0]">
                {username}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#666666] dark:text-[#b2b2b2]">
              <span>Now</span>
              <span>•</span>
              {/* Globe Icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 fill-current opacity-70"
              >
                <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm7.92 9H16a13.3 13.3 0 00-.73-5.26A8 8 0 0119.92 11zm-5.18 0H9.26a11 11 0 01.37-3h4.74a11 11 0 01.37 3zm-1-5a13.31 13.31 0 00-3.48 0c.26-1.12.78-2.22 1.74-2.22s1.48 1.1 1.74 2.22zm-7 0a13.3 13.3 0 00-.73 5.26H4.08a8 8 0 014.66-5.26zM4.08 13h3.94a13.3 13.3 0 00.73 5.26 8 8 0 01-4.66-5.26zm5.18 0h4.74a11 11 0 01-.37 3H9.63a11 11 0 01-.37-3zm1 5c.26 1.12.78 2.22 1.74 2.22s1.48-1.1 1.74-2.22a13.31 13.31 0 00-3.48 0zm3.48 0a13.3 13.3 0 00.73-5.26h3.94a8 8 0 01-4.67 5.26z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 text-[#666666] transition-colors hover:bg-[#000000]/5 dark:text-[#b2b2b2] dark:hover:bg-[#ffffff]/5">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="mt-3">
        {formattedContent ? (
          <div
            className="tiptap text-sm leading-relaxed font-normal break-all text-[#191919] dark:text-[#f3f2f0] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <p className="text-sm text-[#666666] italic dark:text-[#b2b2b2]">
            Write something to preview...
          </p>
        )}
      </div>

      {/* Media Box */}
      {media.length > 0 && (
        <div
          className={`mt-3 grid max-h-[380px] gap-[2px] overflow-hidden rounded-none ${
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

      {/* Actions Row */}
      <div className="mt-1 flex justify-between border-t border-[#ecebeb] pt-1 text-xs font-semibold text-[#666666] dark:border-[#2f3336] dark:text-[#b2b2b2]">
        {/* Like */}
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-3 transition-all hover:bg-[#000000]/5 active:scale-95 dark:hover:bg-[#ffffff]/5">
          <ThumbsUp />
          <span>Like</span>
        </button>

        {/* Comment */}
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-3 transition-all hover:bg-[#000000]/5 active:scale-95 dark:hover:bg-[#ffffff]/5">
          <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-current">
            <path d="M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h14l4 4V4a2 2 0 00-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2z" />
          </svg>
          <span>Comment</span>
        </button>

        {/* Repost */}
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-3 transition-all hover:bg-[#000000]/5 active:scale-95 dark:hover:bg-[#ffffff]/5">
          <Repeat />
          <span>Repost</span>
        </button>

        {/* Send */}
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-3 transition-all hover:bg-[#000000]/5 active:scale-95 dark:hover:bg-[#ffffff]/5">
          <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-current">
            <path d="M21 3L3 10.53v.97l6.84 2.66L12.5 21h.96L21 3zm-3.64 3.03L9.62 13.8 5.72 12.3l11.64-6.27z" />
          </svg>
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
