"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/post";
import { uploadAllMedia } from "~/lib/upload-media";

export function usePublishPost() {
  const { data: connectedAccounts = [] } =
    api.connectedAccount.getAll.useQuery();
  const content = usePostStore((state) => state.content);
  const setIsInsta = usePostStore((state) => state.setIsInsta);
  const selectedAccountIds = usePostStore((state) => state.selectedAccountIds);
  const media = usePostStore((state) => state.media);
  const reset = usePostStore((state) => state.reset);
  const scheduledDate = usePostStore((state) => state.scheduledDate);
  const instagramPostType = usePostStore((state) => state.instagramPostType);
  const platformCaptions = usePostStore((state) => state.platformCaptions);

  const [publishingMode, setPublishingMode] = useState<
    "draft" | "schedule" | null
  >(null);

  const createPost = api.post.createPost.useMutation();
  const createDraft = api.draft.create.useMutation();
  const createUploadUrl = api.media.createUploadUrl.useMutation();
  const confirmUpload = api.media.confirmUpload.useMutation();
  const confirmStatus = api.post.confirmStatus.useMutation();
  const schedule = api.post.schedule.useMutation();
  const schedulePublish = api.post.schedulePublish.useMutation();

  const selectedAccounts = connectedAccounts.filter((ca) =>
    selectedAccountIds.includes(ca.id),
  );

  const handlePublish = async (mode: "draft" | "schedule") => {
    if (selectedAccountIds.length === 0) return;

    setPublishingMode(mode);

    if (mode === "schedule") {
      if (!scheduledDate || scheduledDate <= new Date()) {
        toast.error("Scheduled time must be in the future.");
        setPublishingMode(null);
        return;
      }
    }

    if (mode === "draft") {
      try {
        let uploadedMedia;

        if (media.length > 0) {
          for (const account of selectedAccounts) {
            if (account.platform === "instagram") {
              const imageMedia = media.filter((item) => item.type === "image");
              const notJPEG = imageMedia.filter(
                (item) => item.file.type !== "image/jpeg",
              );
              if (notJPEG.length > 0) {
                setIsInsta(true);
                toast.error("Instagram accepts only JPEG format images.");
                break;
              }
            }
          }
          uploadedMedia = await uploadAllMedia(media, (input) =>
            createUploadUrl.mutateAsync(input),
          );
        }

        for (const account of selectedAccounts) {
          const customCaption = platformCaptions[account.id];
          await createDraft.mutateAsync({
            content: customCaption || content,
            platform: account.platform,
            media: uploadedMedia,
          });
        }
        reset();
        toast.success("Draft saved successfully.");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong",
        );
      } finally {
        setPublishingMode(null);
      }
      return;
    }

    let postId: string | null = null;

    try {
      const post = await createPost.mutateAsync({
        content: content,
      });
      postId = post.id;

      if (media.length > 0) {
        for (const account of selectedAccounts) {
          if (account.platform === "instagram") {
            const imageMedia = media.filter((item) => item.type === "image");
            const notJPEG = imageMedia.filter(
              (item) => item.file.type !== "image/jpeg",
            );
            if (notJPEG.length > 0) {
              setIsInsta(true);
              toast.error("Instagram accepts only JPEG format images.");
              break;
            }
          }
        }

        const uploadedMedia = await uploadAllMedia(media, (input) =>
          createUploadUrl.mutateAsync(input),
        );

        await confirmUpload.mutateAsync({
          postId,
          media: uploadedMedia,
        });
      }

      await confirmStatus.mutateAsync({
        postId,
        status: mode === "schedule" ? "scheduled" : "draft",
        scheduledFor: mode === "schedule" ? scheduledDate : undefined,
      });

      for (const accountId of selectedAccountIds) {
        const accountInfo = selectedAccounts.find((a) => a.id === accountId);
        let options:
          | {
              instagramMediaType?: "REELS" | "CAROUSEL" | "STORIES" | "IMAGE";
              caption?: string;
            }
          | undefined = undefined;

        if (accountInfo?.platform === "instagram") {
          const igType = instagramPostType[accountId] ?? "image";
          let mediaType: "REELS" | "CAROUSEL" | "STORIES" | "IMAGE";
          if (igType === "story") {
            mediaType = "STORIES";
          } else if (igType === "reel") {
            mediaType = "REELS";
          } else {
            mediaType = media.length > 1 ? "CAROUSEL" : "IMAGE";
          }
          options = { instagramMediaType: mediaType };
        }

        const customCaption = platformCaptions[accountId];
        if (customCaption) {
          options = {
            ...options,
            caption: customCaption,
          };
        }

        await schedule.mutateAsync({
          postId,
          connectedAccountId: accountId,
          options,
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setPublishingMode(null);
      return;
    }

    // Separate try/catch for QStash so a delivery failure doesn't lose the post.
    // The post + media are already persisted at this point.
    try {
      await schedulePublish.mutateAsync({
        postId,
        scheduledAtMs: scheduledDate?.getTime(),
      });
      reset();
      toast.success("Post scheduled successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      // Post is saved but QStash couldn't queue it (e.g. loopback in dev).
      // User can retry from the post detail page.
      toast.error(
        `Post saved but scheduling failed: ${msg}. You can retry from All Posts.`,
        { duration: 8000 },
      );
    } finally {
      setPublishingMode(null);
    }
  };

  return {
    handlePublish,
    publishingMode,
  };
}
