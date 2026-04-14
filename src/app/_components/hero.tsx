import React from 'react'
import { DashboardView } from './dashboard-view'
import { Button } from '~/components/ui/button'

export default function Hero() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex items-center justify-between mx-auto max-w-7xl px-6 py-30 lg:px-8">

                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl max-w-xl">Win the content game.</h1>
                    <p className="text-xl max-w-lg">PostSpark helps you build a consistent presence across all social media platforms without the daily grind.</p>
                    <Button size="lg" variant={'default'} className="bg-[#7f22fe] w-fit rounded-md">Join the waitlist</Button>
                </div>
                <DashboardView />
            </div>
        </section>)
}
