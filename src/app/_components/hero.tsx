"use client"
import React, { useState } from 'react'
import { DashboardView } from './dashboard-view'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { useMutation as useConvexMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { toast } from 'sonner'

export default function Hero() {
    const joinWaitlist = useConvexMutation(api.waitlist.join);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "isPending" | "isSuccess">("idle");

    const handleJoinWaitlist = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please fill in all fields.");
            return;
        };

        setStatus("isPending");
        try {
            await joinWaitlist({ email });
            setStatus("isSuccess");
            toast.success("Joined waitlist successfully!");
            setEmail("");
        } catch (error) {
            console.error("Error joining waitlist:", error);
            setStatus("idle");
        }
    };

    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center gap-10 justify-between mx-auto max-w-7xl px-6 py-30 lg:px-8">

                <div className="flex flex-col items-center justify-center gap-4 text-center relative">
                    <h1 className="text-6xl max-w-2xl flex flex-col items-center justify-center gap-1"><span className='border border-border text-sm w-fit rounded-full font-semibold tracking-normal p-2 absolute -top-18 '>✨ All in one content ideation & scheduling platform</span>Grow on all social media platforms.</h1>
                    <p className="text-xl max-w-xl text-foreground/70">Never run out of ideas to post and get your content posted to all your social media accounts from one single place.</p>
                    <div>
                        <form
                            onSubmit={handleJoinWaitlist}
                            className="flex w-fit items-center gap-2 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-lg shadow-primary/8 ring-1 ring-black/3 backdrop-blur"
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 min-w-64 rounded-xl border-0 bg-muted/70 px-4 text-sm shadow-none focus-visible:ring-0"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status == "isPending"}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                variant="default"
                                className="h-12 rounded-xl border border-primary/20 bg-primary px-5 shadow-[0_14px_30px_-16px_rgba(109,40,217,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_38px_-18px_rgba(109,40,217,0.95)]"
                            >
                                {status == "isPending" ? (
                                    <Loader2 className="size-5 animate-spin text-primary-foreground" />
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <p className='text-primary-foreground text-sm font-semibold tracking-[0.01em]'>Join Waitlist</p>
                                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 text-primary-foreground" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <DashboardView />
            </div>
        </section>)
}
