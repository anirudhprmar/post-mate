"use client";

import { EditorContent, type Editor } from "@tiptap/react";

interface TiptapEditorProps {
  editor: Editor | null;
}

export function TiptapEditor({ editor }: TiptapEditorProps) {
  return (
    <EditorContent
      editor={editor}
      className="px-4 pt-4 pb-2 text-sm leading-relaxed text-[#c8c4bc] [&_.tiptap]:h-fit [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-[#333330] [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] overflow-y-auto"
    />
  );
}
