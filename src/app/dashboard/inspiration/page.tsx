"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "~/components/ui/dialog";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import PostScraper, { PostCard } from "~/components/PostScraper";
import { toast } from "sonner";

export default function InspirationPage() {
    const utils = api.useUtils();
    const { data: inspirations, isLoading } = api.inspiration.getAll.useQuery();

    const [isOpen, setIsOpen] = useState(false);

    const createInspiration = api.inspiration.create.useMutation({
        onSuccess: () => {
            utils.inspiration.getAll.invalidate();
            setIsOpen(false);
            toast.success("Saved to inspiration board!");
        },
        onError: (err) => {
            toast.error("Failed to save: " + err.message);
        }
    });

    const handleSave = (url: string, result: any) => {
        createInspiration.mutate({
            sourceProfileUrl: url,
            postData: JSON.stringify(result)
        });
    }

    return (
        <div className="relative min-h-screen w-full">
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 pointer-events-none" />

            <div className="max-w-[70rem] mx-auto p-4 md:p-8 space-y-12 relative z-10 animate-in fade-in duration-700">
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Inspiration Board ✨</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Collect your favorite posts to study their writing styles and content structures.
                    </p>
                </header>

                {/* Top Section: Platforms */}
                <section>
                    <h2 className="text-xl font-semibold mb-5 text-foreground/80">Add New Inspiration</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Card className="p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group backdrop-blur-xl border-border/40 shadow-sm hover:shadow-primary/10">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Plus className="h-7 w-7 text-primary" />
                                    </div>
                                    <span className="font-semibold text-lg">Paste a Link</span>
                                    <span className="text-xs text-muted-foreground">Supported: X, Reddit</span>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl bg-[#0e0e10] border-[#2a2a30] p-0 overflow-hidden text-[#e8e6e3]">
                                <DialogHeader className="p-6 pb-0">
                                    <DialogTitle className="text-xl font-bold">
                                        Import Post
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[85vh] overflow-y-auto">
                                    <PostScraper onSave={handleSave} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>

                <div className="w-full h-[1px] bg-border/40 my-8" />

                {/* Bottom Section: Saved Inspirations */}
                <section>
                    <h2 className="text-xl font-semibold mb-6 text-foreground/80">Your Collection</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/30" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {inspirations?.map((item) => {
                                let post = null;
                                try {
                                    if (item.postData) post = JSON.parse(item.postData);
                                } catch (e) { }

                                const sourceProfileUrl = (item as { sourceProfileUrl?: string })
                                    .sourceProfileUrl;

                                // Format the prompt for AI properly
                                const promptText = post
                                    ? (post.text ? post.text : post.title)
                                    : (sourceProfileUrl ?? "");
                                const promptUrl = `Remake this post concept and writing style:\n\n${promptText}\n\nUrl: ${sourceProfileUrl ?? ""}`;

                                return (
                                    <div key={item.id} className="h-full flex flex-col">
                                        {post ? (
                                            <div className="h-full flex flex-col bg-[#16161a] border-[1.5px] border-[#2a2a30] rounded-[16px] overflow-hidden group hover:border-[#4a4a50] transition-colors relative shadow-lg">
                                                <div className="scale-[1] origin-top border-none shadow-none h-full m-0 p-0">
                                                    <PostCard
                                                        post={post}
                                                        actions={
                                                            <Link href={`/dashboard/chat?prompt=${encodeURIComponent(promptUrl)}&platform=${post.platform === 'twitter' ? 'x' : post.platform}`}>
                                                                <Button className="w-full gap-2 rounded-xl mt-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform group-hover:-translate-y-1" variant="default" size="lg">
                                                                    <RefreshCw className="h-4 w-4" /> Remake
                                                                </Button>
                                                            </Link>
                                                        }
                                                    />
                                                </div>
                                                {/* Local styles inherited from scraper CSS just for this card */}
                                                <style dangerouslySetInnerHTML={{
                                                    __html: `
                                                    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');
                                                    /* Minimal inherited styles since PostCard leverages parent CSS but here it's isolated */
                                                    .post-card { padding: 24px; font-family: 'DM Sans', sans-serif; height: 100%; display: flex; flex-direction: column; }
                                                    .post-platform { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; margin-bottom: 16px; color: #666; }
                                                    .post-card.reddit .post-platform { color: #ff6634; }
                                                    .post-card.twitter .post-platform { color: #4db8ff; }
                                                    .subreddit { background: #ffffff0d; padding: 2px 10px; border-radius: 999px; font-size: 12px; color: #888; }
                                                    .post-title { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 700; line-height: 1.4; color: #e8e6e3; margin-bottom: 14px; }
                                                    .post-text { font-size: 14px; line-height: 1.7; color: #aaa; margin-bottom: 18px; white-space: pre-wrap; flex-grow: 1; }
                                                    .post-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 13px; color: #555; margin-bottom: 18px; }
                                                    .external-link { display: block; font-size: 13px; color: #4db8ff; word-break: break-all; margin-bottom: 18px; text-decoration: none; }
                                                    .media-section { margin-bottom: 20px; }
                                                    .media-label { font-size: 12px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
                                                    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
                                                    .media-item { background: #0e0e10; border: 1px solid #2a2a30; border-radius: 10px; overflow: hidden; max-height: 240px; }
                                                    .media-item img, .media-item video { width: 100%; display: block; height: 100%; object-fit: cover; }
                                                    .media-url { display: block; font-size: 12px; color: #555; padding: 8px 12px; text-decoration: none; }
                                                    .source-link { display: inline-block; font-size: 13px; color: #555; text-decoration: none; border-top: 1px solid #222; padding-top: 16px; margin-top: 4px; width: 100%; transition: color 0.2s; }
                                                `}} />
                                            </div>
                                        ) : (
                                            <Card className="p-6 flex flex-col justify-between h-full bg-[#16161a] border-[#2a2a30]">
                                                <div className="text-[#aaa] break-all mb-4 text-sm font-medium">
                                                    {sourceProfileUrl}
                                                </div>
                                                <Link href={`/dashboard/chat?prompt=Remake this post link:\n\n${encodeURIComponent(sourceProfileUrl ?? "")}&platform=x`}>
                                                    <Button className="w-full gap-2 rounded-xl" variant="outline">
                                                        <RefreshCw className="h-4 w-4" /> Remake
                                                    </Button>
                                                </Link>
                                            </Card>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {!isLoading && inspirations?.length === 0 && (
                        <div className="w-full py-16 text-center shadow-inner text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl bg-background/20 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Inspirations Yet</h3>
                            <p className="max-w-sm mx-auto">Paste a link above to fetch a post and save it to your inspiration board to study later!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}