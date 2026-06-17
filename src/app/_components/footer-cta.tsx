import React from 'react'
import { Button } from '~/components/ui/button'

export default function FooterCTA() {
    return (
        <section className="">
            <div className='py-12 px-4 sm:p-20'>
                <div className="flex flex-col items-center justify-center gap-6 sm:gap-10">
                    <div className='flex flex-col items-center gap-2 text-center'>
                        <p className="text-2xl sm:text-3xl md:text-5xl font-normal tracking-normal font-serif leading-relaxed">Ready to take over social media.</p>

                    </div>
                    <Button variant={'default'} size={'lg'} className="rounded-md px-8 py-3 sm:px-10 sm:py-4 text-sm sm:text-base font-medium shadow-sm transition-transform hover:-translate-y-0.5">Try for $0</Button>
                </div>
            </div>
        </section>
    )
}