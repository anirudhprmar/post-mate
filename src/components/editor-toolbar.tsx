"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  Smile,
  PlusIcon,
  List,
  ListOrdered,
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

interface EditorToolbarProps {
  editor: Editor | null;
  limit: number;
}

export function EditorToolbar({ editor, limit }: EditorToolbarProps) {
  const activeMarks = useEditorState({
    editor,
    selector: (ctx) => ({
      bulletList: ctx.editor?.isActive("bulletList") ?? false,
      orderedList: ctx.editor?.isActive("orderedList") ?? false,
      bold: ctx.editor?.isActive("bold") ?? false,
      italic: ctx.editor?.isActive("italic") ?? false,
      strike: ctx.editor?.isActive("strike") ?? false,
      underline: ctx.editor?.isActive("underline") ?? false,
      // Use plain-text length (includes \n for paragraph breaks) to match
      // how platforms like X count characters.
      charCount: ctx.editor?.getText({ blockSeparator: "\n" }).length ?? 0,
      wordCount: ctx.editor?.storage.characterCount.words() ?? 0,
    }),
  });

  const charCount = activeMarks?.charCount ?? 0;
  const remaining = limit - charCount;
  const usedPct = charCount / limit;

  // Color thresholds
  const counterColor =
    remaining < 0
      ? "text-red-500"
      : usedPct >= 0.9
        ? "text-red-400"
        : usedPct >= 0.75
          ? "text-amber-400"
          : "text-muted-foreground";

  // Circular progress ring
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(usedPct, 1);
  const strokeDashoffset = circumference * (1 - clampedPct);

  const ringColor =
    remaining < 0
      ? "#ef4444"
      : usedPct >= 0.9
        ? "#f87171"
        : usedPct >= 0.75
          ? "#fbbf24"
          : "#6b7280";

  const tools = [
    {
      icon: Bold,
      action: () => editor?.chain().focus().toggleBold().run(),
      active: activeMarks?.bold,
      title: "Bold",
    },
    {
      icon: Italic,
      action: () => editor?.chain().focus().toggleItalic().run(),
      active: activeMarks?.italic,
      title: "Italic",
    },
    {
      icon: UnderlineIcon,
      action: () => editor?.chain().focus().toggleUnderline().run(),
      active: activeMarks?.underline,
      title: "Underline",
    },
    {
      icon: Strikethrough,
      action: () => editor?.chain().focus().toggleStrike().run(),
      active: activeMarks?.strike,
      title: "Strikethrough",
    },
    {
      icon: List,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      active: activeMarks?.bulletList,
      title: "Bullet list",
    },
    {
      icon: ListOrdered,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      active: activeMarks?.orderedList,
      title: "Ordered list",
    },
    {
      icon: Smile,
      action: () => {
        editor?.chain().focus().insertContent(":").run();
      },
      active: false,
      title: "Emoji",
    },
  ];

  return (
    <div className="flex min-h-[52px] flex-wrap items-center gap-1 border-t border-[#1e1e1c] px-3 py-2">
      {/* Formatting tools */}
      {tools.map(({ icon: Icon, action, active, title }, i) => (
        <Button
          variant={"ghost"}
          size={"sm"}
          key={i}
          title={title}
          onClick={(e) => {
            e.preventDefault();
            action();
          }}
          className={cn(
            "rounded-sm border p-1.5 transition-colors",
            active
              ? "border-primary/80 bg-primary/10 text-primary"
              : "hover:border-secondary-foreground",
          )}
        >
          <Icon size={13} />
        </Button>
      ))}

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Character counter */}
        {charCount > 0 && (
          <div className="flex items-center gap-1.5">
            {/* Circular ring */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              className="-rotate-90"
            >
              {/* Track */}
              <circle
                cx="11"
                cy="11"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-muted/40"
              />
              {/* Progress */}
              <circle
                cx="11"
                cy="11"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200"
              />
            </svg>

            {/* Numeric countdown (only show when close or over) */}
            {usedPct >= 0.75 && (
              <span
                className={cn("text-xs font-medium tabular-nums", counterColor)}
              >
                {remaining}
              </span>
            )}
          </div>
        )}

        {/* Thread add button */}
        <Button
          variant={"default"}
          size={"lg"}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300",
            (activeMarks?.wordCount ?? 0) > 0
              ? "visible scale-100 opacity-100"
              : "invisible scale-95 opacity-0",
          )}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
