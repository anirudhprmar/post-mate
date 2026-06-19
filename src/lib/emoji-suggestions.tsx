"use client";

import { ReactRenderer } from "@tiptap/react";
import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import EmojiList, { type EmojiListHandle, type EmojiItem } from "./emoji-list";

interface EmojiPortalProps {
  clientRect: (() => DOMRect | null) | null;
  items: EmojiItem[];
  command: (item: { name: string }) => void;
  forwardedRef: React.Ref<EmojiListHandle>;
}

function EmojiPortal({ clientRect, forwardedRef, ...rest }: EmojiPortalProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const rect = clientRect?.();
      if (rect) {
        setPos({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        });
      }
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [clientRect]);

  if (!pos || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
      }}
    >
      <EmojiList ref={forwardedRef} {...rest} />
    </div>,
    document.body,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EmojiSuggestion: Record<string, any> = {
  items({
    editor,
    query,
  }: {
    editor: { storage: { emoji: { emojis: EmojiItem[] } } };
    query: string;
  }) {
    if (!query) return [];

    return editor.storage.emoji.emojis
      .filter(
        ({ shortcodes, tags }: { shortcodes: string[]; tags?: string[] }) =>
          shortcodes.find((sc) => sc.startsWith(query.toLowerCase())) ||
          tags?.find((tag) => tag.startsWith(query.toLowerCase())),
      )
      .slice(0, 8);
  },

  render() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: ReactRenderer<EmojiListHandle, any>;

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onStart(props: any) {
        renderer = new ReactRenderer(
          ({ forwardedRef, ...p }: EmojiPortalProps) => (
            <EmojiPortal {...p} forwardedRef={forwardedRef} />
          ),
          {
            props: { ...props, forwardedRef: null },
            editor: props.editor,
          },
        );
        document.body.appendChild(renderer.element);
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdate(props: any) {
        renderer.updateProps({ ...props, forwardedRef: renderer.ref });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") return true;
        return (
          (renderer.ref as EmojiListHandle | null)?.onKeyDown(props) ?? false
        );
      },

      onExit() {
        renderer.element?.remove();
        renderer.destroy();
      },
    };
  },
};

export default EmojiSuggestion;
