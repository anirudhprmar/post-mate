"use client";

import * as React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus, Loader2, Send } from "lucide-react";
import MonthView from "./_components/MonthView";
import WeekView from "./_components/WeekView";
import CalendarToolbar from "./_components/CalendarToolbar";
import PostDetailSheet from "./_components/PostDetailSheet";
import {
  getPostDate,
  addMonths,
  addWeeks,
  STATUS_DOT,
  POST_STATUS_CONFIG,
} from "./_components/calendar-helpers";
import type { ViewMode, CalendarPost } from "./_components/calendar-types";
import type { PostStatus } from "~/lib/types";

export default function CalendarClientPage() {
  const today = React.useMemo(() => new Date(), []);
  const [view, setView] = React.useState<ViewMode>("month");
  const [current, setCurrent] = React.useState<Date>(today);
  const [selectedPost, setSelectedPost] = React.useState<CalendarPost | null>(
    null,
  );

  const { data: allPosts, isLoading } = api.post.getAll.useQuery();

  const datedPosts = React.useMemo(
    () => (allPosts ?? []).filter((p) => getPostDate(p) !== null),
    [allPosts],
  );

  const scheduledCount = (allPosts ?? []).filter(
    (p) => p.status === "scheduled",
  ).length;
  const publishedCount = (allPosts ?? []).filter(
    (p) => p.status === "published",
  ).length;

  function navigate(dir: -1 | 1) {
    setCurrent((prev) =>
      view === "month" ? addMonths(prev, dir) : addWeeks(prev, dir),
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="bg-mesh animate-mesh pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20" />

      <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto w-full max-w-7xl space-y-6 p-4 duration-700 ease-out md:p-8">
        <header className="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-foreground/90 text-4xl leading-tight font-bold tracking-tight">
              Calendar
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {scheduledCount} scheduled · {publishedCount} published
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="shrink-0 gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </header>

        <CalendarToolbar
          view={view}
          current={current}
          onNavigate={navigate}
          onToday={() => setCurrent(today)}
          onViewChange={setView}
        />

        <div className="flex flex-wrap items-center gap-4 px-2">
          {(["scheduled", "published", "draft", "failed"] as PostStatus[]).map(
            (s) => (
              <div
                key={s}
                className="text-muted-foreground flex items-center gap-1.5 text-xs"
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[s]}`}
                />
                {POST_STATUS_CONFIG[s]?.label ?? s}
              </div>
            ),
          )}
        </div>

        <div className="bg-background/40 border-border/40 overflow-hidden rounded-3xl border backdrop-blur-xl">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="text-muted-foreground/50 h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {view === "month" ? (
                <MonthView
                  current={current}
                  posts={datedPosts}
                  today={today}
                  onSelectPost={setSelectedPost}
                />
              ) : (
                <WeekView
                  current={current}
                  posts={datedPosts}
                  today={today}
                  onSelectPost={setSelectedPost}
                />
              )}

              {datedPosts.length === 0 && (
                <div className="border-border/40 flex flex-col items-center gap-3 border-t py-10 text-center">
                  <div className="bg-muted/50 text-muted-foreground flex h-14 w-14 items-center justify-center rounded-2xl">
                    <Send className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">No scheduled posts yet</p>
                  <p className="text-muted-foreground max-w-xs text-xs">
                    Schedule a post and it will appear on the calendar.
                  </p>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border/50 mt-1 rounded-full"
                    >
                      Create a post
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PostDetailSheet
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
