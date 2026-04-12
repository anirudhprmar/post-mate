"use client"
import { VideoPlayer } from '~/components/video-player';
import React from 'react'

export default function Why() {

    return (
        <section className='mt-10 min-h-screen'>
            <div className='flex flex-col gap-4 items-center '>
                <h3 className='text-5xl max-w-md'>Don’t take our word for it, hear it from people in the game.</h3>

                <p className='text-lg max-w-sm text-primary/40 text-center'>This is where post spark comes in to bridge the gap from content creation to scheduling.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-7xl px-6 py-10 lg:px-8'>
                <VideoPlayer src="garyvee.mp4" />
                <VideoPlayer src='volume.mp4' />
                <VideoPlayer src='mastery.mp4' />
            </div>
        </section>
    )
}
