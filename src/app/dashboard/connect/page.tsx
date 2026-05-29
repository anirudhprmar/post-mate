"use client"
import { Suspense } from "react";
import { PlatformCard, type Platform } from "./_components/platform-card";
import { OAuthCallbackHandler } from "./_components/oauth-callback-handler";
import { api } from "~/trpc/react";
import { FacebookIcon, InstagramIcon, LinkedInIcon, ThreadsIcon, XIcon, YouTubeIcon } from "~/lib/platform-icons";



const PLATFORM_CONFIGS: Omit<Platform, "connected" | "accounts">[] = [
    {
        id: "instagram",
        name: "Instagram",
        icon: <InstagramIcon />,
        brandColor: "#E1306C",
        brandGradient: "linear-gradient(90deg, #833AB4, #FD1D1D, #FCAF45)",
        iconBgColor: "rgba(225, 48, 108, 0.14)",
        iconColor: "#E1306C",
    },
    {
        id: "threads",
        name: "Threads",
        icon: <ThreadsIcon />,
        brandColor: "#888888",
        iconBgColor: "rgba(255, 255, 255, 0.07)",
        iconColor: "#d4d4d8",
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: <FacebookIcon />,
        brandColor: "#1877F2",
        iconBgColor: "rgba(24, 119, 242, 0.14)",
        iconColor: "#1877F2",
    },
    {
        id: "x",
        name: "X",
        icon: <XIcon />,
        brandColor: "#888888",
        iconBgColor: "rgba(255, 255, 255, 0.07)",
        iconColor: "#d4d4d8",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: <LinkedInIcon />,
        brandColor: "#0A66C2",
        iconBgColor: "rgba(10, 102, 194, 0.14)",
        iconColor: "#0A66C2",
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: <YouTubeIcon />,
        brandColor: "#FF0000",
        iconBgColor: "rgba(255, 0, 0, 0.10)",
        iconColor: "#FF0000",
    },
];

function ConnectPageContent() {
    const { data: connectedAccounts = [], isLoading } = api.connectedAccount.getAll.useQuery();

    const accountsByPlatform = connectedAccounts.reduce<
        Record<string, typeof connectedAccounts>
    >((acc, ca) => {
        (acc[ca.platform] ??= []).push(ca);
        return acc;
    }, {});

    const platforms: Platform[] = PLATFORM_CONFIGS.map((cfg) => {
        const dbAccounts = accountsByPlatform[cfg.id] ?? [];
        return {
            ...cfg,
            connected: dbAccounts.length > 0,
            accounts: dbAccounts.map((a) => ({
                id: a.id,
                initials: a.username.slice(0, 2).toUpperCase(),
                avatarUrl: a.avatarUrl ? a.avatarUrl : undefined,
                username: a.username,
            })),
        };
    });

    return (
        <div className="p-6 max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Connected Accounts</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your social media accounts and connections.
                </p>
            </div>

            {/* Platform grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 rounded-2xl bg-muted/40 animate-pulse"
                            aria-hidden="true"
                        />
                    ))
                    : platforms.map((platform) => (
                        <PlatformCard
                            key={platform.id}
                            platform={platform}
                        />
                    ))}
            </div>
        </div>
    );
}

export default function ConnectPage() {
    return (
        <>
            <Suspense>
                <OAuthCallbackHandler />
            </Suspense>
            <ConnectPageContent />
        </>
    );
}
