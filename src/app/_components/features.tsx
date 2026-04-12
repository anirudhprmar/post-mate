import React from 'react'

export default function Features() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-5xl max-w-md text-center">Features designed for your success.</h2>
                <p className='text-lg max-w-sm text-primary/40 text-center'>From content creation to scheduling, we've got you covered.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className='bg-secondary h-30 rounded-xl flex flex-col items-center justify-center'>
                    <p className='text-lg text-center'>curate ideas for your niche</p>
                </div>
                <div className='bg-secondary h-30 rounded-xl flex flex-col items-center justify-center'>
                    <p className='text-lg text-center'>post to multiple platforms with ease</p>
                </div>
                <div className='bg-secondary h-30 rounded-xl flex flex-col items-center justify-center'>
                    <p className='text-lg text-center'>schedule posts for later</p>
                </div>
                <div className='bg-secondary h-30 rounded-xl flex flex-col items-center justify-center'>
                    <p className='text-lg text-center'>easy content management across different platforms</p>
                </div>
                <div className='bg-secondary h-30 rounded-xl flex flex-col items-center justify-center'>
                    <p className='text-lg text-center' >never run out of ideas of what to post</p>
                </div>
            </div>
        </section>
    )
}
