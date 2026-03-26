"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
    ArrowLeft,
    Clock,
    FileText,
    Lightbulb,
    Loader2,
    PenTool,
    Plus,
    Save,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";

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

const ideaStatuses = ["raw", "refined", "drafting", "done"] as const;
type IdeaStatus = typeof ideaStatuses[number];

const ideaStatusStyles: Record<IdeaStatus, string> = {
    raw: "bg-amber-500/10 text-amber-600 border-amber-500/20 data-[active=true]:bg-amber-500 data-[active=true]:text-white",
    refined: "bg-blue-500/10 text-blue-600 border-blue-500/20 data-[active=true]:bg-blue-500 data-[active=true]:text-white",
    drafting: "bg-violet-500/10 text-violet-600 border-violet-500/20 data-[active=true]:bg-violet-500 data-[active=true]:text-white",
    done: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 data-[active=true]:bg-emerald-500 data-[active=true]:text-white",
};

const draftStatusStyles: Record<string, string> = {
    writing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    review: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    ready: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    published: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

const platformLabel: Record<string, string> = {
    linkedin: "LinkedIn",
    x: "X",
    twitter: "X",
    threads: "Threads",
    instagram: "Instagram",
    youtube: "YouTube",
};

/* ─── main ─── */
export default function IdeaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ideaId = params.id as string;
    const utils = api.useUtils();

    const { data: idea, isLoading } = api.idea.getById.useQuery({ id: ideaId });

    const [content, setContent] = useState("");
    const [status, setStatus] = useState<IdeaStatus>("raw");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (idea) {
            setContent(idea.content);
            setStatus(idea.status as IdeaStatus);
        }
    }, [idea]);

    const updateIdea = api.idea.update.useMutation({
        onSuccess: () => {
            toast.success("Idea saved ✅");
            void utils.idea.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
            setIsDirty(false);
        },
        onError: () => toast.error("Failed to save — try again."),
    });

    const deleteIdea = api.idea.delete.useMutation({
        onSuccess: () => {
            toast.success("Idea deleted.");
            void utils.idea.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
            router.push("/dashboard");
        },
        onError: () => toast.error("Delete failed — try again."),
    });

    const handleSave = () => {
        if (!content.trim()) return toast.error("Idea content can't be empty.");
        updateIdea.mutate({ id: ideaId, content: content.trim(), status });
    };

    const handleStatusChange = (s: IdeaStatus) => {
        setStatus(s);
        setIsDirty(true);
    };

    const isSaving = updateIdea.isPending;
    const isDeleting = deleteIdea.isPending;

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary/50" />
            </div>
        );
    }

    if (!idea) {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
                <Lightbulb className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground font-medium">Idea not found.</p>
                <Link href="/dashboard">
                    <Button variant="outline" className="rounded-full">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full">
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative z-10">

                {/* ── Header ── */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full shadow-sm bg-background/50 backdrop-blur-md border border-border/40 hover:bg-background/80">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Idea</h1>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> Created {timeAgo(idea.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={handleSave}
                            disabled={isSaving || (!isDirty && content === idea.content && status === idea.status)}
                            className="rounded-full gap-2 font-medium transition-all hover:scale-105 active:scale-95"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDeleting}
                                    className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the idea and all its linked drafts. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteIdea.mutate({ id: ideaId })}
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </header>

                {/* ── Status changer ── */}
                <Card className="p-4 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                        {ideaStatuses.map((s) => (
                            <button
                                key={s}
                                data-active={status === s}
                                onClick={() => handleStatusChange(s)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 capitalize cursor-pointer ${ideaStatusStyles[s]}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* ── Content editor ── */}
                <Card className="p-0 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border/20 bg-background/20 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
                        placeholder="What's the idea?"
                        className="w-full min-h-[200px] resize-none bg-transparent p-6 outline-none text-base md:text-lg leading-relaxed placeholder:text-muted-foreground/40"
                        spellCheck={false}
                    />
                    <div className="p-3 border-t border-border/20 bg-background/20 flex justify-between text-xs text-muted-foreground">
                        <span>{content.length} characters</span>
                        <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                    </div>
                </Card>

                {/* ── Create draft CTA ── */}
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary/70" />
                        Linked Drafts
                        {idea.drafts.length > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">({idea.drafts.length})</span>
                        )}
                    </h2>
                    <Link href={`/dashboard/post/new?ideaId=${ideaId}&content=${encodeURIComponent(content)}`}>
                        <Button size="sm" className="rounded-full gap-2 shadow-sm transition-all hover:scale-105 active:scale-95">
                            <Plus className="h-3.5 w-3.5" />
                            New Draft
                        </Button>
                    </Link>
                </div>

                {/* ── Draft list ── */}
                {idea.drafts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-background/20 backdrop-blur-sm">
                        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
                            <PenTool className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">No drafts yet</h3>
                        <p className="text-muted-foreground text-xs max-w-xs">
                            Turn this idea into a post — click "New Draft" above to start writing.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {idea.drafts.map((d) => (
                            <Link key={d.id} href={`/dashboard/post/${d.id}`} className="block group">
                                <Card className="p-5 flex flex-col justify-between min-h-[120px] border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 cursor-pointer">
                                    <p className="text-sm font-medium line-clamp-3 group-hover:text-primary transition-colors leading-relaxed">
                                        {d.content}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground/80 font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(d.updatedAt)}</span>
                                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] capitalize">
                                                {platformLabel[d.platform.toLowerCase()] ?? d.platform}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold capitalize border ${draftStatusStyles[d.status] ?? ""}`}
                                        >
                                            {d.status}
                                        </Badge>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
