"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  LayoutGrid,
  CalendarClock,
  Layers,
  Lightbulb,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

const featureList = [
  {
    icon: Layers,
    title: "Post to multiple platforms",
    description:
      "Publish to Instagram, X, LinkedIn, and more with a single click. Reach everywhere effortlessly.",
    action: "/manage.png",
    altTag: "connections page of postmate",
  },
  {
    icon: CalendarClock,
    title: "Schedule posts for later",
    description:
      "Queue up content for peak engagement times. Your audience will always see you at the right moment.",
    action: "/schedule.png",
    altTag: "scheduler page of postmate",
  },
  {
    icon: LayoutGrid,
    title: "Preview posts across platforms",
    description:
      "See how your posts look on different platforms before you schedule.",
    action: "/preview.png",
    altTag: "previewing post across platforms",
  },
  {
    icon: LayoutGrid,
    title: "Works on Mobile",
    description:
      "Use it on the go. Switch between mobile and desktop with ease. However you like it.",
    action: "/mobilee.png",
    altTag: "mobile view of postmate",
  },
];

export default function Features() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="mt-10 min-h-screen">
      {/* Section header */}
      <div className="flex flex-col items-center space-y-4 px-6 text-center">
        <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase">
          What you get
        </p>
        <h2 className="max-w-lg text-3xl leading-relaxed font-normal tracking-normal sm:text-4xl md:text-5xl">
          Features designed for your success.
        </h2>
      </div>

      {/* Feature grid */}
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-14 lg:flex-row lg:gap-16 lg:px-8">
        {/* Left: feature list */}
        <div className="order-2 flex w-full flex-col gap-2 lg:order-1 lg:w-1/2 lg:max-w-lg">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = current === index;

            return (
              <motion.button
                key={index}
                onClick={() => setCurrent(index)}
                whileTap={{ scale: 0.985 }}
                className="focus-visible:ring-primary/50 relative w-full cursor-pointer rounded-xl px-5 py-4 text-left transition-colors duration-200 outline-none focus-visible:ring-2"
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-feature-bg"
                    className="bg-card border-primary/20 absolute inset-0 rounded-xl border shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`mt-0.5 shrink-0 rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  {/* Text */}
                  <div>
                    <p
                      className={`text-base leading-snug font-semibold transition-colors duration-200 ${isActive ? "text-foreground" : "text-foreground/60"}`}
                    >
                      {feature.title}
                    </p>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          key="desc"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="text-muted-foreground overflow-hidden text-sm"
                        >
                          {feature.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right: video player */}
        <div className="border-border bg-muted/30 order-1 mx-auto flex h-fit w-fit items-center justify-center overflow-hidden rounded-none border shadow-md lg:sticky lg:top-32 lg:order-2 lg:w-fit">
          {featureList[current]?.action || featureList[current]?.action ? (
            <Image
              src={featureList[current]?.action as string}
              className="h-auto w-full"
              alt={featureList[current]?.altTag}
              width={
                featureList[current]?.title.includes("mobile") ? 400 : 1000
              }
              height={
                featureList[current]?.title.includes("mobile") ? 400 : 1000
              }
              priority
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <Sparkles className="size-8 opacity-50" />
              <p className="text-sm">No video available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
