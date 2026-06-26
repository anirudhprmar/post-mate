"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import { BulletList, OrderedList } from "@tiptap/extension-list";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { TiptapEditor } from "./tiptap-editor";
import { EditorToolbar } from "./editor-toolbar";
import EmojiSuggestion from "~/lib/emoji-suggestions";
import { usePostStore } from "~/store/post";
import { api } from "~/trpc/react";
import { useEffect, useMemo } from "react";

export const PLATFORM_LIMITS: Record<string, number> = {
  instagram: 2000,
  x: 280,
  facebook: 63206,
  linkedin: 3000,
  youtube: 5000,
  threads: 500,
};

const DEFAULT_LIMIT = 63206; // highest platform limit as fallback

export function PostEditor() {
  const content = usePostStore((state) => state.content);
  const setContent = usePostStore((state) => state.setContent);
  const setIsOverLimit = usePostStore((state) => state.setIsOverLimit);
  const selectedAccountIds = usePostStore((state) => state.selectedAccountIds);

  const { data: connectedAccounts = [] } =
    api.connectedAccount.getAll.useQuery();

  // Derive the strictest limit from selected accounts
  const activeLimit = useMemo(() => {
    if (selectedAccountIds.length === 0) return DEFAULT_LIMIT;

    const selectedPlatforms = connectedAccounts
      .filter((a) => selectedAccountIds.includes(a.id))
      .map((a) => a.platform.toLowerCase());

    if (selectedPlatforms.length === 0) return DEFAULT_LIMIT;

    return Math.min(
      ...selectedPlatforms.map((p) => PLATFORM_LIMITS[p] ?? DEFAULT_LIMIT),
    );
  }, [selectedAccountIds, connectedAccounts]);

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
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      const len = editor.getText({ blockSeparator: "\n" }).length;
      setIsOverLimit(len > activeLimit);
    },
    immediatelyRender: false,
    autofocus: true,
  });

  useEffect(() => {
    if (!editor) return;
    const len = editor.getText({ blockSeparator: "\n" }).length;
    setIsOverLimit(len > activeLimit);
  }, [activeLimit, editor, setIsOverLimit]);

  return (
    <div className="bg-card flex flex-col gap-5 rounded-md">
      <TiptapEditor editor={editor} />
      <EditorToolbar editor={editor} limit={activeLimit} />
    </div>
  );
}
