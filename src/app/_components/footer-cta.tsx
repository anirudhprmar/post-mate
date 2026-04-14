import React from 'react'

export default function FooterCTA() {
    return (
        <section className="">
            <div className='p-20 bg-primary text-primary-foreground rounded-lg'>
                <div className="flex flex-col items-center justify-center gap-10">
                    <div className='flex flex-col items-center gap-2'>
                        <h6 className="text-4xl font-bold">Ready to upgrade your content workflow?</h6>
                        <p className="text-lg">Join hundreds of founders and creators who use PostSpark to save hours of their time for content.</p>

                    </div>
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">Get Started</button>
                </div>
            </div>
        </section>
    )
}