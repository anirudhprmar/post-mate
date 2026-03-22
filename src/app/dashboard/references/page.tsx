"use client";

import { useState } from "react";
import { UploadCloud, Link as LinkIcon, Sparkles, Image as ImageIcon, CheckCircle2, Copy, Save, LayoutGrid, Type, Video, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";

export default function ExperimentPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [contextInput, setContextInput] = useState("");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!urlInput && !uploadedImage) return;
        setIsGenerating(true);
        // Mock generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);
        }, 3000);
    };

    const handleSaveDraft = () => {
        // Mock toast or simple alert for now
        alert("Saved to Drafts!");
    };

    return (
        <div className="relative min-h-screen w-full">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-mesh animate-mesh opacity-40 dark:opacity-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative z-10">
                {/* Header Section */}
                <header className="flex flex-col gap-2 px-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90 leading-tight">
                        Transform Inspiration <br className="hidden sm:block" />into Magic ✨
                    </h1>
                    <p className="text-muted-foreground text-base max-w-xl mt-2 font-medium">
                        Paste a URL or drop an image. Our AI will analyze it and generate 5 fresh variations tailored for your audience.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Input Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-2xl overflow-hidden rounded-[2rem]">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                {/* Drag & Drop Zone */}
                                <div
                                    className="border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 bg-muted/10 cursor-pointer min-h-[240px] group"
                                    onClick={() => {
                                        // Mock image upload taking a generic aesthetic placeholder
                                        setUploadedImage("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop");
                                    }}
                                >
                                    {uploadedImage ? (
                                        <div className="relative w-full h-full rounded-2xl overflow-hidden aspect-video">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <p className="text-white font-medium text-sm flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                                                <UploadCloud className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-foreground/90">Drag & drop an image</h3>
                                                <p className="text-sm text-muted-foreground">or click to browse files (JPEG, PNG, WEBP)</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                                    <div className="h-px bg-border/60 flex-1"></div>
                                    <span className="font-medium uppercase tracking-wider text-xs">OR URL</span>
                                    <div className="h-px bg-border/60 flex-1"></div>
                                </div>

                                {/* URL Input */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Paste Instagram, X, or LinkedIn URL..."
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            className="pl-12 h-14 bg-background/50 border-border/50 focus-visible:ring-primary/30 rounded-2xl md:text-base"
                                        />
                                    </div>
                                </div>

                                {/* Context Area */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground/90 pl-1">Why did this resonate? <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                    <Textarea
                                        placeholder="e.g. I love the hook format, use a similar pacing..."
                                        value={contextInput}
                                        onChange={(e) => setContextInput(e.target.value)}
                                        className="min-h-[100px] bg-background/50 border-border/50 focus-visible:ring-primary/30 rounded-2xl resize-none"
                                    />
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={(!urlInput && !uploadedImage) || isGenerating}
                                    className="w-full h-14 rounded-2xl font-semibold text-base transition-all hover:scale-[1.02] shadow-xl hover:shadow-primary/25 gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing Inspiration...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 fill-current" />
                                            Generate Ideas ✨
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Inspirations Section */}
                        <div className="space-y-4 px-2 pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold tracking-tight">Recent Inspirations</h3>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-full h-8 px-4 font-medium">
                                    View all
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { title: "SaaS Design Trends", type: "Image", date: "2 days ago", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" },
                                    { title: "Minimalist Hook Flow", type: "LinkedIn URL", date: "4 days ago", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" },
                                    { title: "Visual Storytelling", type: "Instagram URL", date: "1 week ago", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" },
                                ].map((item, i) => (
                                    <Card key={i} className="group border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-primary/5 active:scale-95">
                                        <div className="flex items-center p-3 gap-4">
                                            <div className="h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-border/20">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="space-y-1 overflow-hidden">
                                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{item.title}</p>
                                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-primary/20 text-primary/70">{item.type}</Badge>
                                                    <span>•</span>
                                                    <span>{item.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {hasGenerated && (
                        <div className="lg:col-span-7 space-y-6 animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                    Your Variations <Badge variant="secondary" className="ml-2 font-mono">v1.0.mock</Badge>
                                </h3>
                                <Button onClick={handleSaveDraft} variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                                    <Save className="w-4 h-4" />
                                    Save all to Drafts
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                {/* Result Card 1: Hook */}
                                <Card className="border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all rounded-2xl group overflow-hidden">
                                    <div className="p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                                            <Type className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h4 className="font-semibold">The Controversial Hook</h4>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></Button>
                                            </div>
                                            <p className="text-foreground/80 leading-relaxed text-sm">
                                                Stop using generic aesthetics for your AI apps. 🛑<br /><br />
                                                If your dashboard looks like a spreadsheet from 2012, no one will use your "revolutionary" model.<br /><br />
                                                Here’s how to fix it in 3 simple steps 👇
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Result Card 2: Reel Script */}
                                <Card className="border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all rounded-2xl group overflow-hidden">
                                    <div className="p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h4 className="font-semibold">B-Roll Reel Script</h4>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></Button>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <p><strong className="text-primary/80">Visual:</strong> Panning shot over a beautifully designed Next.js dashboard.</p>
                                                <p><strong className="text-primary/80">Audio Text:</strong> "Me realizing good UI gets 10x more users than good code."</p>
                                                <p><strong className="text-primary/80">Caption:</strong> The hard truth about building in 2026. Design is not just how it looks, it's how it works. Save this for your next project build! 🚀</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Result Card 3: Carousel Ideas */}
                                <Card className="border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all rounded-2xl group overflow-hidden">
                                    <div className="p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                                            <LayoutGrid className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h4 className="font-semibold">Carousel Breakdown</h4>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></Button>
                                            </div>
                                            <ul className="text-sm space-y-1.5 text-foreground/80 list-disc list-inside">
                                                <li><strong className="text-foreground">Slide 1:</strong> The expectation (Boring standard UI)</li>
                                                <li><strong className="text-foreground">Slide 2:</strong> The reality (Interactive mesh backgrounds)</li>
                                                <li><strong className="text-foreground">Slide 3:</strong> Why micro-animations matter</li>
                                                <li><strong className="text-foreground">Slide 4:</strong> Top 3 UI libraries I use daily</li>
                                                <li><strong className="text-foreground">Slide 5:</strong> CTA: Share if you love good design</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Card>

                                {/* Result Card 4: Story Idea */}
                                <Card className="border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all rounded-2xl group overflow-hidden">
                                    <div className="p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h4 className="font-semibold">Instagram Story Poll</h4>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></Button>
                                            </div>
                                            <p className="text-foreground/80 text-sm">
                                                Share behind-the-scenes of building this feature.<br /><br />
                                                <strong>Poll Question:</strong> What’s harder: The logic or the UI?<br />
                                                <strong>Options:</strong> ✨ Making it look good | 🧠 Making it work
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Result Card 5: Value-Driven Caption */}
                                <Card className="border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 transition-all rounded-2xl group overflow-hidden">
                                    <div className="p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h4 className="font-semibold">Value-Driven Caption</h4>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></Button>
                                            </div>
                                            <p className="text-foreground/80 text-sm leading-relaxed">
                                                Building a SaaS in 2026 requires more than just code. It requires an obsession with user experience. <br /><br />
                                                We’ve spent the last 3 months refining every single transition, every mesh gradient, and every button click to ensure that PostSpark isn't just a tool, but an experience.<br /><br />
                                                What are you building today? Let me know below! 👇
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
