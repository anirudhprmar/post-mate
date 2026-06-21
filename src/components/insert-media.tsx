"use client";

import InsertMediaUpload from "./insert-media-upload";
import { usePostStore } from "~/store/post";

export default function InsertMedia() {
  const addMedia = usePostStore((state) => state.addMedia);

  const handleImagesSelected = async (files: File[]) => {
    addMedia(files);
  };

  const handleVideosSelected = async (files: File[]) => {
    addMedia(files);
  };

  return (
    <InsertMediaUpload
      onImagesSelected={handleImagesSelected}
      onVideosSelected={handleVideosSelected}
    />
  );
}
