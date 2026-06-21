"use client";

import { useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/post";
import PublishActions from "./publish-actions";

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

  return (
    <div className="flex h-full w-full flex-col justify-between">
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

            {activePreviewAccount && (
              <div className="bg-card rounded-md border p-4 shadow-sm">
                <div className="border-border/50 mb-3 flex items-center gap-3 border-b pb-3">
                  {activePreviewAccount.avatarUrl ? (
                    <Image
                      src={activePreviewAccount.avatarUrl}
                      alt={activePreviewAccount.username}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                      <User className="text-primary h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm leading-none font-semibold">
                      {activePreviewAccount.username}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs capitalize">
                      {activePreviewAccount.platform}
                    </p>
                  </div>
                </div>
                <div
                  className="tiptap wrap-break-words max-w-none text-sm whitespace-pre-wrap [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html:
                      content ||
                      (media.length === 0
                        ? '<span class="text-muted-foreground italic">Write something to preview...</span>'
                        : ""),
                  }}
                />
                {media.length > 0 && (
                  <div
                    className={`mt-4 grid h-full w-full gap-2 ${
                      media.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {media.map((m) => (
                      <div
                        key={m.id}
                        className="bg-muted relative h-full w-full overflow-hidden rounded-md sm:aspect-video"
                      >
                        {m.type === "image" ? (
                          <img
                            src={m.previewUrl}
                            alt="Preview"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <video
                            src={m.previewUrl}
                            poster={m.thumbnailPreviewUrl}
                            controls
                            className="h-full w-full object-fill"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-4">
        <PublishActions />
      </div>
    </div>
  );
}
