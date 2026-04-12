import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'

export default function Navbar() {
    return (
        <header className='fixed z-50 top-6 right-0 left-0 w-full'>

            <nav className=' rounded-md p-2 px-6 bg-transparent/30 backdrop-blur-lg mx-auto w-fit max-w-[95%] bg-opa'>

                <div className='flex items-center justify-center gap-8'>
                    <p className='font-bold text-2xl'>post spark</p>

                    <div className='flex items-center gap-5'>
                        <ul className='flex gap-4'>
                            <li className='text-lg'>Pricing</li>
                            <li className='text-lg'>Demo</li>
                            <li className='text-lg'>Blog</li>
                        </ul>
                        <Button
                            variant="outline"
                            size="lg"
                            className='rounded-md'
                        >
                            <Link href="https://postspark-waitlist.vercel.app">
                                Join the waitlist
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    )
}