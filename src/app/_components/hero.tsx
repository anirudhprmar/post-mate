import React from 'react'
import { DashboardView } from './dashboard-view'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ArrowUpRight } from 'lucide-react'

export default function Hero() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex items-center justify-between mx-auto max-w-7xl px-6 py-30 lg:px-8">

                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl max-w-xl">Win the content game.</h1>
                    <p className="text-xl max-w-lg">post mate helps you build a consistent presence across all social media platforms without the daily grind.</p>
                    <div>
                        <form
                            className="flex w-fit items-center gap-2 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-lg shadow-primary/8 ring-1 ring-black/3 backdrop-blur"
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 min-w-64 rounded-xl border-0 bg-muted/70 px-4 text-sm shadow-none focus-visible:ring-0"
                            />

                            <Button
                                type="submit"
                                size="lg"
                                variant="default"
                                className="h-12 rounded-xl border border-primary/20 bg-primary px-5 text-sm font-semibold tracking-[0.01em] text-primary-foreground shadow-[0_14px_30px_-16px_rgba(109,40,217,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_38px_-18px_rgba(109,40,217,0.95)]"
                            >
                                Join waitlist
                                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                            </Button>
                        </form>
                    </div>
                </div>
                <DashboardView />
            </div>
        </section>)
}
