"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import {
  Bold,
  Underline as UnderlineIcon,
  Smile,
  ImageIcon,
  ItalicIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useRef, useState } from "react";

const EMOJI_TRAY = [
  ["smile","grinning","laughing","sweat_smile","rofl","heart_eyes","wink","blush"],
  ["sunglasses","thinking","hushed","flushed","rage","cry","sob","skull"],
  ["fire","sparkles","tada","rocket","zap","star","100","trophy"],
  ["heart","broken_heart","thumbsup","thumbsdown","clap","muscle","wave","ok_hand"],
  ["computer","iphone","camera","bulb","money_with_wings","chart_with_upwards_trend","loudspeaker","memo"],
];

const LIMIT = 2200;

export function PostEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        italic: { HTMLAttributes: { className: "italic" } },
      }),
      Placeholder.configure({ placeholder: "Write something …" }),
      CharacterCount.configure({ limit: LIMIT }),
      Image.configure({ inline: true }),
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
      }),
    ],
    immediatelyRender: false,
    autofocus: true,
  });

  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  const count = editor.storage.characterCount.characters();
  const pct = count / LIMIT;


  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#222220] bg-white">
      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="min-h-[220px] px-4 pt-4 pb-2 text-sm leading-relaxed text-[#c8c4bc] [&_.tiptap]:min-h-[200px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-[#333330] [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-t border-[#1e1e1c] px-3 py-2">
        {/* Media tools */}
        {[
          { icon: ImageIcon, label: "Insert Media" },
          // { icon: Zap, label: "AI Write" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 rounded-md border border-[#222220] px-2.5 py-1.5 font-mono text-[10px] text-[#4a4a44] transition-all hover:border-[#3a3a38] hover:bg-[#1a1a18] hover:text-[#8a8a7e]"
          >
            <Icon size={11} />
            {label}
          </button>
        ))}

        <div className="mx-1 h-4 w-px bg-[#222220]" />

        {/* Formatting tools */}
        {([
          {
            icon: Bold,
            action: () => editor.chain().focus().toggleBold().run(),
            inActive: () => editor.chain().focus().unsetBold().run(),
            active: editor.isActive("bold"),
          },
          {
            icon: UnderlineIcon,
            action: () => editor.chain().focus().toggleUnderline().run(),
            inActive: () => editor.chain().focus().unsetUnderline().run(),
            active: editor.isActive("underline"),
          },
          {
            icon: ItalicIcon,
            action: () => editor.chain().focus().toggleItalic().run(),
            inActive: () => editor.chain().focus().unsetItalic().run(),
            active: editor.isActive("italic"),
          },
        ] as const).map(({ icon: Icon, action, inActive, active }, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              if (active) inActive();
              else action();
            }}
            className={cn(
              "rounded-md border p-1.5 transition-all",
              active
                ? "border-[#5a4520] bg-[#1e1d14] text-[#c8a84b]"
                : "border-transparent text-[#4a4a44] hover:border-[#2a2a28] hover:text-[#8a8a7e]",
            )}
          >
            <Icon size={13} />
          </button>
        ))}

        {/* Emoji picker trigger */}
        <div ref={emojiRef} className="relative">
          <button
            onClick={() => setEmojiOpen((v) => !v)}
            className={cn(
              "rounded-md border p-1.5 transition-all",
              emojiOpen
                ? "border-[#5a4520] bg-[#1e1d14] text-[#c8a84b]"
                : "border-transparent text-[#4a4a44] hover:border-[#2a2a28] hover:text-[#8a8a7e]",
            )}
            title="Emoji"
          >
            <Smile size={13} />
          </button>

          {emojiOpen && (
            <div
              className="absolute bottom-full left-0 mb-2 z-50 rounded-xl border border-[#2a2a28] bg-[#111110] p-2 shadow-2xl"
              style={{ width: 232 }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <p className="mb-1.5 px-1 font-mono text-[9px] tracking-widest text-[#3d3d38] uppercase">Emoji</p>
              {EMOJI_TRAY.map((row, ri) => (
                <div key={ri} className="flex gap-0.5 mb-0.5">
                  {row.map((name) => (
                    <button
                      key={name}
                      title={name}
                      onClick={() => {
                        editor.chain().focus().setEmoji(name).run();
                        setEmojiOpen(false);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-base transition-colors hover:bg-[#1e1e1c]"
                    >
                      {gitHubEmojis.find((e) => e.name === name)?.emoji ?? ""}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Char count — right side */}
        <div className="ml-auto flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-[9px]",
              pct > 0.9 ? "text-red-500" : "text-[#3d3d38]",
            )}
          >
            {count} / {LIMIT}
          </span>
          {/* Ring indicator */}
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="#222220"
              strokeWidth="2"
            />
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke={pct > 0.9 ? "#ef4444" : "#c8a84b"}
              strokeWidth="2"
              strokeDasharray={`${pct * 37.7} 37.7`}
              strokeLinecap="round"
              transform="rotate(-90 8 8)"
            />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#1e1e1c] px-3 py-2.5">
        <button className="flex items-center gap-1.5 font-mono text-[10px] text-[#4a4a44] transition-colors hover:text-[#8a8a7e]">
          + Add comment / post
        </button>
        <div className="flex gap-2">
          <button className="border border-[#222220] px-3 py-1.5 text-[#4a4a44] transition-colors hover:text-[#8a8a7e]">
            Save Draft
          </button>
          <button className="rounded-md bg-[#c8a84b] px-3 py-1.5 text-[#0d0d0c] transition-colors hover:bg-[#b07f2a]">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
