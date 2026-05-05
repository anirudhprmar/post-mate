"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import { BulletList, OrderedList } from "@tiptap/extension-list";
import Typography from '@tiptap/extension-typography'
import { TiptapEditor } from "./tiptap-editor";
import { EditorToolbar } from "./editor-toolbar";
import EmojiSuggestion from '~/lib/emoji-suggestions'


const LIMIT = 250; // will depend on each platform and will be different


export function PostEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bulletList: false, orderedList: false }),
      Placeholder.configure({ placeholder: "What's on your mind?" }),
      CharacterCount.configure({ limit: LIMIT }),
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
        suggestion: EmojiSuggestion,
      }),
      BulletList,
      OrderedList,
      Typography,
    ],
    immediatelyRender: false,
    autofocus: true,
  });

  return (
    <div className="flex flex-col gap-5 bg-card rounded-md">
      <TiptapEditor editor={editor} />
      <EditorToolbar editor={editor} />
    </div>
  );
}

