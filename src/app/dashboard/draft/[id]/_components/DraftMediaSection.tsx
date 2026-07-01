"use client";

import { X } from "lucide-react";
import InsertMediaUpload from "~/components/insert-media-upload";
import { type DraftMediaItem } from "~/lib/types";

interface DraftMediaSectionProps {
  mediaList: DraftMediaItem[];
  onImagesSelected: (files: File[]) => void;
  onVideosSelected: (files: File[]) => void;
  onRemoveMedia: (id: string) => void;
}

export default function DraftMediaSection({
  mediaList,
  onImagesSelected,
  onVideosSelected,
  onRemoveMedia,
}: DraftMediaSectionProps) {
  return (
    <div className="space-y-2">
      <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
        Media Attachments
      </label>
      <div className="space-y-3">
        <InsertMediaUpload
          onImagesSelected={onImagesSelected}
          onVideosSelected={onVideosSelected}
        />

        {mediaList.length > 0 && (
          <div className="flex flex-wrap gap-3 py-2">
            {mediaList.map((m) => (
              <div
                key={m.id}
                className="group bg-background/50 border-border/40 relative h-24 w-24 overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {m.type === "image" ? (
                  <img
                    src={m.file ? m.previewUrl : m.url}
                    alt="Media"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center">
                    {m.thumbnailUrl ? (
                      <img
                        src={m.thumbnailUrl}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={m.file ? m.previewUrl : m.url}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveMedia(m.id)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1.5 text-white opacity-0 shadow transition-opacity group-hover:opacity-100 hover:bg-black/85"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
