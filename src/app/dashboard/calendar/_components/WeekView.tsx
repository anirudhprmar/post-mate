"use client";

import clsx from "clsx";
import PostPill from "./PostPill";
import { WEEKDAYS, startOfWeek, isSameDay, getPostDate } from "./calendar-helpers";
import type { CalendarPost } from "./calendar-types";

interface WeekViewProps {
  current: Date;
  posts: CalendarPost[];
  today: Date;
  onSelectPost: (post: CalendarPost) => void;
}

export default function WeekView({
  current,
  posts,
  today,
  onSelectPost,
}: WeekViewProps) {
  const weekStart = startOfWeek(current);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div>
      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-border/40">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div key={i} className="py-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {WEEKDAYS[i]}
              </p>
              <span
                className={clsx(
                  "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Posts columns */}
      <div className="grid min-h-[220px] grid-cols-7 divide-x divide-border/40">
        {days.map((day, i) => {
          const dayPosts = posts.filter((p) => {
            const d = getPostDate(p);
            return d && isSameDay(d, day);
          });

          return (
            <div key={i} className="space-y-1.5 p-2">
              {dayPosts.map((p) => (
                <PostPill key={p.id} post={p} onClick={() => onSelectPost(p)} />
              ))}
              {dayPosts.length === 0 && (
                <div className="flex h-full min-h-[160px] items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/30">—</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
