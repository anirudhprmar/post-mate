"use client";

import clsx from "clsx";
import { Button } from "~/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";
import { formatMonthYear, formatWeekRange, startOfWeek } from "./calendar-helpers";
import type { ViewMode } from "./calendar-types";

interface CalendarToolbarProps {
  view: ViewMode;
  current: Date;
  onNavigate: (dir: -1 | 1) => void;
  onToday: () => void;
  onViewChange: (v: ViewMode) => void;
}

export default function CalendarToolbar({
  view,
  current,
  onNavigate,
  onToday,
  onViewChange,
}: CalendarToolbarProps) {
  const title =
    view === "month"
      ? formatMonthYear(current)
      : formatWeekRange(startOfWeek(current));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-border/50"
          onClick={() => onNavigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[180px] text-center text-sm font-semibold">
          {title}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-border/50"
          onClick={() => onNavigate(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-xs"
          onClick={onToday}
        >
          Today
        </Button>
      </div>

      {/* View toggle */}
      <div className="bg-muted/40 border-border/40 flex items-center gap-1 rounded-full border p-1">
        {(["month", "week"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={clsx(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all",
              view === v
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v === "month" ? (
              <LayoutGrid className="h-3.5 w-3.5" />
            ) : (
              <CalendarDays className="h-3.5 w-3.5" />
            )}
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
