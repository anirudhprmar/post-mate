"use client"
import { DashboardView } from './dashboard-view'
import { Button } from '~/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import { OrbitingCircles } from '~/components/ui/orbiting-circles'
import { FacebookIcon, InstagramIcon, LinkedInIcon, ThreadsIcon, XIcon, YouTubeIcon } from '~/lib/platform-icons'

export default function Hero() {

    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center mx-auto max-w-7xl px-6 py-20 lg:px-8 gap-10">
                
                
                <div className="relative w-full overflow-hidden flex flex-col items-center justify-center gap-4 sm:gap-6 text-center space-y-4 ">
                    <h1 className="text-3xl sm:text-6xl md:text-6xl max-w-3xl flex flex-col items-center justify-center gap-1 mt-2 sm:mt-6 font-normal tracking-wide leading-normal z-50">One platform to grow on every social media.</h1>
                    <p className="font-medium text-sm sm:text-base md:text-lg max-w-md px-4 z-50">Generate ideas, captions, and visuals that match the unique style and algorithm of each platform. 
                    </p>
                    <p className='font-medium text-sm sm:text-base md:text-lg max-w-md px-4 z-50'>Then schedule and publish to all your accounts from one place.</p>
                    <OrbitingCircles radius={300} speed={1} path={false} iconSize={60} reverse>
                            <FacebookIcon/>
                            <YouTubeIcon/>
                            <InstagramIcon/>
                            <LinkedInIcon />
                            <ThreadsIcon />
                            <XIcon/>
                      </OrbitingCircles>
                </div>
                
                {/* <OrbitingPlatforms/> */}
                <div className="w-full max-w-sm sm:max-w-fit px-4 sm:px-0">
                    <Button
                        size="lg"
                        variant="default"
                        className="h-12 w-full sm:w-auto rounded-md border border-primary/20 bg-primary px-5 shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
                    >
                        <div className='flex items-center gap-2'>
                            <p className='text-primary-foreground text-sm font-semibold tracking-[0.01em]'>try for $0</p>
                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 text-primary-foreground" />
                        </div>
                    </Button>
                </div>

                <DashboardView />
            </div>
        </section>)
}