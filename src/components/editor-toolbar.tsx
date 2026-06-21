"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  Smile,
  PlusIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const activeMarks = useEditorState({
    editor,
    selector: (ctx) => ({
      bulletList: ctx.editor?.isActive("bulletList") ?? false,
      orderedList: ctx.editor?.isActive("orderedList") ?? false,
      wordCount: ctx.editor?.storage.characterCount.words() ?? 0,
    }),
  });

  const tools = [
    {
      icon: List,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      active: activeMarks?.bulletList,
    },
    {
      icon: Smile,
      action: () => {
        editor?.chain().focus().insertContent(":").run();
      },
      active: false, // emoji has no "active" state
    },
    {
      icon: ListOrdered,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      active: activeMarks?.orderedList,
    },
  ];

  return (
    <div className="flex min-h-[52px] flex-wrap items-center gap-1 border-t border-[#1e1e1c] px-3 py-2">
      {/* Formatting tools */}
      {tools.map(({ icon: Icon, action, active }, i) => (
        <Button
          variant={"ghost"}
          size={"sm"}
          key={i}
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
      <div className="ml-auto flex items-center gap-2">
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
