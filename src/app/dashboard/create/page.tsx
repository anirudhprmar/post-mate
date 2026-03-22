"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Check,
    Clock,
    History,
    Lightbulb,
    Loader2,
    Send,
    Sparkles as SparklesIcon,
    Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

/* ─── constants ─── */

const ideaStatusColor: Record<string, string> = {
    raw: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    refined: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    drafting: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    done: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

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
    return `${days}d ago`;
}

/* ─── skeletons ─── */

function IdeaCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/40 bg-background/30 backdrop-blur-xl p-5 min-h-[100px]">
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    );
}

/* ─── main component ─── */

export default function CreatePostPage() {
    const router = useRouter();
    const utils = api.useUtils();

    /* ─ queries ─ */
    const { data: ideas, isLoading: ideasLoading } = api.idea.getAll.useQuery();

    /* ─ mutations ─ */
    const createDraft = api.draft.create.useMutation({
        onSuccess: () => {
            void utils.draft.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
            toast.success("Draft saved! 🎉");
            router.push("/dashboard/drafts");
        },
        onError: () => {
            toast.error("Failed to save draft — try again.");
        },
    });

    const updateIdea = api.idea.update.useMutation({
        onSuccess: () => {
            void utils.idea.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
        },
    });

    /* ─ local state ─ */
    const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [platform, setPlatform] = useState("linkedin");

    const availableIdeas = useMemo(() => {
        if (!ideas) return [];
        return ideas.filter((i) => i.status !== "done");
    }, [ideas]);

    const selectedIdea = ideas?.find((i) => i.id === selectedIdeaId);

    /* ─ handlers ─ */

    function selectIdea(ideaId: string) {
        const idea = ideas?.find((i) => i.id === ideaId);
        if (!idea) return;
        setSelectedIdeaId(ideaId);
        setContent(idea.content);
    }

    function handleSave() {
        if (!content.trim()) {
            toast.error("Write some content first!");
            return;
        }
        if (!selectedIdeaId) {
            toast.error("Select a source idea first.");
            return;
        }

        createDraft.mutate({
            ideaId: selectedIdeaId,
            content: content.trim(),
            platform: platform,
            status: "writing",
        });

        // Mark the idea as "drafting"
        if (selectedIdea && selectedIdea.status !== "drafting" && selectedIdea.status !== "done") {
            updateIdea.mutate({ id: selectedIdeaId, status: "drafting" });
        }
    }

    const isSaving = createDraft.isPending;

    return (
        <div className="relative min-h-screen w-full">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            <div className="flex flex-col h-screen p-4 md:p-8 relative z-10">

                {/* ─── Top bar: back + history ─── */}
                <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back
                    </Link>


                </div>

                {/* ─── Main editor area (grows to fill) ─── */}
                <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 ease-out">

                    {/* Selected idea indicator */}
                    <AnimatePresence>
                        {selectedIdea && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="w-full mb-4 overflow-hidden"
                            >
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate flex-1">
                                        From: <span className="font-semibold text-foreground">{selectedIdea.content}</span>
                                    </p>
                                    <button
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                                        onClick={() => { setSelectedIdeaId(null); setContent(""); }}
                                    >
                                        Change
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Editor card */}
                    <Card className="w-full flex-1 min-h-[280px] max-h-[50vh] border-border/40 bg-background/40 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start writing your post…"
                            className="flex-1 w-full resize-none border-none bg-transparent p-6 md:p-8 text-base md:text-lg leading-relaxed placeholder:text-muted-foreground/40 outline-none"
                            spellCheck={false}
                            autoFocus
                        />

                        {/* Bottom bar inside editor */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
                            <div className="flex items-center gap-3">
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger className="h-7 text-xs rounded-full border-border/40 bg-background/50 backdrop-blur-sm shadow-sm min-w-[100px]">
                                        <SelectValue placeholder="Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="x">X (Twitter)</SelectItem>
                                        <SelectItem value="threads">Threads</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                    </SelectContent>
                                </Select>

                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-500 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-all cursor-pointer"
                                    onClick={() => {
                                        if (!content.trim()) {
                                            toast.error("Write a post or idea first to use AI!");
                                            return;
                                        }
                                        const searchParams = new URLSearchParams({
                                            prompt: content.trim(),
                                            platform: platform,
                                            ...(selectedIdeaId ? { ideaId: selectedIdeaId } : {})
                                        });
                                        router.push(`/dashboard/chat?${searchParams.toString()}`);
                                    }}
                                >
                                    <SparklesIcon className="h-3 w-3" />
                                    AI
                                </motion.button>
                                <span className="text-xs text-muted-foreground/50 font-medium tabular-nums">
                                    {content.length} chars
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full gap-2 transition-all px-5 border-border/40"
                                        onClick={handleSave}
                                        disabled={isSaving || !content.trim() || !selectedIdeaId}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                Saving…
                                            </>
                                        ) : (
                                            "Save Draft"
                                        )}
                                    </Button>
                                </motion.div>
                                <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="sm"
                                        className="rounded-full gap-2 shadow-md hover:shadow-primary/25 transition-all px-5"
                                        onClick={() => toast.info("Publishing coming soon! 🚀")}
                                        disabled={isSaving || !content.trim() || !selectedIdeaId}
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        Post
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ─── Source Ideas (bottom) ─── */}
                <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 ease-out pb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-1 flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        Source Ideas
                    </h2>

                    {ideasLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <IdeaCardSkeleton />
                            <IdeaCardSkeleton />
                            <IdeaCardSkeleton />
                        </div>
                    ) : availableIdeas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-background/20 backdrop-blur-sm">
                            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
                                <Lightbulb className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">No ideas yet</h3>
                            <p className="text-muted-foreground text-xs max-w-xs">
                                Jot down ideas on the dashboard first, then come back here to turn them into posts.
                            </p>
                            <Link href="/dashboard" className="mt-3">
                                <Button variant="outline" size="sm" className="rounded-full text-xs">
                                    Go to Ideas
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {availableIdeas.slice(0, 6).map((idea) => (
                                <motion.div
                                    key={idea.id}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Card
                                        className={`p-4 cursor-pointer transition-all duration-300 border-border/40 backdrop-blur-xl hover:shadow-lg hover:shadow-foreground/5 rounded-2xl group min-h-[90px] flex flex-col justify-between ${selectedIdeaId === idea.id
                                            ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20"
                                            : "bg-background/40 hover:bg-background/60"
                                            }`}
                                        onClick={() => selectIdea(idea.id)}
                                    >
                                        <p className={`text-sm font-medium line-clamp-2 leading-snug transition-colors ${selectedIdeaId === idea.id
                                            ? "text-primary"
                                            : "group-hover:text-primary"
                                            }`}>
                                            {idea.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Badge
                                                variant="outline"
                                                className={`text-[9px] px-2 py-0 rounded-full font-semibold capitalize ${ideaStatusColor[idea.status] ?? ""}`}
                                            >
                                                {idea.status}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground/60 font-medium">
                                                {timeAgo(idea.createdAt)}
                                            </span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}