import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'

const navLinks = [
    { label: 'Demo', href: '#demo' },
    { label: 'Blog', href: '#blog' },
    { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
    return (
        <header className="fixed z-50 top-6 right-0 left-0 w-full px-4">
            <nav className="mx-auto w-full px-5 py-2.5">
                <div className="flex items-center justify-between gap-6">

                    <div className='flex items-center gap-2.5 shrink-0'>

                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <span className="font-bold text-2xl tracking-tight">post mate</span>
                    </Link>

                    {/* Nav links */}
                    <ul className="group/nav flex items-center justify-center gap-6 px-4 py-1 rounded-md border border-border bg-muted/70 backdrop-blur-xs">
                        {navLinks.map(({ label, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className="text-sm font-normal text-foreground transition-colors group-hover/nav:text-muted-foreground hover:text-foreground"
                                    >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                        </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button asChild variant="default" size="lg" className="rounded-md">
                            <Link href="/login" >Login</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-md">
                            <Link href="#waitlist" className="">
                                Join the waitlist
                            </Link>
                        </Button>
                    </div>

                </div>
            </nav>
        </header>
    )
}
