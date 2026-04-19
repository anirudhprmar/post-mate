import { Ellipsis } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function SupportedPlatforms() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center justify-center gap-5 mx-auto max-w-7xl px-6 py-30 lg:px-8">
                <div className="flex flex-col gap-4 text-center items-center justify-center">
                    <h1 className="text-5xl text-center">Supported Platforms</h1>
                    <p className="text-xl max-w-lg text-foreground/70">All the platforms you can post to from within Postmate.</p>
                </div>
                <div className='flex flex-wrap items-center justify-center gap-10 py-10'>
                    <Image
                        src={'/xlogo.jpg'}
                        width={100}
                        height={100}
                        alt='X logo'
                        className='rounded-full border'
                    />
                    <Image
                        src={'/insta.jpg'}
                        width={100}
                        height={100}
                        alt='X logo'
                        className='rounded-full border'
                    />
                    <Image
                        src={'/linkedin.png'}
                        width={100}
                        height={100}
                        alt='X logo'
                        className='rounded-full border '
                    />
                    <Image
                        src={'/threads.jpg'}
                        width={100}
                        height={100}
                        alt='X logo'
                        className='rounded-full border'
                    />
                    <Image
                        src={'/yt.webp'}
                        width={100}
                        height={100}
                        alt='X logo'
                        className='rounded-full border '
                    />
                    <div className='rounded-full border w-25 h-25 flex items-center justify-center'>
                        <p className='text-sm font-semibold text-center text-foreground/70 px-2 flex flex-col items-center justify-center gap-1'><span><Ellipsis /></span>more to come</p>
                    </div>
                </div>
            </div>
        </section>
    )
}