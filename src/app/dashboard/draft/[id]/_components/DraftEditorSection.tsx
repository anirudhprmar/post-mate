"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import { BulletList, OrderedList } from "@tiptap/extension-list";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";

import { TiptapEditor } from "~/components/tiptap-editor";
import { EditorToolbar } from "~/components/editor-toolbar";
import EmojiSuggestion from "~/lib/emoji-suggestions";

interface DraftEditorSectionProps {
  initialContent: string;
  activeLimit: number;
  onChange: (html: string) => void;
}

export default function DraftEditorSection({
  initialContent,
  activeLimit,
  onChange,
}: DraftEditorSectionProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      Placeholder.configure({ placeholder: "What's on your mind?" }),
      CharacterCount,
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
        suggestion: EmojiSuggestion,
      }),
      BulletList,
      OrderedList,
      Typography,
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="bg-background/50 border-border/50 focus-within:ring-primary/20 flex flex-col gap-2 rounded-2xl border p-3 focus-within:ring-2">
      <TiptapEditor editor={editor} />
      <EditorToolbar editor={editor} limit={activeLimit} />
    </div>
  );
}
