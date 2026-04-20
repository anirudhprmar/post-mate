"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-primary-foreground px-4 py-16">

            <div className="mb-8">
                <h1 className="text-[180px] font-bold leading-none text-foreground sm:text-[240px] lg:text-[300px] dark:text-secondary">
                    404
                </h1>
            </div>

            <div className="mb-8 max-w-2xl rounded-3xl bg-primary px-8 py-12 text-center sm:px-12">
                {/* Heading */}
                <h2 className="mb-4 text-2xl font-normal text-white sm:text-3xl">
                    Oops! Page not found
                </h2>

                {/* Button */}
                <Button
                    className="group h-auto rounded-full bg-foreground px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-primary-foreground hover:text-black"
                >
                    <Link href="/" className="flex items-center gap-2 dark:text-primary">
                        GO BACK HOME
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground transition-all duration-300 group-hover:-rotate-45 group-hover:bg-foreground dark:bg-secondary">
                            <ArrowRight className="size-4 text-black transition-colors duration-300 group-hover:text-white dark:text-primary-foreground" />
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    )
}
