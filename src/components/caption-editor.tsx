"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import {
  Pencil,
  RotateCcw,
  Crown,
  ImageIcon,
  Film,
  CircleDot,
} from "lucide-react";
import Image from "next/image";
import { User } from "lucide-react";

import { api } from "~/trpc/react";
import { usePostStore, type InstagramPostType } from "~/store/post";
import { PLATFORM_LIMITS } from "./post-editor";
import { platformIcons } from "~/lib/platform-icons";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import EmojiSuggestion from "~/lib/emoji-suggestions";
import { cn } from "~/lib/utils";

function getLimit(
  platform: string,
  accountId: string,
  xPremium: Record<string, boolean>,
) {
  const p = platform.toLowerCase();
  if (p === "x" && xPremium[accountId]) {
    return PLATFORM_LIMITS.x_premium ?? 25000;
  }
  return PLATFORM_LIMITS[p] ?? 63206;
}

function PlatformMiniEditor({
  accountId,
  initialContent,
  limit,
  onUpdate,
}: {
  accountId: string;
  initialContent: string;
  limit: number;
  onUpdate: (accountId: string, html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Customize caption for this platform…",
      }),
      CharacterCount,
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
        suggestion: EmojiSuggestion,
      }),
      Typography,
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(accountId, editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Derive counts from editor
  const charCount = editor?.getText({ blockSeparator: "\n" }).length ?? 0;
  const remaining = limit - charCount;
  const usedPct = charCount / limit;

  const counterColor =
    remaining < 0
      ? "text-red-500"
      : usedPct >= 0.9
        ? "text-red-400"
        : usedPct >= 0.75
          ? "text-amber-400"
          : "text-muted-foreground";

  // Circular progress ring
  const radius = 7;
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

  return (
    <div className="mt-2">
      <EditorContent
        editor={editor}
        className="text-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground bg-background overflow-y-auto rounded-md border px-3 pt-3 pb-2 text-sm leading-relaxed [&_.tiptap]:max-h-[120px] [&_.tiptap]:min-h-[60px] [&_.tiptap]:overflow-y-auto [&_.tiptap]:outline-none [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5"
      />
      {/* Character counter */}
      <div className="mt-1.5 flex items-center justify-end gap-1.5">
        <svg width="18" height="18" viewBox="0 0 18 18" className="-rotate-90">
          <circle
            cx="9"
            cy="9"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted/40"
          />
          <circle
            cx="9"
            cy="9"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200"
          />
        </svg>
        <span className={cn("text-xs font-medium tabular-nums", counterColor)}>
          {charCount} / {limit.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function AccountCaptionCard({
  account,
}: {
  account: {
    id: string;
    platform: string;
    username: string;
    avatarUrl: string | null;
  };
}) {
  const mainContent = usePostStore((s) => s.content);
  const platformCaptions = usePostStore((s) => s.platformCaptions);
  const setPlatformCaption = usePostStore((s) => s.setPlatformCaption);
  const xPremium = usePostStore((s) => s.xPremium);
  const setXPremium = usePostStore((s) => s.setXPremium);
  const instagramPostType = usePostStore((s) => s.instagramPostType);
  const setInstagramPostType = usePostStore((s) => s.setInstagramPostType);

  const platform = account.platform.toLowerCase();
  const hasCustomCaption = account.id in platformCaptions;
  const [isEditing, setIsEditing] = useState(false);

  const limit = useMemo(
    () => getLimit(platform, account.id, xPremium),
    [platform, account.id, xPremium],
  );

  const isPremium = xPremium[account.id] ?? false;
  const igType = instagramPostType[account.id] ?? "image";

  const handleUpdate = useCallback(
    (accountId: string, html: string) => {
      setPlatformCaption(accountId, html);
    },
    [setPlatformCaption],
  );

  const handleResetToMain = useCallback(() => {
    // Remove the override so it falls back to main content
    const store = usePostStore.getState();
    const next = { ...store.platformCaptions };
    delete next[account.id];
    usePostStore.setState({ platformCaptions: next });
    setIsEditing(false);
  }, [account.id]);

  const handleStartEditing = useCallback(() => {
    // Initialize with main content if no custom caption yet
    if (!hasCustomCaption) {
      setPlatformCaption(account.id, mainContent);
    }
    setIsEditing(true);
  }, [account.id, hasCustomCaption, mainContent, setPlatformCaption]);

  // Platform icon
  const PlatformIcon = platformIcons[platform];

  // Compute character count for the preview (non-editing) state
  const previewText =
    (hasCustomCaption ? platformCaptions[account.id] : mainContent) ?? "";
  const plainTextLength = previewText.replace(/<[^>]+>/g, "").length;
  const previewUsedPct = plainTextLength / limit;
  const previewRemaining = limit - plainTextLength;

  const limitBadgeVariant: "default" | "secondary" | "destructive" | "outline" =
    previewRemaining < 0
      ? "destructive"
      : previewUsedPct >= 0.75
        ? "outline"
        : "secondary";

  return (
    <div className="bg-card border-border rounded-lg border p-3 transition-colors">
      {/* Header row */}
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {account.avatarUrl ? (
            <Image
              src={account.avatarUrl}
              alt={account.username}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full">
              <User className="text-primary h-3.5 w-3.5" />
            </div>
          )}
          {PlatformIcon && (
            <div className="absolute -right-1.5 -bottom-1 rounded-full bg-white p-[2px] dark:bg-zinc-900">
              <PlatformIcon className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">
            {account.username}
          </span>
          <span className="text-muted-foreground text-xs capitalize">
            {platform}
          </span>
        </div>

        {/* Character limit badge */}
        <Badge variant={limitBadgeVariant} className="shrink-0 text-[10px]">
          {plainTextLength.toLocaleString()} / {limit.toLocaleString()}
        </Badge>

        {/* Edit / Reset buttons */}
        {!isEditing && !hasCustomCaption && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={handleStartEditing}
          >
            <Pencil className="h-3 w-3" />
            Customize
          </Button>
        )}
        {(isEditing || hasCustomCaption) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-7 gap-1 px-2 text-xs"
            onClick={handleResetToMain}
            title="Reset to main caption"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Platform-specific options */}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {/* X premium toggle */}
        {platform === "x" && (
          <div className="flex items-center gap-2">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <label
              htmlFor={`x-premium-${account.id}`}
              className="text-muted-foreground cursor-pointer text-xs"
            >
              Premium
            </label>
            <Switch
              id={`x-premium-${account.id}`}
              size="sm"
              checked={isPremium}
              onCheckedChange={(checked: boolean) =>
                setXPremium(account.id, checked)
              }
            />
          </div>
        )}

        {/* Instagram post type */}
        {platform === "instagram" && (
          <div className="flex items-center gap-2">
            <Select
              value={igType}
              onValueChange={(val: string) =>
                setInstagramPostType(account.id, val as InstagramPostType)
              }
            >
              <SelectTrigger size="sm" className="h-7 gap-1.5 px-2 text-xs">
                {igType === "image" && <ImageIcon className="h-3 w-3" />}
                {igType === "reel" && <Film className="h-3 w-3" />}
                {igType === "story" && <CircleDot className="h-3 w-3" />}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">
                  <ImageIcon className="h-3.5 w-3.5" /> Image Post
                </SelectItem>
                <SelectItem value="reel">
                  <Film className="h-3.5 w-3.5" /> Reel
                </SelectItem>
                <SelectItem value="story">
                  <CircleDot className="h-3.5 w-3.5" /> Story
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Mini editor (only when editing or has custom caption) */}
      {(isEditing || hasCustomCaption) && (
        <PlatformMiniEditor
          accountId={account.id}
          initialContent={platformCaptions[account.id] ?? mainContent}
          limit={limit}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default function CaptionEditor() {
  const selectedAccountIds = usePostStore((s) => s.selectedAccountIds);
  const { data: connectedAccounts = [] } =
    api.connectedAccount.getAll.useQuery();

  const selectedAccounts = useMemo(
    () => connectedAccounts.filter((a) => selectedAccountIds.includes(a.id)),
    [connectedAccounts, selectedAccountIds],
  );

  if (selectedAccounts.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-medium">
        Platform Captions
        <span className="ml-1 opacity-60">
          — customize per platform or use main caption
        </span>
      </p>
      <div className="space-y-2">
        {selectedAccounts.map((account) => (
          <AccountCaptionCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
