"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Clock, Plus, PenTool, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function getStatusLabel(status: string) {
  if (status === "all") return "All Status";
  if (status === "writing") return "Draft";
  if (status === "review") return "In Review";
  if (status === "ready") return "Ready to Post";
  if (status === "published") return "Published";
  return status;
}

export default function DraftsPage() {
  const { data: drafts, isLoading } = api.draft.getAll.useQuery();
  const [statusFilter, setStatusFilter] = useState("all");

  const tabs = [
    "All Drafts",
    "Instagram",
    "LinkedIn",
    "X",
    "Threads",
    "Facebook",
    "Youtube",
  ];
  return (
    <div className="relative min-h-screen w-full">
      {/* Animated Mesh Background (Consistent with Dashboard) */}
      <div className="bg-mesh animate-mesh pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20" />

      <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto w-full max-w-5xl space-y-8 p-4 duration-700 ease-out md:p-8">
        {/* Header Section */}
        <header className="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-foreground/90 text-4xl leading-tight font-bold tracking-tight">
              Your Drafts 📝
            </h1>
            <p className="text-muted-foreground mt-1 max-w-xl text-sm font-medium">
              Manage your saved ideas, works in progress, and scheduled posts.
            </p>
          </div>
        </header>

        {/* Main Content Area with Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="scrollbar-hide mb-6 overflow-x-auto px-2 pb-2">
              <TabsList className="bg-background/40 border-border/40 inline-flex rounded-full border p-1.5 shadow-sm backdrop-blur-xl md:flex">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab === "All Drafts" ? "all" : tab.toLowerCase()}
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-6 transition-all duration-300 data-[state=active]:shadow-sm"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Status Filters */}
            <div className="scrollbar-hide mb-8 flex items-center gap-2 overflow-x-auto px-2 pb-2">
              <span className="text-muted-foreground mr-2 text-sm font-medium">
                Status:
              </span>
              {["all", "writing", "review", "ready", "published"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background/50 border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="text-muted-foreground/50 h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {["all", "x", "linkedin", "threads", "instagram"].map(
                  (tabPlatform) => {
                    let platformFiltered =
                      tabPlatform === "all"
                        ? drafts || []
                        : (drafts || []).filter(
                            (d) => d.platform.toLowerCase() === tabPlatform,
                          );

                    const filteredDrafts =
                      statusFilter === "all"
                        ? platformFiltered
                        : platformFiltered.filter(
                            (d) => d.status === statusFilter,
                          );

                    return (
                      <TabsContent
                        key={tabPlatform}
                        value={tabPlatform}
                        className="animate-in fade-in slide-in-from-bottom-4 mt-0 duration-500 outline-none"
                      >
                        {filteredDrafts.length > 0 ? (
                          <div className="grid grid-cols-1 gap-6 px-2 pb-10 md:grid-cols-2 lg:grid-cols-3">
                            {filteredDrafts.map((draft) => (
                              <Link
                                key={draft.id}
                                href={`/dashboard/post/${draft.id}`}
                                className="block"
                              >
                                <Card className="border-border/40 group bg-background/40 hover:bg-background/60 hover:shadow-foreground/5 flex min-h-[160px] cursor-pointer flex-col justify-between rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                  <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <p className="group-hover:text-primary line-clamp-2 text-lg leading-relaxed font-semibold transition-colors md:line-clamp-3">
                                        {draft.content}
                                      </p>
                                      <div className="flex shrink-0 gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 -mt-2 -mr-2 h-9 w-9 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                          <PenTool className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-muted-foreground/80 mt-6 flex items-center justify-between text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />{" "}
                                        {timeAgo(draft.updatedAt)}
                                      </span>
                                      <span className="text-[10px] opacity-50">
                                        •
                                      </span>
                                      <span className="bg-muted rounded-md px-2 py-0.5 text-xs capitalize">
                                        {draft.platform}
                                      </span>
                                    </div>
                                    <Badge
                                      variant={
                                        draft.status === "draft"
                                          ? "default"
                                          : draft.status === "published"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="border-border/50 rounded-full px-3 py-1 text-[11px] font-semibold shadow-none"
                                    >
                                      {getStatusLabel(draft.status)}
                                    </Badge>
                                  </div>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="border-border/50 bg-background/20 mx-2 flex flex-col items-center justify-center rounded-4xl border border-dashed px-4 py-20 text-center backdrop-blur-sm">
                            <div className="bg-muted/50 text-muted-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-3xl">
                              <PenTool className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                              No drafts found
                            </h3>
                            <p className="text-muted-foreground max-w-sm">
                              You don&apos;t have any drafts for{" "}
                              {tabPlatform === "all"
                                ? "any platform"
                                : tabPlatform}{" "}
                              yet. Ready to start writing?
                            </p>
                            <Link href="/dashboard/post/new" className="mt-6">
                              <Button
                                variant="outline"
                                className="hover:bg-muted/50 border-border/50 rounded-full shadow-sm"
                              >
                                Start a new draft
                              </Button>
                            </Link>
                          </div>
                        )}
                      </TabsContent>
                    );
                  },
                )}
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
