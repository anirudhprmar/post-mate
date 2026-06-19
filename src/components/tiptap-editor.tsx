"use client";

import { EditorContent, type Editor } from "@tiptap/react";

interface TiptapEditorProps {
  editor: Editor | null;
}

export function TiptapEditor({ editor }: TiptapEditorProps) {
  return (
    <EditorContent
      editor={editor}
      className="text-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground overflow-y-auto px-4 pt-4 pb-2 text-sm leading-relaxed [&_.tiptap]:h-20 [&_.tiptap]:outline-none [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5"
    />
  );
}
