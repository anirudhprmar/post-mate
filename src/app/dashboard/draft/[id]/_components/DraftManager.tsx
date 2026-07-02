"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { uploadAllMedia } from "~/lib/upload-media";
import { PLATFORM_LIMITS } from "~/components/post-editor";
import { type DraftMediaItem } from "~/lib/types";

import DraftActionHeader from "./DraftActionHeader";
import DraftEditorSection from "./DraftEditorSection";
import DraftMediaSection from "./DraftMediaSection";
import DraftAccountSelection from "./DraftAccountSelection";
import DraftLivePreview from "./DraftLivePreview";

interface DraftManagerProps {
  draft: {
    id: string;
    content: string;
    platform: string;
    media: any;
  };
  refetch: () => Promise<any>;
}

export default function DraftManager({ draft, refetch }: DraftManagerProps) {
  const router = useRouter();

  const { data: connectedAccounts = [] } =
    api.connectedAccount.getAll.useQuery();

  const updateDraft = api.draft.update.useMutation();
  const deleteDraft = api.draft.delete.useMutation();

  const createPost = api.post.createPost.useMutation();
  const confirmUpload = api.media.confirmUpload.useMutation();
  const confirmStatus = api.post.confirmStatus.useMutation();
  const schedule = api.post.schedule.useMutation();
  const schedulePublish = api.post.schedulePublish.useMutation();
  const createUploadUrl = api.media.createUploadUrl.useMutation();

  // Initialize state directly from the loaded draft
  const [platform, setPlatform] = useState<string>(draft.platform);
  const [content, setContent] = useState<string>(draft.content);
  const [mediaList, setMediaList] = useState<DraftMediaItem[]>(() => {
    return ((draft.media as any[]) ?? []).map((item) => ({
      id: item.id || crypto.randomUUID(),
      url: item.url,
      key: item.key,
      type: item.type,
      mimeType: item.mimeType,
      thumbnailUrl: item.thumbnailUrl,
    }));
  });

  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(() => {
    const filtered = connectedAccounts.filter(
      (acc) =>
        acc.platform.toLowerCase() === draft.platform.toLowerCase() &&
        acc.status === "active",
    );
    return filtered[0] ? [filtered[0].id] : [];
  });

  const [userSelectedPreviewId, setUserSelectedPreviewId] = useState<
    string | null
  >(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const activeLimit = PLATFORM_LIMITS[platform] ?? 63206;

  // Extract clean text to verify limit
  const plainTextLength = content.replace(/<[^>]+>/g, "").length;
  const isOverLimit = plainTextLength > activeLimit;
  const isEmpty = content.replace(/<[^>]+>/g, "").trim().length === 0;

  const accountsForPlatform = useMemo(() => {
    return connectedAccounts.filter(
      (acc) =>
        acc.platform.toLowerCase() === platform.toLowerCase() &&
        acc.status === "active",
    );
  }, [platform, connectedAccounts]);

  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
    const filtered = connectedAccounts.filter(
      (acc) =>
        acc.platform.toLowerCase() === newPlatform.toLowerCase() &&
        acc.status === "active",
    );
    setSelectedAccountIds(filtered[0] ? [filtered[0].id] : []);
  };

  const handleToggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleImagesSelected = (files: File[]) => {
    const newMedia = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      type: "image" as const,
      mimeType: file.type,
    }));
    setMediaList((prev) => [...prev, ...newMedia]);
  };

  const handleVideosSelected = (files: File[]) => {
    const newMedia = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      type: "video" as const,
      mimeType: file.type,
    }));
    setMediaList((prev) => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (id: string) => {
    const itemToRemove = mediaList.find((m) => m.id === id);
    if (itemToRemove?.previewUrl) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }
    setMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  const uploadNewMedia = async () => {
    const toUpload = mediaList.filter((item) => item.file);
    if (toUpload.length === 0) {
      return mediaList.map((item) => ({
        url: item.url!,
        key: item.key!,
        type: item.type,
        mimeType: item.mimeType,
        thumbnailUrl: item.thumbnailUrl,
      }));
    }

    const uploadItems = toUpload.map((item) => ({
      id: item.id,
      file: item.file!,
      previewUrl: item.previewUrl!,
      type: item.type,
    }));

    const uploaded = await uploadAllMedia(uploadItems, (input) =>
      createUploadUrl.mutateAsync(input),
    );

    let uploadIndex = 0;
    const finalMedia = mediaList.map((item) => {
      if (item.file) {
        const res = uploaded[uploadIndex++];
        return {
          url: res?.url ?? "",
          key: res?.key ?? "",
          type: res?.type ?? "image",
          mimeType: res?.mimeType,
          thumbnailUrl: res?.thumbnailUrl,
        };
      } else {
        return {
          url: item.url!,
          key: item.key!,
          type: item.type,
          mimeType: item.mimeType,
          thumbnailUrl: item.thumbnailUrl,
        };
      }
    });

    return finalMedia;
  };

  const handleSaveUpdate = async () => {
    setIsSaving(true);
    try {
      const finalMedia = await uploadNewMedia();
      await updateDraft.mutateAsync({
        id: draft.id,
        content,
        platform: platform as any,
        media: finalMedia,
      });
      toast.success("Draft updated successfully.");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDraft.mutateAsync({ id: draft.id });
      toast.success("Draft deleted successfully.");
      router.push("/dashboard/drafts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setIsDeleting(false);
    }
  };

  const handleSchedule = async (date: Date) => {
    if (selectedAccountIds.length === 0) {
      toast.error("Please select at least one connected account.");
      return;
    }

    setIsScheduling(true);
    try {
      const finalMedia = await uploadNewMedia();
      const post = await createPost.mutateAsync({ content });
      const postId = post.id;

      if (finalMedia.length > 0) {
        await confirmUpload.mutateAsync({
          postId,
          media: finalMedia,
        });
      }

      await confirmStatus.mutateAsync({
        postId,
        status: "scheduled",
        scheduledFor: date,
      });

      for (const accountId of selectedAccountIds) {
        await schedule.mutateAsync({
          postId,
          connectedAccountId: accountId,
        });
      }

      try {
        await schedulePublish.mutateAsync({
          postId,
          scheduledAtMs: date.getTime(),
        });
        await deleteDraft.mutateAsync({ id: draft.id });
        toast.success("Post scheduled successfully.");
        router.push("/dashboard/all-posts");
      } catch (err) {
        await deleteDraft.mutateAsync({ id: draft.id });
        toast.error(
          `Post saved but scheduling failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }. Retrying from All Posts.`,
        );
        router.push("/dashboard/all-posts");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setIsScheduling(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto w-full max-w-6xl space-y-6 p-4 duration-700 ease-out md:p-8">
      <DraftActionHeader
        onBack={() => router.push("/dashboard/drafts")}
        onDelete={handleDelete}
        onSave={handleSaveUpdate}
        onSchedule={handleSchedule}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isScheduling={isScheduling}
        canSave={!isOverLimit && !isEmpty}
        canSchedule={!isOverLimit && !isEmpty && selectedAccountIds.length > 0}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Editor & Controls */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="border-border/40 bg-background/40 rounded-3xl p-6 backdrop-blur-xl">
            <div className="space-y-4">
              {/* Platform Selection */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  Platform
                </label>
                <Select value={platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger className="bg-background/50 border-border/50 w-full rounded-xl">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "instagram",
                      "x",
                      "facebook",
                      "linkedin",
                      "youtube",
                      "threads",
                    ].map((p) => (
                      <SelectItem key={p} value={p}>
                        <span className="capitalize">{p}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Selection */}
              <DraftAccountSelection
                platform={platform}
                accountsForPlatform={accountsForPlatform}
                selectedAccountIds={selectedAccountIds}
                onToggleAccount={handleToggleAccount}
              />

              {/* Editor */}
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  Post Editor
                </label>
                <DraftEditorSection
                  initialContent={draft.content}
                  activeLimit={activeLimit}
                  onChange={setContent}
                />
              </div>

              {/* Media Section */}
              <DraftMediaSection
                mediaList={mediaList}
                onImagesSelected={handleImagesSelected}
                onVideosSelected={handleVideosSelected}
                onRemoveMedia={handleRemoveMedia}
              />
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-4 lg:col-span-5">
          <DraftLivePreview
            platform={platform}
            accountsForPlatform={accountsForPlatform}
            activePreviewId={userSelectedPreviewId}
            onChangeActivePreviewId={setUserSelectedPreviewId}
            content={content}
            mediaList={mediaList}
          />
        </div>
      </div>
    </div>
  );
}
