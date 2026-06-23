"use client";

import { useMemo } from "react";
import Image from "next/image";
import { type PlatformPreviewProps } from "./x-preview";
import { Repeat, ThumbsUp } from "lucide-react";

export default function LinkedInPreview({
  username,
  avatarUrl,
  content,
  media = [],
}: PlatformPreviewProps) {
  // Format content to highlight mentions and hashtags in LinkedIn blue (#0a66c2)
  const formattedContent = useMemo(() => {
    if (!content) return "";
    let html = content;

    // Highlight mentions: @username (not inside attributes)
    html = html.replace(
      /(?<![a-zA-Z0-9_="/])@([a-zA-Z0-9_]+)/g,
      '<span class="text-[#0a66c2] dark:text-[#70b5f9] font-normal hover:underline cursor-pointer">@$1</span>'
    );

    // Highlight hashtags: #hashtag (not inside attributes)
    html = html.replace(
      /(?<![a-zA-Z0-9_="/])#([a-zA-Z0-9_]+)/g,
      '<span class="text-[#0a66c2] dark:text-[#70b5f9] font-normal hover:underline cursor-pointer">#$1</span>'
    );

    return html;
  }, [content]);

  return (
    <div className="w-full max-w-xl rounded-xl border border-[#ecebeb] dark:border-[#2f3336] bg-white dark:bg-[#1d2226] p-4 text-left font-sans text-[#191919] dark:text-[#e7e9ea] shadow-sm">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff3f4] dark:bg-[#16181c] text-[#536471] dark:text-[#71767b]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
            )}
            {/* LinkedIn Small Overlay Badge */}
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1d2226] p-[1.5px] rounded-full">
              <div className="bg-[#0a66c2] text-white flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
                in
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 leading-tight">
              <span className="font-semibold text-sm text-[#191919] dark:text-[#f3f2f0] hover:text-[#0a66c2] hover:underline cursor-pointer">
                {username}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#666666] dark:text-[#b2b2b2] mt-0.5">
              <span>Now</span>
              <span>•</span>
              {/* Globe Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 fill-current opacity-70"
              >
                <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm7.92 9H16a13.3 13.3 0 00-.73-5.26A8 8 0 0119.92 11zm-5.18 0H9.26a11 11 0 01.37-3h4.74a11 11 0 01.37 3zm-1-5a13.31 13.31 0 00-3.48 0c.26-1.12.78-2.22 1.74-2.22s1.48 1.1 1.74 2.22zm-7 0a13.3 13.3 0 00-.73 5.26H4.08a8 8 0 014.66-5.26zM4.08 13h3.94a13.3 13.3 0 00.73 5.26 8 8 0 01-4.66-5.26zm5.18 0h4.74a11 11 0 01-.37 3H9.63a11 11 0 01-.37-3zm1 5c.26 1.12.78 2.22 1.74 2.22s1.48-1.1 1.74-2.22a13.31 13.31 0 00-3.48 0zm3.48 0a13.3 13.3 0 00.73-5.26h3.94a8 8 0 01-4.67 5.26z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 text-[#666666] dark:text-[#b2b2b2] hover:bg-[#000000]/5 dark:hover:bg-[#ffffff]/5 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="mt-3">
        {formattedContent ? (
          <div
            className="tiptap wrap-break-words text-sm leading-relaxed font-normal text-[#191919] dark:text-[#f3f2f0] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <p className="text-[#666666] dark:text-[#b2b2b2] italic text-sm">
            Write something to preview...
          </p>
        )}
      </div>

      {/* Media Box */}
      {media.length > 0 && (
        <div
          className={`mt-3 overflow-hidden rounded-none grid gap-[2px] max-h-[380px] ${
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
                className={`bg-[#f7f9fa] dark:bg-[#16181c] relative overflow-hidden ${
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
      <div className="flex justify-between border-t border-[#ecebeb] dark:border-[#2f3336] mt-1 pt-1 text-[#666666] dark:text-[#b2b2b2] text-xs font-semibold">
        {/* Like */}
        <button className="flex-1 py-3 flex items-center justify-center gap-1.5 rounded-md hover:bg-[#000000]/5 dark:hover:bg-[#ffffff]/5 active:scale-95 transition-all">
          <ThumbsUp/>
          <span>Like</span>
        </button>

        {/* Comment */}
        <button className="flex-1 py-3 flex items-center justify-center gap-1.5 rounded-md hover:bg-[#000000]/5 dark:hover:bg-[#ffffff]/5 active:scale-95 transition-all">
          <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current">
            <path d="M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h14l4 4V4a2 2 0 00-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2z" />
          </svg>
          <span>Comment</span>
        </button>

        {/* Repost */}
        <button className="flex-1 py-3 flex items-center justify-center gap-1.5 rounded-md hover:bg-[#000000]/5 dark:hover:bg-[#ffffff]/5 active:scale-95 transition-all">
         <Repeat/>
          <span>Repost</span>
        </button>

        {/* Send */}
        <button className="flex-1 py-3 flex items-center justify-center gap-1.5 rounded-md hover:bg-[#000000]/5 dark:hover:bg-[#ffffff]/5 active:scale-95 transition-all">
          <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current">
            <path d="M21 3L3 10.53v.97l6.84 2.66L12.5 21h.96L21 3zm-3.64 3.03L9.62 13.8 5.72 12.3l11.64-6.27z" />
          </svg>
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
