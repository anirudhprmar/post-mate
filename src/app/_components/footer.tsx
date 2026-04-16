import Link from 'next/link'
import { Zap, Twitter, Instagram, Linkedin, Github } from 'lucide-react'

const footerLinks = {
    Product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Demo', href: '#demo' },
    ],
    Resources: [
        { label: 'Blog', href: '#blog' },
    ]
}

const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter / X' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
]

const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookies Settings', href: '#cookies' },
]

export default function Footer() {
    return (
        <footer className="mt-10 pb-8">
            {/* Main card */}
            <div className="bg-card border border-border rounded-2xl p-10">
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                    {/* Brand block */}
                    <div className="flex flex-col gap-5 max-w-xs">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-foreground text-background rounded-md flex items-center justify-center shrink-0">
                                <Zap className="w-4 h-4" fill="currentColor" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">post mate</span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            post mate empowers founders and creators to transform ideas into
                            compelling social media content &mdash; saving hours with
                            AI-powered workflows.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/70 transition-colors hover:text-foreground"
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Nav link columns */}
                    <div className="flex flex-wrap gap-10 sm:gap-16">
                        {Object.entries(footerLinks).map(([category, links]) => (
                            <div key={category} className="flex flex-col gap-3 min-w-[80px]">
                                <h4 className="text-sm font-semibold text-foreground">
                                    {category}
                                </h4>
                                <ul className="flex flex-col gap-2">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
                <p className="text-sm text-muted-foreground">
                    &copy; 2026 post mate. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    {legalLinks.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}
