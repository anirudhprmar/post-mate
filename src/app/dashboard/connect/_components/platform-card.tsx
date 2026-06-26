"use client";

import { useState } from "react";
import {
  Loader2,
  Plus,
  RefreshCcwDot,
  RefreshCcwIcon,
  Trash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

const LINKABLE_PROVIDERS = new Set([
  "google",
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "threads",
  "youtube",
]) as Set<string>;
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export interface Account {
  id: string;
  initials: string;
  avatarUrl?: string;
  username?: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  brandColor: string;
  brandGradient?: string;
  iconBgColor: string;
  iconColor: string;
  connected: boolean;
  accounts: Account[];
  oauthProvider?: string;
}

export function PlatformCard({ platform }: { platform: Platform }) {
  const [hovered, setHovered] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    id,
    name,
    icon,
    brandColor,
    brandGradient,
    iconBgColor,
    iconColor,
    connected,
    accounts,
  } = platform;

  const visibleAvatars = accounts.slice(0, 3);

  return (
    <>
      <div
        className="bg-card relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl p-5 select-none"
        style={{
          border: `1px solid ${hovered ? `${brandColor}40` : "var(--border)"}`,
          boxShadow: hovered
            ? `0 8px 32px ${brandColor}18, 0 2px 8px ${brandColor}10`
            : "none",
          transition: "border-color 220ms ease, box-shadow 220ms ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 right-0 left-0 h-[2px]"
          style={{
            background: brandGradient ?? brandColor,
            opacity: hovered ? 1 : 0,
            transition: "opacity 220ms ease",
          }}
          aria-hidden="true"
        />

        {/* Icon + optional placeholder top row */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: iconBgColor,
              color: iconColor,
              transition: "background 220ms ease",
            }}
          >
            {icon}
          </div>
        </div>

        {/* Platform name & account info */}
        <div className="flex flex-1 flex-col gap-0.5">
          <h3 className="text-foreground text-[15px] leading-snug font-semibold">
            {name}
          </h3>
          <p
            className={cn(
              "text-sm",
              connected ? "text-muted-foreground" : "text-muted-foreground/60",
            )}
          >
            {connected
              ? `${accounts.length} account${accounts.length !== 1 ? "s" : ""}`
              : "not connected"}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {connected && accounts.length > 0 && (
              <>
                {/* Overlapping avatars */}
                <div className="flex -space-x-2">
                  {visibleAvatars.map((account) => (
                    <Avatar
                      key={account.id}
                      className="border-card h-7 w-7 border-2"
                    >
                      {account.avatarUrl && (
                        <AvatarImage
                          src={account.avatarUrl}
                          alt={account.username ?? account.initials}
                        />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                        {account.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150"
                  aria-label={`View all ${name} accounts`}
                >
                  View all
                </button>
              </>
            )}
          </div>

          {/* Add account button — amber/warning color */}
          {LINKABLE_PROVIDERS.has(id) && (
            <Button
              className="bg-warning/10 border-warning/30 text-warning hover:bg-warning/20 hover:border-warning/50 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-150"
              aria-label={`Add ${name} account`}
              disabled={loading}
              onClick={async () => {
                const provider = id;

                // Supported platforms with custom OAuth flows
                const SUPPORTED_CUSTOM_OAUTH = new Set([
                  "x",
                  "linkedin",
                  "instagram",
                  "threads"
                ]);
                if (SUPPORTED_CUSTOM_OAUTH.has(provider)) {
                  setLoading(true);
                  window.location.href = `/api/social/${provider}/authorize`;
                  return;
                }

                toast.info(`Integration for ${name} is coming soon!`);
              }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* View All Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle
              className="flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-none">
                {icon}
              </span>
              {name} Accounts
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-2 px-1">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-xl p-3 transition-colors duration-150"
              >
                <Avatar className="h-9 w-9">
                  {account.avatarUrl && (
                    <AvatarImage
                      src={account.avatarUrl}
                      alt={account.username ?? account.initials}
                    />
                  )}
                  <AvatarFallback className="text-sm font-semibold">
                    {account.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-foreground text-sm font-medium">
                      {account.username ??
                        `@account_${account.initials.toLowerCase()}`}
                    </span>
                    <div className="flex justify-between gap-2">
                      <Button className="h-7 w-7 rounded-full" variant="ghost">
                        <RefreshCcwIcon />
                      </Button>
                      <Button className="h-7 w-7 rounded-full" variant="ghost">
                        <Trash />
                      </Button>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
