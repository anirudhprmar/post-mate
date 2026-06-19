"use client";
import { DashboardView } from "./dashboard-view";
import { Button } from "~/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { OrbitingCircles } from "~/components/ui/orbiting-circles";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  XIcon,
  YouTubeIcon,
} from "~/lib/platform-icons";

export default function Hero() {
  return (
    <section className="mt-10 min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-20 lg:px-8">
        <div className="relative flex w-full flex-col items-center justify-center gap-4 space-y-4 overflow-hidden text-center sm:gap-6">
          <h1 className="z-50 mt-2 flex max-w-3xl flex-col items-center justify-center gap-1 text-3xl leading-normal font-normal tracking-wide sm:mt-6 sm:text-6xl md:text-6xl">
            One platform to grow on every social media.
          </h1>
          <p className="z-50 max-w-md px-4 text-sm font-medium sm:text-base md:text-lg">
            Generate ideas, captions, and visuals that match the unique style
            and algorithm of each platform.
          </p>
          <p className="z-50 max-w-md px-4 text-sm font-medium sm:text-base md:text-lg">
            Then schedule and publish to all your accounts from one place.
          </p>
          <OrbitingCircles
            radius={300}
            speed={1}
            path={false}
            iconSize={60}
            reverse
          >
            <FacebookIcon />
            <YouTubeIcon />
            <InstagramIcon />
            <LinkedInIcon />
            <ThreadsIcon />
            <XIcon />
          </OrbitingCircles>
        </div>

        {/* <OrbitingPlatforms/> */}
        <div className="w-full max-w-sm px-4 sm:max-w-fit sm:px-0">
          <Button
            size="lg"
            variant="default"
            className="border-primary/20 bg-primary shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30 h-12 w-full rounded-md border px-5 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <p className="text-primary-foreground text-sm font-semibold tracking-[0.01em]">
                try for $0
              </p>
              <ArrowUpRight className="text-primary-foreground size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </div>
          </Button>
        </div>

        <DashboardView />
      </div>
    </section>
  );
}
