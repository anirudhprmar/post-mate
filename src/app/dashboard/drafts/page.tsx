import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Clock, Plus, PenTool } from "lucide-react";
import Link from "next/link";

// Mock Data
const allDrafts = [
    { id: 1, title: "5 Tips for better React Performance", platform: "LinkedIn", time: "2 hours ago", status: "Draft" },
    { id: 2, title: "Just launched our new component library! 🚀 Drop a ⭐ if you like it.", platform: "X", time: "5 hours ago", status: "Scheduled" },
    { id: 3, title: "A deep dive into Next.js 14 server actions and why they matter for form handling.", platform: "Threads", time: "Yesterday", status: "Draft" },
    { id: 4, title: "Building a Glassmorphic UI in Tailwind CSS - A quick tutorial", platform: "LinkedIn", time: "2 days ago", status: "Idea" },
    { id: 5, title: "Here are 3 common mistakes junior devs make when learning TypeScript.", platform: "X", time: "3 days ago", status: "Scheduled" },
    { id: 6, title: "Workspace setup tour 📸", platform: "Instagram", time: "Last week", status: "Draft" },
];

export default function DraftsPage() {
    return (
        <div className="relative min-h-screen w-full">
            {/* Animated Mesh Background (Consistent with Dashboard) */}
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative z-10">

                {/* Header Section */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground/90 leading-tight">
                            Your Drafts 📝
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xl mt-1 font-medium">
                            Manage your saved ideas, works in progress, and scheduled posts.
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button className="rounded-full gap-2 shadow-md hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                            <Plus className="h-4 w-4" /> New Post
                        </Button>
                    </Link>
                </header>

                {/* Main Content Area with Tabs */}
                <div className="mt-8">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="px-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            <TabsList className="bg-background/40 backdrop-blur-xl border border-border/40 p-1.5 rounded-full inline-flex md:flex shadow-sm">
                                <TabsTrigger value="all" className="rounded-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    All Drafts
                                </TabsTrigger>
                                <TabsTrigger value="x" className="rounded-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    X (Twitter)
                                </TabsTrigger>
                                <TabsTrigger value="linkedin" className="rounded-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    LinkedIn
                                </TabsTrigger>
                                <TabsTrigger value="threads" className="rounded-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    Threads
                                </TabsTrigger>
                                <TabsTrigger value="instagram" className="rounded-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    Instagram
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Content mapped for each tab */}
                        {["all", "x", "linkedin", "threads", "instagram"].map((tabPlatform) => {
                            const filteredDrafts = tabPlatform === "all"
                                ? allDrafts
                                : allDrafts.filter(d => d.platform.toLowerCase().includes(tabPlatform.replace('x', 'x')));

                            return (
                                <TabsContent key={tabPlatform} value={tabPlatform} className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {filteredDrafts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 pb-10">
                                            {filteredDrafts.map((draft) => (
                                                <Card
                                                    key={draft.id}
                                                    className="p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer border-border/40 group bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1 rounded-3xl min-h-[160px]"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <p className="font-semibold text-lg line-clamp-2 md:line-clamp-3 group-hover:text-primary transition-colors leading-relaxed">
                                                                {draft.title}
                                                            </p>
                                                            <div className="shrink-0 flex gap-2">
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                                                    <PenTool className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground/80 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {draft.time}</span>
                                                            <span className="opacity-50 text-[10px]">•</span>
                                                            <span className="bg-muted px-2 py-0.5 rounded-md text-xs">{draft.platform}</span>
                                                        </div>
                                                        <Badge
                                                            variant={draft.status === 'Scheduled' ? 'default' : (draft.status === 'Idea' ? 'outline' : 'secondary')}
                                                            className="text-[11px] px-3 py-1 rounded-full font-semibold shadow-none border-border/50"
                                                        >
                                                            {draft.status}
                                                        </Badge>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/50 rounded-[2rem] bg-background/20 backdrop-blur-sm mx-2">
                                            <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
                                                <PenTool className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No drafts found</h3>
                                            <p className="text-muted-foreground max-w-sm">
                                                You don&apos;t have any drafts for {tabPlatform === 'all' ? 'any platform' : tabPlatform} yet. Ready to start writing?
                                            </p>
                                            <Link href="/dashboard" className="mt-6">
                                                <Button variant="outline" className="rounded-full shadow-sm hover:bg-muted/50 border-border/50">
                                                    Start a new draft
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
