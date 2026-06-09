"use client"
// import { DashboardView } from './dashboard-view'
import { Button } from '~/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {

    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center mx-auto max-w-7xl px-6 py-20 lg:px-8 gap-10">

                {/* <div className="flex items-center gap-2 rounded-full px-3 py-1.5">
                    <Image src={'/xlogo.jpg'} width={24} height={24} alt='X' className='w-10 h-10 rounded-md object-cover' />
                    <Image src={'/insta.jpg'} width={24} height={24} alt='Instagram' className='w-10 h-10 rounded-md object-cover' />
                    <Image src={'/linkedin.png'} width={24} height={24} alt='LinkedIn' className='w-10 h-10 rounded-md object-cover' />
                    <Image src={'/threads.jpg'} width={24} height={24} alt='Threads' className='w-10 h-10 rounded-md object-cover' />
                    <Image src={'/yt.webp'} width={24} height={24} alt='YouTube' className='w-10 h-10 rounded-md object-cover' />
                </div> */}

                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl max-w-3xl flex flex-col items-center justify-center gap-1 mt-2 sm:mt-6 font-medium tracking-wider">Create Once. Tailor Accordingly. Post Everywhere.</h1>
                    <p className="font-medium text-sm sm:text-base md:text-xl max-w-lg px-4">Generate ideas, captions, and visuals that match the unique style and algorithm of each platform. 
                    </p>
                    <p className='font-medium text-sm sm:text-base md:text-xl max-w-lg px-4'>Then schedule and publish to all your accounts from one place.</p>
                </div>

                <div className="w-full max-w-sm sm:max-w-fit px-4 sm:px-0">
                    <Button
                        size="lg"
                        variant="default"
                        className="h-12 w-full sm:w-auto rounded-xl border border-primary/20 bg-primary px-5 shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
                    >
                        <div className='flex items-center gap-2'>
                            <p className='text-primary-foreground text-sm font-semibold tracking-[0.01em]'>try for $0</p>
                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 text-primary-foreground" />
                        </div>
                    </Button>
                </div>

                {/* <DashboardView /> */}
            </div>
        </section>)
}
