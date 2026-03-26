"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ArrowLeft, Lightbulb, Loader2, Save, Send, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
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

/* ─── constants ─── */
const draftStatuses = ["writing", "review", "ready", "published"] as const;
type DraftStatus = typeof draftStatuses[number];

const draftStatusStyles: Record<DraftStatus, string> = {
    writing: "bg-amber-500/10 text-amber-600 border-amber-500/20 data-[active=true]:bg-amber-500 data-[active=true]:text-white",
    review: "bg-blue-500/10 text-blue-600 border-blue-500/20 data-[active=true]:bg-blue-500 data-[active=true]:text-white",
    ready: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 data-[active=true]:bg-emerald-500 data-[active=true]:text-white",
    published: "bg-violet-500/10 text-violet-600 border-violet-500/20 data-[active=true]:bg-violet-500 data-[active=true]:text-white",
};

export default function PostEditor() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const isNew = params.id === "new";
    const draftId = isNew ? null : (params.id as string);

    const utils = api.useUtils();

    // Pre-fill from query params (when coming from idea page)
    const paramIdeaId = searchParams.get("ideaId") ?? undefined;
    const paramContent = searchParams.get("content") ?? "";

    const [content, setContent] = useState(paramContent);
    const [platform, setPlatform] = useState("linkedin");
    const [media, setMedia] = useState("");
    const [status, setStatus] = useState<DraftStatus>("writing");
    const [ideaId, setIdeaId] = useState<string | undefined>(paramIdeaId);

    const { data: draft, isLoading: isLoadingDraft } = api.draft.getById.useQuery(
        { id: draftId! },
        { enabled: !!draftId }
    );

    useEffect(() => {
        if (draft) {
            setContent(draft.content || "");
            setPlatform(draft.platform?.toLowerCase() || "linkedin");
            setMedia(draft.media || "");
            setStatus((draft.status as DraftStatus) || "writing");
            setIdeaId(draft.ideaId ?? undefined);
        }
    }, [draft]);

    const updateDraft = api.draft.update.useMutation({
        onSuccess: () => {
            toast.success("Draft updated! 📝");
            void utils.draft.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
        }
    });

    const createDraft = api.draft.create.useMutation({
        onSuccess: (data) => {
            toast.success("Draft created! 🎉");
            void utils.draft.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
            if (data?.id) {
                router.push(`/dashboard/post/${data.id}`);
            }
        }
    });

    const deleteDraft = api.draft.delete.useMutation({
        onSuccess: () => {
            toast.success("Draft deleted.");
            void utils.draft.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
            router.push("/dashboard/drafts");
        },
        onError: () => toast.error("Delete failed — try again."),
    });

    const handleSave = () => {
        if (!content.trim()) return toast.error("Write some content before saving.");
        if (isNew) {
            createDraft.mutate({ ideaId, content, platform, status, media });
        } else {
            updateDraft.mutate({ id: draftId!, content, platform, status, media });
        }
    };

    const handleStatusChange = (s: DraftStatus) => {
        setStatus(s);
        // Auto-save status change on existing drafts
        if (!isNew && draftId) {
            updateDraft.mutate({ id: draftId, status: s });
        }
    };

    const handleSchedule = () => {
        if (!content.trim()) {
            toast.error("Write some content first!");
            return;
        }
        if (platform === "x") {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
            window.open(url, "_blank", "noopener,noreferrer");
        } else {
            toast.info("Scheduling for this platform is coming soon! 🚀");
        }
    };

    const isSaving = createDraft.isPending || updateDraft.isPending;
    const isDeleting = deleteDraft.isPending;

    if (!isNew && isLoadingDraft) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary/50" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full">
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative z-10">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/drafts">
                            <Button variant="ghost" size="icon" className="rounded-full shadow-sm bg-background/50 backdrop-blur-md border border-border/40 hover:bg-background/80">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground/90 leading-tight">
                                {isNew ? "Create Post" : "Edit Post"}
                            </h1>
                            {/* Source idea link */}
                            {!isNew && ideaId && (
                                <Link href={`/dashboard/idea/${ideaId}`} className="text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5 flex items-center gap-1 font-medium">
                                    <Lightbulb className="h-3 w-3 text-amber-500" />
                                    View source idea
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Delete button — only on existing drafts */}
                        {!isNew && (
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
                                        <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the draft. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteDraft.mutate({ id: draftId! })}
                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <Button
                            variant="secondary"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-full gap-2 shadow-sm font-medium transition-all hover:scale-105 active:scale-95"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Draft
                        </Button>
                        <Button
                            className="rounded-full gap-2 shadow-md hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                            onClick={handleSchedule}
                        >
                            <Send className="h-4 w-4" />
                            {platform === "x" ? "Post on X" : "Schedule"}
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
                    {/* Left Column - Editor */}
                    <div className="lg:col-span-7 flex flex-col gap-4">

                        {/* Platform + Status selectors row */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl">
                                <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Platform</h2>
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-10">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="x">X (Twitter)</SelectItem>
                                        <SelectItem value="threads">Threads</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Card>

                            <Card className="p-4 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl">
                                <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Status</h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {draftStatuses.map((s) => (
                                        <button
                                            key={s}
                                            data-active={status === s}
                                            onClick={() => handleStatusChange(s)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200 capitalize cursor-pointer ${draftStatusStyles[s]}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Content Editor */}
                        <Card className="p-0 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-border/20 bg-background/20">
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</h2>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What do you want to share today? ✨&#10;Pro tip: Use the AI button to generate variations or refine your tone."
                                className="w-full flex-1 resize-none bg-transparent p-6 outline-none text-base md:text-lg leading-relaxed placeholder:text-muted-foreground/40"
                                spellCheck={false}
                                autoFocus={isNew}
                            />
                            <div className="p-3 border-t border-border/20 bg-background/20 flex justify-between items-center text-xs text-muted-foreground">
                                <span>{content.length} characters</span>
                                <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                            </div>
                        </Card>

                        {/* Media Upload */}
                        <Card className="p-4 border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl">
                            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Media</h2>
                            <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium mb-1">Click to upload media</p>
                                <p className="text-xs text-muted-foreground">Supports JPG, PNG, MP4 (max 10MB)</p>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <Card className="border-border/40 bg-background/40 backdrop-blur-xl rounded-2xl flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-border/20 bg-background/20 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</h2>
                                <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">{platform}</span>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto bg-background/10">
                                <div className="max-w-[340px] mx-auto bg-background border border-border/30 shadow-xl rounded-[2rem] overflow-hidden min-h-[400px] flex flex-col">
                                    {/* Preview Header */}
                                    <div className="p-4 flex items-center gap-3 border-b border-border/10">
                                        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3.5 w-24 bg-muted rounded animate-pulse" />
                                            <div className="h-2.5 w-16 bg-muted rounded animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Preview Content */}
                                    <div className="p-4 flex-1">
                                        <p className="text-sm whitespace-pre-wrap text-foreground/90">
                                            {content || <span className="text-muted-foreground italic">Your post will look like this...</span>}
                                        </p>
                                    </div>

                                    {/* Preview Actions */}
                                    <div className="p-4 flex gap-4 border-t border-border/10 opacity-60">
                                        <div className="w-4 h-4 rounded-sm bg-muted animate-pulse" />
                                        <div className="w-4 h-4 rounded-sm bg-muted animate-pulse" />
                                        <div className="w-4 h-4 rounded-sm bg-muted animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
