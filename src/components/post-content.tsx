"use client";

import { X, User, Loader2, CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";
import InsertMedia from "./insert-media";
import { PostEditor } from "./post-editor";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/post";
import Image from "next/image";
import {
  XIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  ThreadsIcon,
  YouTubeIcon,
} from "~/lib/platform-icons";
import { uploadAllMedia } from "~/lib/upload-media";
import { format } from "date-fns";

const platformIcons: Record<
  string,
  React.FC<{ size?: number } & React.SVGProps<SVGSVGElement>>
> = {
  x: XIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  threads: ThreadsIcon,
  youtube: YouTubeIcon,
};

export default function PostContent() {
  const { data: connectedAccounts = [], isLoading } =
    api.connectedAccount.getAll.useQuery();
  const content = usePostStore((state) => state.content);
  const selectedAccountIds = usePostStore((state) => state.selectedAccountIds);
  const toggleAccount = usePostStore((state) => state.toggleAccount);
  const media = usePostStore((state) => state.media);
  const removeMedia = usePostStore((state) => state.removeMedia);
  const reset = usePostStore((state) => state.reset);
  const scheduledDate = usePostStore((state) => state.scheduledDate);
  const setScheduledDate = usePostStore((state) => state.setScheduledDate);

  const [userSelectedPreviewId, setUserSelectedPreviewId] = useState<
    string | null
  >(null);
  const [publishingMode, setPublishingMode] = useState<
    "draft" | "schedule" | null
  >(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleHour, setScheduleHour] = useState("12");
  const [scheduleMinute, setScheduleMinute] = useState("00");

  const createPost = api.post.createPost.useMutation();
  const createDraft = api.draft.create.useMutation();
  const createUploadUrl = api.media.createUploadUrl.useMutation();
  const confirmUpload = api.media.confirmUpload.useMutation();
  const confirmStatus = api.post.confirmStatus.useMutation();
  const schedule = api.post.schedule.useMutation();

  const selectedAccounts = connectedAccounts.filter((ca) =>
    selectedAccountIds.includes(ca.id),
  );

  const activePreviewId = selectedAccountIds.includes(
    userSelectedPreviewId as string,
  )
    ? userSelectedPreviewId
    : (selectedAccounts[0]?.id ?? null);

  const activePreviewAccount = selectedAccounts.find(
    (a) => a.id === activePreviewId,
  );

  const handlePublish = async (mode: "draft" | "schedule") => {
    if (selectedAccountIds.length === 0) return;

    setPublishingMode(mode);
    setPublishError(null);

    if (mode === "schedule") {
      if (!scheduledDate || scheduledDate <= new Date()) {
        setPublishError("Scheduled time must be in the future.");
        setPublishingMode(null);
        return;
      }
    }

    try {
      if (mode === "draft") {
        const uploadedMedia = await uploadAllMedia(media, (input) =>
          createUploadUrl.mutateAsync(input),
        );

        for (const account of selectedAccounts) {
          await createDraft.mutateAsync({
            content,
            platform: account.platform,
            media: uploadedMedia,
          });
        }
        reset();
        return;
      }

      const post = await createPost.mutateAsync({
        content: content,
      });
      const postId = post.id;

      if (media.length > 0) {
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
      reset();
    } catch (err) {
      setPublishError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setPublishingMode(null);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 font-bold">Your Post</p>

          <div className="space-y-4">
            {/* accounts available  */}
            <div>
              <p className="mb-2 text-sm font-medium">Accounts</p>
              <div className="flex flex-wrap gap-1">
                {isLoading ? (
                  <div className="bg-muted h-8 w-24 animate-pulse rounded-full"></div>
                ) : connectedAccounts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No accounts connected.
                  </p>
                ) : (
                  connectedAccounts.map((account) => {
                    const isSelected = selectedAccountIds.includes(account.id);
                    return (
                      <button
                        key={account.id}
                        onClick={() => toggleAccount(account.id)}
                        className={`relative flex items-center justify-center rounded-full border-2 p-0.5 transition-colors ${isSelected ? "border-primary" : "hover:border-border border-transparent"}`}
                      >
                        {account.avatarUrl ? (
                          <>
                            <Image
                              src={account.avatarUrl}
                              alt={account.username}
                              width={8}
                              height={8}
                              className="h-8 w-8 rounded-full"
                              referrerPolicy="no-referrer"
                            />
                          </>
                        ) : (
                          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                            <User className="text-primary h-4 w-4" />
                          </div>
                        )}
                        {(() => {
                          const Icon =
                            platformIcons[account.platform.toLowerCase()];
                          if (!Icon) return null;
                          return (
                            <div className="absolute -right-3 -bottom-2 rounded-full p-[4px]">
                              <Icon className="h-3 w-3" />
                            </div>
                          );
                        })()}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-muted/70 flex flex-col gap-2 rounded-md p-3">
              <InsertMedia />

              {media.length > 0 && (
                <div className="flex flex-wrap gap-2 py-2">
                  {media.map((m) => (
                    <div
                      key={m.id}
                      className="group bg-card relative h-20 w-20 overflow-hidden rounded-md border"
                    >
                      {m.type === "image" ? (
                        <img
                          src={m.previewUrl}
                          alt="Media"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={m.previewUrl}
                          className="h-full w-full object-cover"
                        />
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
              )}

              <PostEditor />
            </div>
          </div>
        </div>
        <div className="flex flex-col border-l pl-3">
          <p className="mb-2 font-bold">Post Preview</p>
          <div className="flex flex-col gap-4">
            {selectedAccounts.length === 0 ? (
              <div className="bg-muted rounded-sm border border-dashed p-3 py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Select an account to preview your post.
                </p>
              </div>
            ) : (
              <>
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                  {selectedAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => setUserSelectedPreviewId(account.id)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                        activePreviewId === account.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                    >
                      {account.avatarUrl ? (
                        <Image
                          src={account.avatarUrl}
                          alt={account.username}
                          width={16}
                          height={16}
                          className="h-4 w-4 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="bg-primary/10 flex h-4 w-4 items-center justify-center rounded-full">
                          <User className="text-primary h-3 w-3" />
                        </div>
                      )}
                      <span className="capitalize">{account.platform}</span>
                    </button>
                  ))}
                </div>

                {activePreviewAccount && (
                  <div className="bg-card rounded-md border p-4 shadow-sm">
                    <div className="border-border/50 mb-3 flex items-center gap-3 border-b pb-3">
                      {activePreviewAccount.avatarUrl ? (
                        <Image
                          src={activePreviewAccount.avatarUrl}
                          alt={activePreviewAccount.username}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                          <User className="text-primary h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm leading-none font-semibold">
                          {activePreviewAccount.username}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs capitalize">
                          {activePreviewAccount.platform}
                        </p>
                      </div>
                    </div>
                    <div
                      className="tiptap max-w-none text-sm break-words whitespace-pre-wrap [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{
                        __html:
                          content ||
                          (media.length === 0
                            ? '<span class="text-muted-foreground italic">Write something to preview...</span>'
                            : ""),
                      }}
                    />
                    {media.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {media.map((m) => (
                          <div
                            key={m.id}
                            className="bg-muted relative aspect-square overflow-hidden rounded-md sm:aspect-video"
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
                                controls
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex w-full items-center justify-end gap-2">
        {publishError && (
          <p className="text-destructive mr-auto text-sm">{publishError}</p>
        )}
        <Button
          variant={"secondary"}
          disabled={publishingMode !== null}
          onClick={() => handlePublish("draft")}
        >
          {publishingMode === "draft" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save as Draft
        </Button>
        <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"default"}
              disabled={
                publishingMode !== null || selectedAccountIds.length === 0
              }
            >
              {publishingMode === "schedule" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <CalendarIcon className="mr-2 h-4 w-4" />
              {scheduledDate
                ? format(scheduledDate, "MMM d, yyyy 'at' HH:mm")
                : "Schedule"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
            <div className="space-y-3 p-3">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setHours(
                      parseInt(scheduleHour),
                      parseInt(scheduleMinute),
                    );
                    setScheduledDate(newDate);
                  } else {
                    setScheduledDate(undefined);
                  }
                }}
                disabled={{ before: new Date() }}
              />
              <div className="border-t px-1 pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">Time</span>
                  <div className="ml-auto flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={scheduleHour}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 2);
                        setScheduleHour(val);
                        if (scheduledDate) {
                          const d = new Date(scheduledDate);
                          d.setHours(
                            parseInt(val) || 0,
                            parseInt(scheduleMinute),
                          );
                          setScheduledDate(d);
                        }
                      }}
                      className="bg-background focus:ring-ring w-12 rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none"
                    />
                    <span className="text-muted-foreground font-bold">:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={scheduleMinute}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 2);
                        setScheduleMinute(val);
                        if (scheduledDate) {
                          const d = new Date(scheduledDate);
                          d.setHours(
                            parseInt(scheduleHour),
                            parseInt(val) || 0,
                          );
                          setScheduledDate(d);
                        }
                      }}
                      className="bg-background focus:ring-ring w-12 rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!scheduledDate}
                onClick={() => {
                  setScheduleOpen(false);
                  handlePublish("schedule");
                }}
              >
                {scheduledDate
                  ? `Schedule for ${format(scheduledDate, "MMM d 'at' HH:mm")}`
                  : "Pick a date"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
