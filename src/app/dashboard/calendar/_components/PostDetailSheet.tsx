"use client";

import clsx from "clsx";
import { platformIcons } from "~/lib/platform-icons";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { POST_STATUS_CONFIG, getPostDate } from "./calendar-helpers";
import type { PostStatus } from "~/lib/types";
import type { CalendarPost } from "./calendar-types";

interface PostDetailSheetProps {
  post: CalendarPost | null;
  open: boolean;
  onClose: () => void;
}

export default function PostDetailSheet({
  post,
  open,
  onClose,
}: PostDetailSheetProps) {
  if (!post) return null;

  const cfg =
    POST_STATUS_CONFIG[post.status as PostStatus] ?? POST_STATUS_CONFIG.draft;
  const StatusIcon = cfg.icon;
  const platforms = [
    ...new Set(post.targets.map((t) => t.connectedAccount.platform)),
  ];
  const postDate = getPostDate(post);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="border-border/40 w-full max-w-sm overflow-y-auto sm:max-w-md"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">Post Details</SheetTitle>
          <SheetDescription>
            {postDate
              ? postDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "No date set"}
          </SheetDescription>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                cfg.badge as
                  | "default"
                  | "secondary"
                  | "outline"
                  | "destructive"
              }
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            >
              <StatusIcon
                className={clsx(
                  "h-3.5 w-3.5",
                  post.status === "publishing" && "animate-spin",
                )}
              />
              {cfg.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-5 px-4">

          {/* Content */}
          <div className="bg-muted/30 border-border/40 rounded-2xl border p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {post.content || (
                <span className="text-muted-foreground italic">No content</span>
              )}
            </p>
          </div>

          {/* Platforms */}
          {platforms.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                Platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => {
                  const Icon = platformIcons[p];
                  return (
                    <div
                      key={p}
                      className="bg-muted/50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {p}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-border/40 grid grid-cols-1 gap-3 rounded-2xl border p-4">
            {post.scheduledFor && (
              <div>
                <p className="text-muted-foreground mb-0.5 text-xs">
                  Scheduled for
                </p>
                <p className="text-sm font-medium">
                  {new Date(post.scheduledFor).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
            {post.publishedAt && (
              <div>
                <p className="text-muted-foreground mb-0.5 text-xs">
                  Published at
                </p>
                <p className="text-sm font-medium">
                  {new Date(post.publishedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground mb-0.5 text-xs">Created</p>
              <p className="text-sm font-medium">
                {new Date(post.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
