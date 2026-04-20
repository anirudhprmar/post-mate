import React from 'react'

export default function FooterCTA() {
    return (
        <section className="">
            <div className='py-12 px-4 sm:p-20'>
                <div className="flex flex-col items-center justify-center gap-6 sm:gap-10">
                    <div className='flex flex-col items-center gap-2 text-center'>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Ready to upgrade your content workflow?</h2>
                        <p className="text-base sm:text-lg text-muted-foreground">Join Postmate and save hours of your time for content.</p>

                    </div>
                    <button className="bg-primary text-primary-foreground px-6 py-3 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-medium shadow-sm transition-transform hover:-translate-y-0.5">Get Started</button>
                </div>
            </div>
        </section>
    )
}