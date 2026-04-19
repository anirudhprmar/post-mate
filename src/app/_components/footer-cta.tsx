import React from 'react'

export default function FooterCTA() {
    return (
        <section className="">
            <div className='p-20'>
                <div className="flex flex-col items-center justify-center gap-10">
                    <div className='flex flex-col items-center gap-2'>
                        <h6 className="text-4xl font-semibold">Ready to upgrade your content workflow?</h6>
                        <p className="text-lg text-muted-foreground">Join hundreds of founders and creators who use post mate to save hours of their time for content.</p>

                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Get Started</button>
                </div>
            </div>
        </section>
    )
}