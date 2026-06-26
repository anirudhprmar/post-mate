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
              const notJPEG = media.filter(
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
          await createDraft.mutateAsync({
            content,
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

    try {
      const post = await createPost.mutateAsync({
        content: content,
      });
      const postId = post.id;

      if (media.length > 0) {
        for (const account of selectedAccounts) {
          if (account.platform === "instagram") {
            setIsInsta(true);
            toast.error("Instagram accepts only JPEG format images.");
            break;
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

      for (const account of selectedAccountIds) {
        await schedule.mutateAsync({
          postId,
          connectedAccountId: account,
        });
      }

      await schedulePublish.mutateAsync({
        postId,
        scheduledAtMs: scheduledDate?.getTime(),
      });
      reset();
      toast.success("Post scheduled successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPublishingMode(null);
    }
  };

  return {
    handlePublish,
    publishingMode,
  };
}
