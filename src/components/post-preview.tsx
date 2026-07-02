"use client";

import { useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/post";
import PublishActions from "./publish-actions";
import XPreview, {
  type PlatformPreviewProps,
} from "./platform-preview/x-preview";
import LinkedInPreview from "./platform-preview/linkedin-preview";
import InstagramPreview from "./platform-preview/insta-preview";
import FacebookPreview from "./platform-preview/facebook-preview";
import ThreadsPreview from "./platform-preview/threads-preview";
import YouTubePreview from "./platform-preview/youtube-preview";

export default function PostPreview() {
  const { data: connectedAccounts = [] } =
    api.connectedAccount.getAll.useQuery();
  const content = usePostStore((state) => state.content);
  const media = usePostStore((state) => state.media);
  const selectedAccountIds = usePostStore((state) => state.selectedAccountIds);

  const [userSelectedPreviewId, setUserSelectedPreviewId] = useState<
    string | null
  >(null);

  const selectedAccounts = connectedAccounts.filter((ca) =>
    selectedAccountIds.includes(ca.id),
  );

  const activePreviewId = selectedAccountIds.includes(
    userSelectedPreviewId as string,
  )
    ? userSelectedPreviewId
    : (selectedAccounts[0]?.id ?? null);

  const activePreviewAccount = selectedAccounts.find(
    (a) => a.id === activePreviewId,
  );

  const PreviewPlatforms: Record<
    string,
    React.ComponentType<PlatformPreviewProps>
  > = {
    x: XPreview,
    linkedin: LinkedInPreview,
    instagram: InstagramPreview,
    facebook: FacebookPreview,
    threads: ThreadsPreview,
    youtube: YouTubePreview,
  };

  const platformKey = activePreviewAccount?.platform.toLowerCase();

  const PreviewPlatform =
    activePreviewAccount && platformKey ? PreviewPlatforms[platformKey] : null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-2 flex justify-between gap-2">
        <p className="w-full font-bold">Post Preview</p>
        <PublishActions />
      </div>

      <div className="flex flex-col gap-4">
        {selectedAccounts.length === 0 ? (
          <div className="bg-muted rounded-sm border border-dashed p-3 py-8 text-center">
            <p className="text-muted-foreground text-sm">
              Select an account to preview your post.
            </p>
          </div>
        ) : (
          <>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              {selectedAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setUserSelectedPreviewId(account.id)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    activePreviewId === account.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
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

            {activePreviewAccount && PreviewPlatform ? (
              <PreviewPlatform
                username={activePreviewAccount.username}
                avatarUrl={activePreviewAccount.avatarUrl}
                content={content}
                media={media}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
