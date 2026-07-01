"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { Card } from "~/components/ui/card";
import { platformIcons } from "~/lib/platform-icons";
import { type DraftMediaItem } from "~/lib/types";

import XPreview from "~/components/platform-preview/x-preview";
import LinkedInPreview from "~/components/platform-preview/linkedin-preview";
import InstagramPreview from "~/components/platform-preview/insta-preview";

interface DraftLivePreviewProps {
  platform: string;
  accountsForPlatform: any[];
  activePreviewId: string | null;
  onChangeActivePreviewId: (id: string) => void;
  content: string;
  mediaList: DraftMediaItem[];
}

export default function DraftLivePreview({
  platform,
  accountsForPlatform,
  activePreviewId,
  onChangeActivePreviewId,
  content,
  mediaList,
}: DraftLivePreviewProps) {
  const activePreviewAccount = accountsForPlatform.find(
    (a) => a.id === activePreviewId,
  );

  const previewMediaItems = mediaList.map((item) => ({
    id: item.id,
    previewUrl: item.file ? item.previewUrl! : item.url!,
    type: item.type,
  }));

  return (
    <Card className="border-border/40 bg-background/40 flex min-h-[300px] w-full flex-col items-center justify-center rounded-3xl p-6 backdrop-blur-xl">
      <div className="mb-4 w-full">
        <p className="text-foreground/90 text-base font-bold">Post Preview</p>
        <p className="text-muted-foreground text-xs">
          How it will appear on {platform}
        </p>
      </div>

      {accountsForPlatform.length === 0 ? (
        <div className="bg-background/20 border-border/50 w-full rounded-2xl border border-dashed p-6 py-16 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            No active account connected for {platform}. Connect one to preview.
          </p>
        </div>
      ) : activePreviewAccount ? (
        <>
          <div className="scrollbar-hide flex w-full justify-start gap-2 overflow-x-auto pb-3">
            {accountsForPlatform.map((account) => (
              <button
                key={account.id}
                onClick={() => onChangeActivePreviewId(account.id)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activePreviewId === account.id
                    ? "bg-primary text-primary-foreground scale-102 shadow-md"
                    : "bg-background/50 hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {account.avatarUrl ? (
                  <Image
                    src={account.avatarUrl}
                    alt={account.username}
                    width={16}
                    height={16}
                    className="h-4 w-4 rounded-full"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <div className="bg-primary/10 flex h-4 w-4 items-center justify-center rounded-full">
                    <User className="text-primary h-3 w-3" />
                  </div>
                )}
                <span className="capitalize">{account.platform}</span>
              </button>
            ))}
          </div>

          <div className="flex w-full justify-center">
            {platform.toLowerCase() === "x" ? (
              <XPreview
                username={activePreviewAccount.username}
                avatarUrl={activePreviewAccount.avatarUrl}
                content={content}
                media={previewMediaItems}
              />
            ) : platform.toLowerCase() === "linkedin" ? (
              <LinkedInPreview
                username={activePreviewAccount.username}
                avatarUrl={activePreviewAccount.avatarUrl}
                content={content}
                media={previewMediaItems}
              />
            ) : platform.toLowerCase() === "instagram" ? (
              <InstagramPreview
                username={activePreviewAccount.username}
                avatarUrl={activePreviewAccount.avatarUrl}
                content={content}
                media={previewMediaItems}
              />
            ) : (
              <GenericPreview
                username={activePreviewAccount.username}
                avatarUrl={activePreviewAccount.avatarUrl ?? undefined}
                content={content}
                media={previewMediaItems}
                platform={platform}
              />
            )}
          </div>
        </>
      ) : null}
    </Card>
  );
}

function GenericPreview({
  username,
  avatarUrl,
  content,
  media,
  platform,
}: {
  username: string;
  avatarUrl?: string;
  content: string;
  media: any[];
  platform: string;
}) {
  const Icon = platformIcons[platform.toLowerCase()];
  return (
    <Card className="border-border/40 bg-background/50 w-full max-w-md rounded-2xl p-4 shadow-md backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
            <User className="text-primary h-4.5 w-4.5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-foreground/95 text-sm font-bold capitalize">
              {username}
            </h4>
            {Icon && <Icon className="text-muted-foreground h-3.5 w-3.5" />}
          </div>
          <p className="text-muted-foreground text-xs capitalize">{platform}</p>
        </div>
      </div>
      <div
        className="text-foreground/90 mt-3 text-sm leading-relaxed whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {media.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {media.map((item, idx) => (
            <div
              key={idx}
              className="border-border/30 relative aspect-video overflow-hidden rounded-xl border"
            >
              {item.type === "image" ? (
                <img
                  src={item.previewUrl || item.url}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={item.previewUrl || item.url}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
