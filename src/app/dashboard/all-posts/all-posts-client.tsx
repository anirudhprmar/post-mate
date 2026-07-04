"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Scroll, Clock, CalendarCheck2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { platformIcons } from "~/lib/platform-icons";
import {
  timeAgo,
  POST_STATUS_CONFIG,
  getMediaUrl,
  getThumbnailUrl,
} from "~/lib/helpers";
import type { PostStatus } from "~/lib/types";

const STATUS_TABS = [
  "all",
  "draft",
  "scheduled",
  "published",
  "failed",
] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export default function AllPostsClientPage() {
  const [activeStatus, setActiveStatus] = useState<StatusTab>("all");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.post.getInfinite.useInfiniteQuery(
      {
        limit: 12,
        status: activeStatus,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const posts = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Subtle mesh background */}
      <div className="bg-mesh animate-mesh pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20" />

      <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto w-full max-w-5xl space-y-8 p-4 duration-700 ease-out md:p-8">
        {/* Header */}
        <header className="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-foreground/90 text-4xl leading-tight font-bold tracking-tight">
              All Posts
            </h1>
            <p className="text-muted-foreground mt-1 max-w-xl text-sm font-medium">
              Every post you&apos;ve created — drafts, scheduled, and published.
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="shrink-0 gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </header>

        {/* Status filter pills */}
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-2 pb-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${
                activeStatus === s
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/50 border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {s === "all"
                ? "All"
                : (POST_STATUS_CONFIG[s as PostStatus]?.label ?? s)}
            </button>
          ))}

          {/* Total count chip */}
          <span className="text-muted-foreground ml-auto shrink-0 text-xs">
            {totalCount} post{totalCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="text-muted-foreground/50 h-8 w-8 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="border-border/50 bg-background/20 mx-2 flex flex-col items-center justify-center rounded-4xl border border-dashed px-4 py-24 text-center backdrop-blur-sm">
            <div className="bg-muted/50 text-muted-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-3xl">
              <Scroll className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No posts found</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              {activeStatus === "all"
                ? "You haven't created any posts yet."
                : `No ${activeStatus} posts yet.`}
            </p>
            <Link href="/dashboard" className="mt-6">
              <Button
                variant="outline"
                className="hover:bg-muted/50 border-border/50 rounded-full shadow-sm"
              >
                Create your first post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 px-2 pb-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cfg =
                POST_STATUS_CONFIG[post.status as PostStatus] ??
                POST_STATUS_CONFIG.draft;
              const StatusIcon = cfg.icon;
              const platforms = post.targets.map((t) =>
                t.connectedAccount.platform.toLowerCase(),
              );
              const uniquePlatforms = [...new Set(platforms)];

              return (
                <Card
                  key={post.id}
                  className="border-border/40 group bg-background/40 hover:bg-background/60 hover:shadow-foreground/5 flex min-h-[168px] cursor-pointer flex-col justify-between rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Content preview */}
                  <div className="space-y-3">
                    <p className="group-hover:text-primary line-clamp-3 text-sm leading-relaxed font-medium transition-colors">
                      {post.content || (
                        <span className="text-muted-foreground italic">
                          No content
                        </span>
                      )}
                    </p>
                    {post.media && (post.media as any[]).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 overflow-hidden">
                        {(post.media as any[]).slice(0, 4).map((item, idx) => (
                          <div
                            key={idx}
                            className="border-border/30 bg-muted/20 relative h-fit w-fit shrink-0 overflow-hidden rounded-xl border"
                          >
                            {item.type === "image" ? (
                              <img
                                src={getMediaUrl(item.url, item.key)}
                                alt="Media"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="relative flex h-full w-full items-center justify-center">
                                {item.thumbnailUrl ? (
                                  <img
                                    src={getThumbnailUrl(item.thumbnailUrl)}
                                    alt="Thumbnail"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={getMediaUrl(item.url, item.key)}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {(post.media as any[]).length > 4 && (
                          <div className="bg-muted border-border/30 text-muted-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border text-xs font-bold">
                            +{(post.media as any[]).length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="mt-5 flex items-center justify-between gap-2">
                    {/* Platform icons + time */}
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      {/* Platform icons */}
                      {uniquePlatforms.length > 0 ? (
                        <div className="flex -space-x-1">
                          {uniquePlatforms.slice(0, 4).map((p) => {
                            const Icon = platformIcons[p];
                            return Icon ? (
                              <div
                                key={p}
                                className="bg-muted ring-background flex h-5 w-5 items-center justify-center rounded-full ring-1"
                                title={p}
                              >
                                <Icon className="h-3 w-3" />
                              </div>
                            ) : null;
                          })}
                          {uniquePlatforms.length > 4 && (
                            <div className="bg-muted ring-background flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-1">
                              +{uniquePlatforms.length - 4}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(post.createdAt)}
                      </span>

                      {post.scheduledFor && post.status === "scheduled" && (
                        <span className="flex items-center gap-1">
                          <CalendarCheck2 className="h-3 w-3" />
                          {new Date(post.scheduledFor).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      )}
                    </div>

                    {/* Status badge */}
                    <Badge
                      variant={
                        cfg.badge as
                          | "default"
                          | "secondary"
                          | "outline"
                          | "destructive"
                      }
                      className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-none"
                    >
                      <StatusIcon
                        className={`h-3 w-3 ${post.status === "publishing" ? "animate-spin" : ""}`}
                      />
                      {cfg.label}
                    </Badge>
                  </div>
                </Card>
              );
            })}

            {/* Intersection observer target for infinite scroll */}
            <div
              ref={observerRef}
              className="col-span-full flex h-16 items-center justify-center"
            >
              {isFetchingNextPage && (
                <Loader2 className="text-muted-foreground/50 h-8 w-8 animate-spin" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
