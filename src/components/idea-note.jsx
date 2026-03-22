"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "~/trpc/react";

/* ─── animation tokens ─── */
const spring = /** @type {const} */ ({ type: "spring", stiffness: 300, damping: 24, mass: 1 });
const easeOut = /** @type {const} */ ({ duration: 0.4, ease: [0.16, 1, 0.3, 1] });

const SHADOW = {
  sm: "0 1px 2px rgba(0,0,0,0.04)",
  md: "0 4px 12px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)",
  lg: "0 12px 32px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)",
};

/* ─── depth poses (rest state for each card layer) ─── */
const depthPose = {
  2: { y: 24, scale: 0.9, rotate: 1, opacity: 0.4, boxShadow: SHADOW.sm },
  1: { y: 12, scale: 0.95, rotate: -0.5, opacity: 0.7, boxShadow: SHADOW.md },
  0: { y: 0, scale: 1, rotate: 0, opacity: 1, boxShadow: SHADOW.lg },
};

const IdeaNote = () => {
  const [noteText, setNoteText] = useState("");
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Note saved to stack");
  const noteInputRef = useRef(/** @type {HTMLTextAreaElement | null} */(null));
  const toastTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */(null));

  const utils = api.useUtils();

  const createIdea = api.idea.create.useMutation({
    onSuccess: () => {
      void utils.dashboard.getStats.invalidate();
      void utils.idea.getAll.invalidate();
    },
  });

  /* clock — the only useEffect left */
  useEffect(() => {
    const id = setInterval(
      () =>
        setCurrentTime(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
      60_000
    );
    return () => clearInterval(id);
  }, []);

  const showToast = useCallback((message = "Note saved to stack") => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleNewNote = useCallback(() => {
    if (isAnimating || createIdea.isPending) return;
    if (!noteText.trim()) {
      noteInputRef.current?.focus();
      return;
    }

    setIsAnimating(true);

    createIdea.mutate(
      { content: noteText.trim(), status: "raw" },
      {
        onSuccess: () => {
          showToast("✓ Idea saved");
          setTimeout(() => {
            setNoteText("");
            setIsAnimating(false);
            noteInputRef.current?.focus();
          }, 500);
        },
        onError: () => {
          showToast("Failed to save — try again");
          setIsAnimating(false);
        },
      }
    );
  }, [isAnimating, noteText, showToast, createIdea]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleNewNote();
      }
    },
    [handleNewNote]
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden overscroll-none  font-sans text-zinc-800">
      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-none fixed left-1/2 top-6 z-100 rounded-[20px] bg-zinc-800 px-4 py-2 text-[13px] font-medium text-white shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Workspace ─── */}
      <div className="relative flex flex-1 items-center justify-center p-5 perspective-[1000px]">
        <div className="relative aspect-3/4 w-full max-w-[400px] max-h-[70vh]">
          {/* Card – depth 2 (Archived) */}
          <motion.div
            className="absolute inset-0 flex flex-col rounded-3xl border border-black/4 bg-white px-7 py-8 origin-bottom will-change-transform pointer-events-none"
            initial={false}
            animate={isAnimating ? depthPose[1] : depthPose[2]}
            transition={isAnimating ? spring : easeOut}
            style={{ zIndex: 1 }}
          >
            <div className="mb-6 flex items-center justify-between text-xs font-medium uppercase tracking-wide opacity-50">
              <span>Archived</span>
              <span>Yesterday</span>
            </div>
            <div className="flex-1" />
          </motion.div>

          {/* Card – depth 1 (Previous) */}
          <motion.div
            className="absolute inset-0 flex flex-col rounded-3xl border border-black/4 bg-white px-7 py-8 origin-bottom will-change-transform pointer-events-none"
            initial={false}
            animate={isAnimating ? depthPose[0] : depthPose[1]}
            transition={isAnimating ? spring : easeOut}
            style={{ zIndex: 2 }}
          >
            <div className="mb-6 flex items-center justify-between text-xs font-medium uppercase tracking-wide opacity-50">
              <span>Previous</span>
              <span>10:42 AM</span>
            </div>
            <div className="flex-1" />
          </motion.div>

          {/* Card – depth 0 (Draft / active) */}
          <motion.div
            className="absolute inset-0 flex flex-col rounded-3xl border border-black/4 bg-white px-7 py-8 origin-bottom will-change-transform"
            initial={false}
            animate={
              isAnimating
                ? {
                  x: "-120%",
                  y: -20,
                  rotate: -10,
                  opacity: 0,
                }
                : {
                  x: 0,
                  ...depthPose[0],
                }
            }
            transition={
              isAnimating
                ? { x: spring, y: spring, rotate: spring, opacity: easeOut }
                : easeOut
            }
            style={{ zIndex: 3 }}
          >
            <div className="mb-6 flex items-center justify-between text-xs font-medium uppercase tracking-wide opacity-50">
              <span>Draft</span>
              <span>{currentTime}</span>
            </div>
            <textarea
              ref={noteInputRef}
              className="note-lined-bg scrollbar-none flex-1 w-full resize-none border-none bg-transparent px-1 text-lg leading-7 text-zinc-800 outline-none placeholder:text-zinc-400"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start typing..."
              autoFocus
              spellCheck={false}
            />
          </motion.div>
        </div>
      </div>

      {/* ─── Dock ─── */}
      <div className="z-20 flex flex-col items-center gap-3 px-6 pb-8 pt-4">
        <motion.button
          className="flex cursor-pointer items-center gap-1.5 rounded-[20px] border border-black/4 bg-zinc-100/90 px-[18px] py-2.5 text-[13px] font-medium tracking-tight text-zinc-500 shadow-sm backdrop-blur-sm disabled:opacity-50"
          whileTap={{ scale: 0.96, backgroundColor: "rgba(0,0,0,0.04)" }}
          transition={{ duration: 0.15 }}
          onClick={handleNewNote}
          disabled={createIdea.isPending}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          {createIdea.isPending ? "Saving…" : "New Note"}
        </motion.button>

        {/* <div className="flex w-full max-w-[400px] items-center justify-between rounded-3xl border border-black/4 bg-white px-4 py-3 shadow-md">
          <button className="flex h-9 w-9 cursor-pointer items-center justify-center border-none bg-transparent text-zinc-500 transition-colors hover:text-zinc-800">
            <Menu className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
          <span className="text-sm font-medium tracking-tight text-zinc-500">
            Ask Assistant
          </span>
          <button className="flex h-9 w-9 cursor-pointer items-center justify-center border-none bg-transparent text-sm font-bold tracking-widest text-zinc-500 transition-colors hover:text-zinc-800">
            •••
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default IdeaNote;