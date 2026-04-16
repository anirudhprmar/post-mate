import { Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'

const navLinks = [
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
    { label: 'Blog', href: '#blog' },
]

export default function Navbar() {
    return (
        <header className="fixed z-50 top-6 right-0 left-0 w-full px-4">
            <nav className="mx-auto w-full max-w-[70%] rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-xs px-5 py-2.5">
                <div className="flex items-center justify-between gap-6">

                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-foreground text-background rounded-md flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4" fill="currentColor" />
                        </div>
                        <span className="font-bold text-base tracking-tight">post mate</span>
                    </Link>

                    {/* Nav links */}
                    <ul className="flex items-center gap-6">
                        {navLinks.map(({ label, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button asChild variant="default" size="sm" className="rounded-md">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="rounded-md">
                            <Link href="https://post mate-waitlist.vercel.app" target="_blank" rel="noopener noreferrer">
                                Join the waitlist
                            </Link>
                        </Button>
                    </div>

                </div>
            </nav>
        </header>
    )
}
