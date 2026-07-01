"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { platformIcons } from "~/lib/platform-icons";

interface DraftAccountSelectionProps {
  platform: string;
  accountsForPlatform: any[];
  selectedAccountIds: string[];
  onToggleAccount: (id: string) => void;
}

export default function DraftAccountSelection({
  platform,
  accountsForPlatform,
  selectedAccountIds,
  onToggleAccount,
}: DraftAccountSelectionProps) {
  return (
    <div>
      <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
        Target Accounts
      </label>
      {accountsForPlatform.length === 0 ? (
        <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-500/90">
          No connected {platform} accounts found. Please connect an account
          first.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {accountsForPlatform.map((account) => {
            const isSelected = selectedAccountIds.includes(account.id);
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => onToggleAccount(account.id)}
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
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                    <User className="text-primary h-5 w-5" />
                  </div>
                )}
                {(() => {
                  const Icon = platformIcons[account.platform.toLowerCase()];
                  if (!Icon) return null;
                  return (
                    <div className="bg-background absolute -right-2 -bottom-1.5 rounded-full p-[2px]">
                      <Icon className="text-muted-foreground h-3 w-3" />
                    </div>
                  );
                })()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
