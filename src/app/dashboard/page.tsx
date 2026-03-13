import { ArrowUp, Calendar, Clock, Image as ImageIcon, Link2, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Section */}
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ready to spark some ideas? ✨</h1>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    Create, schedule, and manage your content across all platforms from one place.
                </p>
            </header>

            {/* Main Composer Area */}
            <Card className="w-full border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md focus-within:shadow-md focus-within:border-primary/30">
                <CardContent className="p-0">
                    <Textarea
                        placeholder="What's on your mind today?"
                        className="w-full min-h-[160px] text-lg resize-none border-0 focus-visible:ring-0 p-6 bg-transparent"
                    />
                </CardContent>
                <CardFooter className="bg-muted/30 border-t border-border/40 p-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Media Actions */}
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary hover:bg-primary/10 transition-colors">
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary hover:bg-primary/10 transition-colors">
                            <Link2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary hover:bg-primary/10 transition-colors hidden sm:flex">
                            <Sparkles className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full sm:w-[130px] h-9 bg-background">
                                <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Platforms</SelectItem>
                                    <SelectItem value="x">X (Twitter)</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="threads">Threads</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button className="h-9 px-4 sm:px-6 gap-2 rounded-full font-medium transition-transform active:scale-95 shadow-sm">
                            Post Now <ArrowUp className="h-4 w-4 hidden sm:block" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Dashboard Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

                {/* Recent Drafts Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight">Recent Drafts</h2>
                        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs hover:text-foreground">
                            View All
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {[
                            { title: "5 Tips for better React Performance", platform: "LinkedIn", time: "2 hours ago", status: "Draft" },
                            { title: "Just launched our new feature! 🚀", platform: "X", time: "5 hours ago", status: "Scheduled" },
                            { title: "A deep dive into Next.js 14 server actions", platform: "Threads", time: "Yesterday", status: "Draft" },
                        ].map((draft, i) => (
                            <Card key={i} className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer border-border/40 group">
                                <div className="space-y-1 overflow-hidden pr-4 text-left">
                                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{draft.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {draft.time}</span>
                                        <span>•</span>
                                        <span>{draft.platform}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                                    <Badge variant={draft.status === 'Scheduled' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                                        {draft.status}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Quick Stats / Side Widget */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        <Card className="p-4 border-border/40 bg-card/40 flex items-center gap-4 hover:shadow-sm transition-shadow">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                        </Card>
                        <Card className="p-4 border-border/40 bg-card/40 flex items-center gap-4 hover:shadow-sm transition-shadow">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-muted-foreground">Ideas Generated</p>
                                <p className="text-2xl font-bold">48</p>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    )
}