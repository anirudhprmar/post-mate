import { Ellipsis } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function SupportedPlatforms() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center justify-center gap-5 mx-auto max-w-7xl px-6 py-30 lg:px-8">
                <div className="flex flex-col gap-4 text-center items-center justify-center px-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">Supported Platforms</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold tracking-tight">All the platforms you can post to</h2>
                    <p className="text-base sm:text-lg md:text-xl max-w-lg text-foreground/70">No more jumping between apps. Create, customize, and schedule posts for all your platforms—from one unified dashboard.</p>
                </div>
                <div className='flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 py-10 px-4'>
                    <Image
                        src={'/xlogo.jpg'}
                        width={100}
                        height={100}
                        alt='X logo'
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] rounded-full border object-cover'
                    />
                    <Image
                        src={'/insta.jpg'}
                        width={100}
                        height={100}
                        alt='Instagram logo'
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] rounded-full border object-cover'
                    />
                    <Image
                        src={'/linkedin.png'}
                        width={100}
                        height={100}
                        alt='LinkedIn logo'
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] rounded-full border object-cover'
                    />
                    <Image
                        src={'/threads.jpg'}
                        width={100}
                        height={100}
                        alt='Threads logo'
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] rounded-full border object-cover'
                    />
                    <Image
                        src={'/yt.webp'}
                        width={100}
                        height={100}
                        alt='YouTube logo'
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] rounded-full border object-cover'
                    />
                    <div className='rounded-full border w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] flex items-center justify-center shrink-0'>
                        <p className='text-[10px] sm:text-xs md:text-sm font-semibold text-center text-foreground/70 px-1 flex flex-col items-center justify-center gap-0.5 sm:gap-1'><span><Ellipsis className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /></span>more</p>
                    </div>
                </div>
            </div>
        </section>
    )
}