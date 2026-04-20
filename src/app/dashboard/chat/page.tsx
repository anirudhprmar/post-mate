"use client";

import { use, useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import {
    ArrowLeft,
    Send,
    Bot,
    User,
    Loader2,
    Save,
    Sparkles,
    Check,
    Copy,
    LayoutPanelLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

import { DefaultChatTransport } from "ai";

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Ensure params are strings to fix TypeScript errors
    const prompt = searchParams.get("prompt") ?? "";
    const ideaId = searchParams.get("ideaId") ?? "";
    const platform = searchParams.get("platform") ?? "";

    const utils = api.useUtils();

    // Final post editor state
    const [finalContent, setFinalContent] = useState(prompt);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [input, setInput] = useState("");
    const [pendingAction, setPendingAction] = useState<"post" | "save" | null>(null);

    const { messages, sendMessage, status, error } = useChat({
        id: "post-chat",
        transport: new DefaultChatTransport({ api: `/api/chat?platform=${platform}` }),
        onFinish: (message) => {
            // Optionally auto-update final content
        },
        onError: (err) => {
            toast.error("Failed to generate response: " + err.message);
        }
    });

    const isLoading = status === "submitted" || status === "streaming";

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;
        sendMessage({ text: input });
        setInput("");
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial prompt append
    const initialPromptAppended = useRef(false);
    useEffect(() => {
        if (prompt && !initialPromptAppended.current && messages.length === 0) {
            initialPromptAppended.current = true;
            sendMessage({ text: prompt });
        }
    }, [prompt, sendMessage, messages.length]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // TRPC Mutations
    const createDraft = api.draft.create.useMutation({
        onSuccess: () => {
            void utils.draft.getAll.invalidate();
            void utils.dashboard.getStats.invalidate();
        },
    });

    const handleSaveDraft = () => {
        if (!finalContent.trim()) {
            toast.error("Final content is empty!");
            return;
        }
        setPendingAction("save");
        createDraft.mutate({
            ideaId: ideaId || "dummy-idea",
            content: finalContent.trim(),
            platform: platform || "X",
            status: "writing", // draft
        }, {
            onSuccess: () => {
                toast.success("Draft saved successfully!");
                router.push("/dashboard/drafts");
            },
            onError: (err) => {
                toast.error("Failed to save draft: " + err.message);
                setPendingAction(null);
            }
        });
    };

    const handlePostNow = () => {
        if (!finalContent.trim()) {
            toast.error("Final content is empty!");
            return;
        }
        setPendingAction("post");
        createDraft.mutate({
            ideaId: ideaId || "dummy-idea",
            content: finalContent.trim(),
            platform: platform || "X",
            status: "ready", // ready to post
        }, {
            onSuccess: () => {
                toast.success("Post scheduled/published successfully! 🚀");
                router.push("/dashboard/drafts"); // Or wherever appropriate
            },
            onError: (err) => {
                toast.error("Failed to post: " + err.message);
                setPendingAction(null);
            }
        });
    };

    const copyToEditor = (text: string) => {
        setFinalContent(text);
        toast.success("Copied to editor!");
    };

    return (
        <div className="relative min-h-screen grid grid-cols-2  bg-background">
            {/* Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            {/* Left Column: Chat */}
            <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-full" : "w-full"} h-screen relative z-10`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/40 bg-background/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/create"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back
                        </Link>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full lg:hidden border-border/40"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <LayoutPanelLeft className="h-4 w-4" />
                    </Button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.length === 0 && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
                            <p className="text-sm">I'm here to help you perfect your post.</p>
                        </div>
                    )}

                    {messages.map((m) => {
                        const messageText = m.parts
                            ? m.parts.filter(p => p.type === 'text').map((p: any) => p.text).join('')
                            : (m as any).text || "";

                        return (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${m.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background border border-border/50 text-foreground"
                                    }`}>
                                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>

                                <div className={`group flex flex-col gap-2 max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
                                        : "bg-background border border-border/40 rounded-tl-sm shadow-sm"
                                        }`}>
                                        {messageText}
                                    </div>

                                    {m.role === "assistant" && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs gap-1.5 rounded-full"
                                                onClick={() => copyToEditor(messageText)}
                                            >
                                                <Check className="h-3 w-3" />
                                                Use this
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}

                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex gap-4 flex-row">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-background border border-border/50 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-foreground" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl bg-background border border-border/40 rounded-tl-sm shadow-sm flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-foreground/20 animate-bounce" />
                                <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 animate-bounce delay-75" />
                                <div className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-bounce delay-150" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-background/50 backdrop-blur-md border-t border-border/40">
                    <form
                        onSubmit={handleSubmit}
                        className="relative flex items-center max-w-4xl mx-auto"
                    >
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tell AI how to improve your post..."
                            className="w-full bg-background resize-none rounded-3xl py-4 pl-6 pr-14 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none text-sm leading-relaxed shadow-sm min-h-[56px] max-h-[150px]"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    const form = e.currentTarget.form;
                                    if (form) form.requestSubmit();
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-2 h-10 w-10 border-none rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-muted-foreground">AI can make mistakes. Review content before posting.</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Final Editor */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        className="hidden lg:flex w-2/5 flex-col border-l border-border/40 bg-background/60 backdrop-blur-xl h-screen z-20"
                    >
                        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-background/40">
                            <div>
                                <h2 className="text-sm font-semibold flex items-center gap-2">
                                    <EditIcon className="h-4 w-4 text-muted-foreground" />
                                    Final Post
                                </h2>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Edit and prepare for publishing</p>
                            </div>
                            <span className="text-xs text-muted-foreground/50 tabular-nums font-medium bg-muted/50 px-2 py-1 rounded-md">
                                {finalContent.length} chars
                            </span>
                        </div>

                        <div className="flex-1 p-6 flex flex-col">
                            <textarea
                                value={finalContent}
                                onChange={(e) => setFinalContent(e.target.value)}
                                placeholder="Your finalized post will appear here..."
                                className="flex-1 w-full bg-transparent resize-none outline-none border-none text-base leading-relaxed placeholder:text-muted-foreground/40"
                            />
                        </div>

                        <div className="p-6 border-t border-border/40 bg-background/40 flex flex-col gap-3">
                            <Button
                                className="w-full rounded-2xl py-6 shadow-md shadow-primary/20 gap-2"
                                onClick={handlePostNow}
                                disabled={pendingAction !== null || !finalContent.trim()}
                            >
                                {pendingAction === "post" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Post it now
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full rounded-2xl py-6 border-border/40 gap-2"
                                onClick={handleSaveDraft}
                                disabled={pendingAction !== null || !finalContent.trim()}
                            >
                                {pendingAction === "save" ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Save className="h-4 w-4 text-muted-foreground" />}
                                Save to Drafts
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Actions Drawer (Visible only on small screens) */}
            <div className={`lg:hidden fixed bottom-24 left-4 right-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-xl z-50 transition-transform ${isSidebarOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold">Ready to publish?</h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={() => setIsSidebarOpen(false)}>✕</Button>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="flex-1 rounded-xl shadow-md gap-1.5 h-10 text-xs"
                        onClick={handlePostNow}
                        disabled={pendingAction !== null || !finalContent.trim()}
                    >
                        {pendingAction === "post" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Post
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl gap-1.5 h-10 text-xs"
                        onClick={handleSaveDraft}
                        disabled={pendingAction !== null || !finalContent.trim()}
                    >
                        {pendingAction === "save" ? <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" /> : <Save className="h-3 w-3 text-muted-foreground" />} Draft
                    </Button>
                </div>
            </div>

        </div>
    );
}

function EditIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z" />
        </svg>
    )
}
