"use client";

import { useState } from "react";
import { Lightbulb, Plus, Clock, Loader2, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

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

type IdeaStatus = "raw" | "refined" | "drafting" | "done";

const STATUSES: { value: IdeaStatus; label: string; color: string }[] = [
    { value: "raw", label: "Raw", color: "text-amber-500 bg-amber-500/10" },
    { value: "refined", label: "Refined", color: "text-blue-500 bg-blue-500/10" },
    { value: "drafting", label: "Drafting", color: "text-violet-500 bg-violet-500/10" },
    { value: "done", label: "Done", color: "text-emerald-500 bg-emerald-500/10" },
];

export default function IdeasPage() {
    const utils = api.useUtils();
    const [newIdeaContent, setNewIdeaContent] = useState("");

    const { data: ideas, isLoading } = api.idea.getAll.useQuery();

    const createIdea = api.idea.create.useMutation({
        onSuccess: () => {
            setNewIdeaContent("");
            toast.success("Idea saved successfully");
            void utils.idea.getAll.invalidate();
        },
        onError: (err) => toast.error(err.message),
    });

    const updateIdea = api.idea.update.useMutation({
        onSuccess: () => {
            toast.success("Status updated");
            void utils.idea.getAll.invalidate();
        },
        onError: (err) => toast.error(err.message),
    });

    const deleteIdea = api.idea.delete.useMutation({
        onSuccess: () => {
            toast.success("Idea deleted");
            void utils.idea.getAll.invalidate();
        },
        onError: (err) => toast.error(err.message),
    });

    const handleCreateIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdeaContent.trim()) return;
        createIdea.mutate({ content: newIdeaContent, status: "raw" });
    };

    const handleMoveStatus = (id: string, currentStatus: IdeaStatus) => {
        const currentIndex = STATUSES.findIndex(s => s.value === currentStatus);
        if (currentIndex < STATUSES.length - 1) {
            updateIdea.mutate({ id, status: STATUSES[currentIndex + 1]!.value });
        }
    };

    // Derived filtered ideas
    const ideasByStatus = (status: IdeaStatus) => {
        return ideas?.filter(idea => idea.status === status) || [];
    };

    return (
        <div className="relative min-h-screen w-full p-4 md:p-8 space-y-8">
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="max-w-4xl mx-auto space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ideas Pipeline</h1>
                        <p className="text-muted-foreground text-sm">Capture, refine, and turn your raw ideas into published content.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out">
                <Tabs defaultValue="raw" className="w-full">
                    <TabsList className="w-full max-w-md grid grid-cols-4 mb-8 bg-background/50 backdrop-blur-xl border border-border/40 p-1 rounded-2xl h-12">
                        {STATUSES.map(s => (
                            <TabsTrigger
                                key={s.value}
                                value={s.value}
                                className="rounded-xl h-full data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs font-semibold transition-all"
                            >
                                {s.label}
                                <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[10px] bg-muted/50">
                                    {ideasByStatus(s.value).length}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {STATUSES.map(statusData => (
                        <TabsContent key={statusData.value} value={statusData.value} className="space-y-4 focus-visible:outline-none focus-visible:ring-0 min-h-[400px]">

                            {/* Input Form only on 'raw' tab */}
                            {statusData.value === "raw" && (
                                <Card className="p-2 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl mb-6 shadow-sm">
                                    <form onSubmit={handleCreateIdea} className="flex gap-2 relative">
                                        <Input
                                            placeholder="Jot down a new idea... (e.g. 5 tips for Next.js routing)"
                                            value={newIdeaContent}
                                            onChange={(e) => setNewIdeaContent(e.target.value)}
                                            className="border-0 shadow-none bg-transparent focus-visible:ring-0 px-4 text-sm font-medium placeholder:font-normal"
                                            disabled={createIdea.isPending}
                                            autoFocus
                                        />
                                        <Button
                                            size="sm"
                                            type="submit"
                                            disabled={!newIdeaContent.trim() || createIdea.isPending}
                                            className="rounded-xl px-5 transition-all shadow-sm"
                                        >
                                            {createIdea.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                                            Save Idea
                                        </Button>
                                    </form>
                                </Card>
                            )}

                            {/* Idea List */}
                            <div className="grid gap-3">
                                {isLoading ? (
                                    <div className="min-h-[200px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
                                    </div>
                                ) : ideasByStatus(statusData.value).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/50 rounded-3xl bg-background/20 backdrop-blur-sm animate-in zoom-in-95 duration-500">
                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-5 ${statusData.color} bg-opacity-10`}>
                                            <Lightbulb className="h-7 w-7 opacity-75" />
                                        </div>
                                        <h3 className="text-base font-bold mb-1.5">No {statusData.label.toLowerCase()} ideas</h3>
                                        <p className="text-muted-foreground text-sm max-w-[260px] leading-relaxed">
                                            {statusData.value === "raw"
                                                ? "Empty mind? Go touch some grass or browse for inspiration."
                                                : `Move ideas from the previous stage to see them here.`}
                                        </p>
                                    </div>
                                ) : (
                                    ideasByStatus(statusData.value).map((idea) => (
                                        <Card
                                            key={idea.id}
                                            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 border-border/40 group bg-background/40 backdrop-blur-xl hover:bg-background/80 hover:shadow-lg hover:-translate-y-0.5 rounded-2xl animate-in fade-in slide-in-from-bottom-2`}
                                        >
                                            <div className="space-y-2 flex-1 pr-4">
                                                <p className="font-semibold text-sm leading-relaxed text-foreground/90">{idea.content}</p>
                                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80 font-medium tracking-wide">
                                                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {timeAgo(idea.createdAt)}</span>
                                                    <span className="opacity-40">•</span>
                                                    <Badge variant="outline" className={`text-[9px] px-2 py-0 rounded-full font-bold uppercase tracking-wider ${statusData.color} border-current/20 bg-transparent`}>
                                                        {statusData.label}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                                    onClick={() => deleteIdea.mutate({ id: idea.id })}
                                                    disabled={deleteIdea.isPending}
                                                    title="Delete Idea"
                                                >
                                                    {deleteIdea.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </Button>

                                                {statusData.value !== "done" ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-9 rounded-full text-xs font-semibold px-4 shadow-sm hover:shadow transition-all hover:bg-secondary/80"
                                                        onClick={() => handleMoveStatus(idea.id, statusData.value)}
                                                        disabled={updateIdea.isPending}
                                                    >
                                                        {updateIdea.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                                                        Move to {STATUSES.findIndex(s => s.value === statusData.value) < 3 ? STATUSES[STATUSES.findIndex(s => s.value === statusData.value) + 1]?.label : ""}
                                                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 rounded-full text-xs font-bold px-4 text-emerald-600 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-default"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                                        Completed
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
