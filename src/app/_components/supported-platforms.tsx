import { Ellipsis } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  XIcon,
  YouTubeIcon,
} from "~/lib/platform-icons";

export default function SupportedPlatforms() {
  return (
    <section className="mt-10 min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-6 py-30 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase">
            Supported Platforms
          </p>
          <h2 className="text-center text-3xl leading-relaxed font-normal tracking-normal sm:text-4xl md:text-5xl">
            All the platforms you can post to
          </h2>
          <p className="text-foreground/50 max-w-lg text-base sm:text-lg md:text-xl">
            No more jumping between apps.
          </p>
          <p className="text-foreground/50 max-w-lg text-base sm:text-lg md:text-xl">
            Create, customize, and schedule posts for all your platforms from
            one unified dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-10 sm:gap-8 md:gap-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-md border object-cover sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <XIcon />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-md border object-cover p-2 sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <InstagramIcon />
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-md border object-cover p-2 sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <FacebookIcon />
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-md border object-cover sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <ThreadsIcon />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-md border object-cover sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <LinkedInIcon />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-md border object-cover sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <YouTubeIcon />
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border sm:h-20 sm:w-20 md:h-[100px] md:w-[100px]">
            <p className="text-foreground/70 flex flex-col items-center justify-center gap-0.5 px-1 text-center text-[10px] font-semibold sm:gap-1 sm:text-xs md:text-sm">
              <span>
                <Ellipsis className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </span>
              more to come
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
