"use client";

import clsx from "clsx";
import { platformIcons } from "~/lib/platform-icons";
import { STATUS_DOT, STATUS_PILL } from "./calendar-helpers";
import type { CalendarPost } from "./calendar-types";

interface PostPillProps {
  post: CalendarPost;
  onClick: () => void;
}

export default function PostPill({ post, onClick }: PostPillProps) {
  const platforms = [
    ...new Set(post.targets.map((t) => t.connectedAccount.platform)),
  ];

  return (
    <button
      onClick={onClick}
      className={clsx(
        "group flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[11px] font-medium transition-all hover:brightness-110 active:scale-95",
        STATUS_PILL[post.status] ?? "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={clsx(
          "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
          STATUS_DOT[post.status],
        )}
      />
      <span className="flex-1 truncate leading-tight">
        {post.content || "Untitled"}
      </span>
      {platforms.slice(0, 2).map((p) => {
        const Icon = platformIcons[p];
        return Icon ? (
          <Icon key={p} className="h-3 w-3 shrink-0 opacity-70" />
        ) : null;
      })}
    </button>
  );
}
