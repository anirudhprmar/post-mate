"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, LayoutGrid, CalendarClock, Layers, Lightbulb } from 'lucide-react'

const featureList = [
    {
        icon: Lightbulb,
        title: 'Curate ideas for your niche',
        description: 'AI-powered content ideas tailored to your audience and niche — never stare at a blank screen again.',
        action: 'ai.mp4',
        altTag: ''
    },
    {
        icon: Layers,
        title: 'Post to multiple platforms & Schedule posts',
        description: 'Publish to Instagram, X, LinkedIn, and more with a single click. Reach everywhere effortlessly.',
        action: '/scheduling.mp4',
        altTag: ''
    },
    // {
    //     icon: CalendarClock,
    //     title: 'Schedule posts for later',
    //     description: 'Queue up content for peak engagement times. Your audience will always see you at the right moment.',
    //     action: '',
    //     altTag: ''
    // },
    {
        icon: LayoutGrid,
        title: 'Unified content management',
        description: 'One dashboard to manage all your platforms. Track performance, edit drafts, and stay organised.',
        action: 'manage.mp4',
        altTag: ''
    },
    {
        icon: Sparkles,
        title: 'Never run out of ideas',
        description: 'A continuous stream of fresh, relevant post ideas keeps your content calendar full every week.',
        action: '/inspire.mp4',
        altTag: ''
    },
]

export default function Features() {
    const [current, setCurrent] = useState(0)

    return (
        <section className="mt-10 min-h-screen">
            {/* Section header */}
            <div className="flex flex-col items-center space-y-4 text-center px-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">What you get</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl max-w-lg font-normal tracking-normal leading-relaxed">Features designed for your success.</h2>
                <p className="text-base sm:text-lg max-w-sm text-foreground/50 ">
                    From content creation to scheduling, we've got you covered.
                </p>
            </div>

            {/* Feature grid */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mx-auto max-w-7xl px-6 py-14 lg:px-8 items-start">

                {/* Left: feature list */}
                <div className="flex flex-col gap-2 w-full lg:w-1/2 lg:max-w-lg order-2 lg:order-1">
                    {featureList.map((feature, index) => {
                        const Icon = feature.icon
                        const isActive = current === index

                        return (
                            <motion.button
                                key={index}
                                onClick={() => setCurrent(index)}
                                whileTap={{ scale: 0.985 }}
                                className="relative w-full text-left rounded-xl px-5 py-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors duration-200"
                            >
                                {/* Active background pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-feature-bg"
                                        className="absolute inset-0 rounded-xl bg-card border border-primary/20 shadow-sm"
                                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                    />
                                )}

                                <div className="relative flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`mt-0.5 shrink-0 rounded-lg p-2 transition-colors duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Icon className="size-4" />
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <p className={`text-base font-semibold leading-snug transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-foreground/60'}`}>
                                            {feature.title}
                                        </p>
                                        <AnimatePresence initial={false}>
                                            {isActive && (
                                                <motion.p
                                                    key="desc"
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                                    className="text-sm text-muted-foreground overflow-hidden"
                                                >
                                                    {feature.description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Right: video player */}
                <div className="rounded-xl overflow-hidden border border-border shadow-md h-fit flex items-center justify-center bg-muted/30 w-full lg:w-1/2 lg:sticky lg:top-32 order-1 lg:order-2">
                    {(featureList[current]?.action || featureList[current]?.action) ? (
                        <video src={featureList[current]?.action as string} autoPlay muted loop playsInline className="w-full h-auto object-cover" />
                    ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                            <Sparkles className="size-8 opacity-50" />
                            <p className="text-sm">No video available</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
