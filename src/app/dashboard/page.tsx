"use client"
import { ArrowUp, Calendar, Clock, FileText, Lightbulb, PenTool, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import IdeaNote from "~/components/idea-note";
import { api } from "~/trpc/react";
import Link from "next/link";

/* ─── helpers ─── */
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
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const statusColor: Record<string, string> = {
    raw: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    refined: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    drafting: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    done: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const draftStatusColor: Record<string, string> = {
    writing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    review: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    ready: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    published: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

const platformColor: Record<string, string> = {
    linkedin: "bg-blue-500",
    x: "bg-foreground",
    twitter: "bg-foreground",
    instagram: "bg-gradient-to-r from-pink-500 to-amber-500",
    threads: "bg-foreground",
};

/* ─── Skeleton loaders ─── */
function StatSkeleton() {
    return (
        <Card className="p-6 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl">
            <div className="flex items-center gap-5">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </Card>
    );
}

function ListItemSkeleton() {
    return (
        <Card className="p-5 flex items-center justify-between border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl">
            <div className="space-y-2.5 flex-1 pr-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
        </Card>
    );
}

/* ─── Empty states ─── */
function EmptyIdeas() {
    return (
        <div className="flex flex-col items-center justify-center py-14 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-background/20 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
                <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold mb-1">No ideas yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
                Use the notecard above to jot down your first content idea.
            </p>
        </div>
    );
}

function EmptyDrafts() {
    return (
        <div className="flex flex-col items-center justify-center py-14 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-background/20 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
                <PenTool className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold mb-1">No drafts yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
                Turn your ideas into drafts to start writing content.
            </p>
            <Link href="/dashboard/post/new" className="mt-4">
                <Button variant="outline" size="sm" className="rounded-full">
                    Start a draft
                </Button>
            </Link>
        </div>
    );
}

/* ─── Main component ─── */
export default function Dashboard() {
    const { data: stats, isLoading } = api.dashboard.getStats.useQuery();

    const totalDrafts = stats?.platformBreakdown.reduce((sum, p) => sum + p.count, 0) ?? 0;

    return (
        <div className="relative min-h-screen w-full">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 items-start">
                {/* ─── Left Column: Composer ─── */}
                <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative z-10">
                    <IdeaNote />
                </div>

                {/* ─── Right Column: Stats + Lists ─── */}
                <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out">

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {isLoading ? (
                            <>
                                <StatSkeleton />
                                <StatSkeleton />
                                <StatSkeleton />
                            </>
                        ) : (
                            <>
                                {/* Ideas count */}
                                <Card className="p-5 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl group hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Lightbulb className="h-12 w-12" />
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                                            <Lightbulb className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ideas</p>
                                            <p className="text-3xl font-bold tracking-tight text-foreground/90">{stats?.ideaCount ?? 0}</p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Drafts count */}
                                <Card className="p-5 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl group hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <PenTool className="h-12 w-12" />
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                                            <PenTool className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Drafts</p>
                                            <p className="text-3xl font-bold tracking-tight text-foreground/90">{stats?.draftCount ?? 0}</p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Scheduled count */}
                                <Card className="p-5 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl group hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Calendar className="h-12 w-12" />
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scheduled</p>
                                            <p className="text-3xl font-bold tracking-tight text-foreground/90">{stats?.scheduledCount ?? 0}</p>
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Recent Ideas */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold tracking-tight">Recent Ideas</h2>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-full h-8 px-4 text-xs">
                                    View All
                                </Button>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-3">
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                            </div>
                        ) : stats?.recentIdeas.length === 0 ? (
                            <EmptyIdeas />
                        ) : (
                            <div className="grid gap-3">
                                {stats?.recentIdeas.map((idea) => (
                                    <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="block">
                                        <Card
                                            className="p-4 flex items-center justify-between transition-all duration-300 cursor-pointer border-border/40 group bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5 rounded-2xl"
                                        >
                                            <div className="space-y-1.5 overflow-hidden pr-4 text-left flex-1">
                                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{idea.content}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(idea.createdAt)}</span>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold capitalize shrink-0 ${statusColor[idea.status] ?? ""}`}
                                            >
                                                {idea.status}
                                            </Badge>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Drafts */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold tracking-tight">Recent Drafts</h2>
                            <Link href="/dashboard/drafts">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-full h-8 px-4 text-xs">
                                    View All
                                </Button>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-3">
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                            </div>
                        ) : stats?.recentDrafts.length === 0 ? (
                            <EmptyDrafts />
                        ) : (
                            <div className="grid gap-3">
                                {stats?.recentDrafts.map((d) => (
                                    <Card
                                        key={d.id}
                                        className="p-4 flex items-center justify-between transition-all duration-300 cursor-pointer border-border/40 group bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5 rounded-2xl"
                                    >
                                        <div className="space-y-1.5 overflow-hidden pr-4 text-left flex-1">
                                            <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{d.content}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(d.createdAt)}</span>
                                                <span className="opacity-50">•</span>
                                                <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{d.platform}</span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold capitalize shrink-0 ${draftStatusColor[d.status] ?? ""}`}
                                        >
                                            {d.status}
                                        </Badge>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Platform Breakdown */}
                    {!isLoading && stats && stats.platformBreakdown.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                            <Card className="p-6 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl space-y-5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">By Platform</h3>
                                <div className="space-y-4">
                                    {stats.platformBreakdown.map((p) => (
                                        <div key={p.platform} className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-sm font-semibold capitalize">{p.platform}</span>
                                                <span className="text-sm font-bold">{p.count}</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 delay-500 ${platformColor[p.platform.toLowerCase()] ?? "bg-primary"}`}
                                                    style={{ width: `${totalDrafts > 0 ? (p.count / totalDrafts) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}