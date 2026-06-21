"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/post";
import {
  XIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  ThreadsIcon,
  YouTubeIcon,
} from "~/lib/platform-icons";

const platformIcons: Record<
  string,
  React.FC<{ size?: number } & React.SVGProps<SVGSVGElement>>
> = {
  x: XIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  threads: ThreadsIcon,
  youtube: YouTubeIcon,
};

export default function AccountSelection() {
  const { data: connectedAccounts = [], isLoading } =
    api.connectedAccount.getAll.useQuery();
  const selectedAccountIds = usePostStore((state) => state.selectedAccountIds);
  const toggleAccount = usePostStore((state) => state.toggleAccount);

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Accounts</p>
      <div className="flex flex-wrap gap-1">
        {isLoading ? (
          <div className="bg-muted h-8 w-24 animate-pulse rounded-full"></div>
        ) : connectedAccounts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No accounts connected.</p>
        ) : (
          connectedAccounts.map((account) => {
            const isSelected = selectedAccountIds.includes(account.id);
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => toggleAccount(account.id)}
                className={`relative flex items-center justify-center rounded-full border-2 p-0.5 transition-colors ${
                  isSelected
                    ? "border-primary"
                    : "hover:border-border border-transparent"
                }`}
              >
                {account.avatarUrl ? (
                  <Image
                    src={account.avatarUrl}
                    alt={account.username}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <User className="text-primary h-4 w-4" />
                  </div>
                )}
                {(() => {
                  const Icon = platformIcons[account.platform.toLowerCase()];
                  if (!Icon) return null;
                  return (
                    <div className="absolute -right-3 -bottom-2 rounded-full p-[4px]">
                      <Icon className="h-3 w-3" />
                    </div>
                  );
                })()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
