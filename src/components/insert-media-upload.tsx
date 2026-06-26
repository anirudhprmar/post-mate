"use client";

import { useRef, useState } from "react";
import { Image, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { usePostStore } from "~/store/post";

interface InsertMediaUploadProps {
  onImagesSelected: (files: File[]) => Promise<void> | void;
  onVideosSelected: (files: File[]) => Promise<void> | void;
}

export default function InsertMediaUpload({
  onImagesSelected,
  onVideosSelected,
}: InsertMediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const media = usePostStore((state) => state.media);
  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const isInsta = usePostStore((state) => state.isInsta);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await onImagesSelected(Array.from(files));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await onVideosSelected(Array.from(files));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div className="sm:max-w-[600px]">
      <Tabs defaultValue="image" className="flex w-full flex-col">
        <TabsList className="grid h-fit w-full grid-cols-2">
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>

        <TabsContent value="image">
          <div className="space-y-4">
            <div
              className="hover:border-primary/80 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-2 text-center transition-colors"
              onClick={() => imageInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Image className="h-10 w-10 text-gray-400" />
                <span className="font-medium text-gray-500">
                  Click to upload or drag and drop
                </span>
                <span className="text-sm text-gray-400">
                  JPEG, JPG, or PNG (max 800x400px)
                </span>
              </div>

              <input
                type="file"
                multiple
                ref={imageInputRef}
                accept={
                  isInsta ? "image/jpeg" : "image/jpeg,image/jpg,image/png"
                }
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video">
          <div className="space-y-4">
            <div
              className="hover:border-primary/80 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-2 text-center transition-colors"
              onClick={() => videoInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <>
                  <Video className="h-10 w-10 text-gray-400" />
                  <span className="font-medium text-gray-500">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-sm text-gray-400">
                    MP4, MOV, or AVI (max 100MB)
                  </span>
                </>
              </div>
              <input
                type="file"
                multiple
                ref={videoInputRef}
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
