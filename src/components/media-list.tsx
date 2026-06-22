"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePostStore } from "~/store/post";
import type { MediaItem } from "~/store/post";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ThumbnailDialogProps {
  mediaItem: MediaItem;
  onClose: () => void;
  onSave: (file: File, previewUrl: string) => void;
}

export default function MediaList() {
  const media = usePostStore((state) => state.media);
  const removeMedia = usePostStore((state) => state.removeMedia);
  const setThumbnail = usePostStore((state) => state.setThumbnail);

  const [selectedVideoForThumbnail, setSelectedVideoForThumbnail] = useState<MediaItem | null>(null);

  if (media.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 py-2">
        {media.map((m) => (
          <div
            key={m.id}
            className="group bg-card relative h-32 w-32 overflow-hidden rounded-md border"
          >
            {m.type === "image" ? (
              <img
                src={m.previewUrl}
                alt="Media"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                {m.thumbnailPreviewUrl ? (
                  <img
                    src={m.thumbnailPreviewUrl}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={m.previewUrl}
                    className="h-full w-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setSelectedVideoForThumbnail(m)}
                  className="absolute bottom-1 left-1 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                >
                  {m.thumbnailPreviewUrl ? "edit thumb" : "add thumb"}
                </button>
              </div>
            )}
            <button
              onClick={() => removeMedia(m.id)}
              className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {selectedVideoForThumbnail && (
        <ThumbnailDialog
          mediaItem={selectedVideoForThumbnail}
          onClose={() => setSelectedVideoForThumbnail(null)}
          onSave={(file, previewUrl) => {
            setThumbnail(selectedVideoForThumbnail.id, file, previewUrl);
            setSelectedVideoForThumbnail(null);
          }}
        />
      )}
    </>
  );
}

function ThumbnailDialog({ mediaItem, onClose, onSave }: ThumbnailDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    mediaItem.thumbnailPreviewUrl || null,
  );
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setThumbnailPreview((prev) => {
              if (prev && prev !== mediaItem.thumbnailPreviewUrl) {
                URL.revokeObjectURL(prev);
              }
              return url;
            });
            setThumbnailBlob(blob);
          }
          setIsGenerating(false);
        }, "image/jpeg", 0.9);
      } else {
        setIsGenerating(false);
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  }, [mediaItem.thumbnailPreviewUrl]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    return () => {
      if (
        thumbnailPreview &&
        thumbnailPreview !== mediaItem.thumbnailPreviewUrl
      ) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview, mediaItem.thumbnailPreviewUrl]);

  const handleSave = () => {
    if (thumbnailBlob) {
      const file = new File([thumbnailBlob], `thumbnail-${mediaItem.id}.jpg`, {
        type: "image/jpeg",
      });
      if (thumbnailPreview) {
        onSave(file, thumbnailPreview);
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-card border-border sm:max-w-xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-bold tracking-tight">
            Set Video Thumbnail
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Drag the slider to choose a frame from the video to use as its
            thumbnail.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex flex-col gap-6 ">
          <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden rounded-xl border border-border bg-black shadow-inner">
            <video
              ref={videoRef}
              src={mediaItem.previewUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onSeeked={captureFrame}
              preload="auto"
              playsInline
              muted
              className="h-full w-full object-contain"
            />
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden"/>

          <div 
          className="bg-muted/40 rounded-xl border border-border p-3 flex flex-col gap-2">
            <div className="text-muted-foreground flex justify-between px-1 text-xs font-semibold">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSliderChange}
              className="accent-primary h-2 w-full cursor-pointer rounded-lg bg-border"
            />
          </div>

          {thumbnailPreview && (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                Thumbnail Preview:
              </span>
              <div className="relative aspect-video w-32 overflow-hidden rounded-lg border border-border shadow-md">
                <img
                  src={thumbnailPreview}
                  alt="Captured Thumbnail"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-md">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!thumbnailBlob && !mediaItem.thumbnailPreviewUrl}
            className="rounded-md"
          >
            Save Thumbnail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}
