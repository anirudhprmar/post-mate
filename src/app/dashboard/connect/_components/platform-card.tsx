"use client";

import { useState } from "react";
import { Loader2, Plus, RefreshCcwDot, RefreshCcwIcon, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

const LINKABLE_PROVIDERS = new Set(["google", "linkedin", "instagram", "facebook", "x", "threads", "youtube"]) as Set<string>;
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
        className="relative flex flex-col gap-4 bg-card rounded-2xl p-5 overflow-hidden cursor-pointer select-none"
        style={{
          border: `1px solid ${hovered ? `${brandColor}40` : "var(--border)"}`,
          boxShadow: hovered
            ? `0 8px 32px ${brandColor}18, 0 2px 8px ${brandColor}10`
            : "none",
          transition:
            "border-color 220ms ease, box-shadow 220ms ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
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
            className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
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
        <div className="flex flex-col gap-0.5 flex-1">
          <h3 className="text-[15px] font-semibold text-foreground leading-snug">
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
                      className="w-7 h-7 border-2 border-card"
                    >
                      {account.avatarUrl && (
                        <AvatarImage
                          src={account.avatarUrl}
                          alt={account.username ?? account.initials}
                        />
                      )}
                      <AvatarFallback className="text-[10px] font-semibold bg-muted text-muted-foreground">
                        {account.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
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
              className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20 hover:border-warning/50 transition-all duration-150 shrink-0"
              aria-label={`Add ${name} account`}
              disabled={loading}
              onClick={async () => {
                const provider = id;

                // Supported platforms with custom OAuth flows
                const SUPPORTED_CUSTOM_OAUTH = new Set(["x", "linkedin", "instagram"]);
                if (SUPPORTED_CUSTOM_OAUTH.has(provider)) {
                  setLoading(true);
                  window.location.href = `/api/social/${provider}/authorize`;
                  return;
                }

                toast.info(`Integration for ${name} is coming soon!`);
              }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
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
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-none"
              >
                {icon}
              </span>
              {name} Accounts
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-2 px-1">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-150"
              >
                <Avatar className="w-9 h-9">
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
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center gap-4">

                    <span className="text-sm font-medium text-foreground">
                      {account.username ?? `@account_${account.initials.toLowerCase()}`}
                    </span>
                    <div className="flex justify-between gap-2">
                      <Button className="h-7 w-7 rounded-full" variant="ghost"><RefreshCcwIcon /></Button>
                      <Button className="h-7 w-7 rounded-full" variant="ghost"><Trash /></Button>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
