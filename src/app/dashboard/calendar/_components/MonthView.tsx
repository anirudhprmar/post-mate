"use client";

import clsx from "clsx";
import PostPill from "./PostPill";
import {
  WEEKDAYS,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  getPostDate,
} from "./calendar-helpers";
import type { CalendarPost } from "./calendar-types";

interface MonthViewProps {
  current: Date;
  posts: CalendarPost[];
  today: Date;
  onSelectPost: (post: CalendarPost) => void;
}

export default function MonthView({
  current,
  posts,
  today,
  onSelectPost,
}: MonthViewProps) {
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart);

  // Build 4–6 week grid
  const days: Date[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= monthEnd || days.length % 7 !== 0) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
    if (days.length > 42) break;
  }

  return (
    <div className="flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border/40">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === current.getMonth();
          const isToday = isSameDay(day, today);
          const dayPosts = posts.filter((p) => {
            const d = getPostDate(p);
            return d && isSameDay(d, day);
          });

          return (
            <div
              key={i}
              className={clsx(
                "min-h-[90px] border-b border-r border-border/40 p-1.5 transition-colors",
                !isCurrentMonth && "bg-muted/10",
              )}
            >
              {/* Day number */}
              <div className="mb-1 flex items-center justify-end">
                <span
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : isCurrentMonth
                        ? "text-foreground/80"
                        : "text-muted-foreground/40",
                  )}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Posts */}
              <div className="space-y-0.5">
                {dayPosts.slice(0, 3).map((p) => (
                  <PostPill key={p.id} post={p} onClick={() => onSelectPost(p)} />
                ))}
                {dayPosts.length > 3 && (
                  <p className="px-2 text-[10px] text-muted-foreground">
                    +{dayPosts.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
