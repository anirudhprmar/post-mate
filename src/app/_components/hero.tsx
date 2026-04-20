"use client"
import React, { useState } from 'react'
// import { DashboardView } from './dashboard-view'
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

                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 text-center">
                    <span className='border border-border text-xs sm:text-sm w-fit max-w-[90%] rounded-full font-semibold tracking-normal py-1.5 px-4 sm:p-2 sm:px-4'>✨ No more cross platform struggle. Ideate smart. Post everywhere.</span>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl max-w-2xl flex flex-col items-center justify-center gap-1 mt-2 sm:mt-6 font-bold tracking-tight">Create Once. Tailor Accordingly. Post Everywhere.</h1>
                    <p className="text-sm sm:text-base md:text-xl max-w-lg text-foreground/70 px-4">Generate ideas, captions, and visuals that match the unique style and algorithm of each platform. Then schedule and publish to all your accounts from one place.</p>
                    <div className="w-full max-w-sm sm:max-w-fit px-4 sm:px-0">
                        <form
                            onSubmit={handleJoinWaitlist}
                            className="flex flex-col sm:flex-row w-full sm:w-fit items-center gap-2 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-lg shadow-primary/8 ring-1 ring-black/3 backdrop-blur mx-auto"
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 w-full sm:min-w-64 rounded-xl border-0 bg-muted/70 px-4 text-sm shadow-none focus-visible:ring-0"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status == "isPending"}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                variant="default"
                                className="h-12 w-full sm:w-auto rounded-xl border border-primary/20 bg-primary px-5 shadow-[0_14px_30px_-16px_rgba(109,40,217,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_38px_-18px_rgba(109,40,217,0.95)]"
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

                {/* <DashboardView /> */}
            </div>
        </section>)
}
