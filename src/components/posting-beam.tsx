"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "~/lib/utils";
import { AnimatedBeam } from "./ui/animated-beam";
import { User } from "lucide-react";
import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  XIcon,
  YouTubeIcon,
} from "~/lib/platform-icons";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);

  const PLATFORMS = [
    { icon: XIcon, name: "X", divRef: div1Ref },
    {
      icon: InstagramIcon,
      name: "Instagram",
      className: "p-2",
      divRef: div2Ref,
    },
    { icon: FacebookIcon, name: "Facebook", className: "p-2", divRef: div3Ref },
    { icon: ThreadsIcon, name: "Threads", divRef: div4Ref },
    { icon: LinkedInIcon, name: "LinkedIn", divRef: div5Ref },
    { icon: YouTubeIcon, name: "YouTube", divRef: div8Ref },
  ];

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className="size-15">
            <User />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-20">
            <Image
              src={
                "https://c4qrl532oo.ufs.sh/f/s0GPcE56MbtBl3FSS0sBQjgrwMc5HoZpy3dEeLPF9kvxOnV6"
              }
              alt="postmate"
              width={100}
              height={100}
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <Circle
                ref={platform.divRef}
                key={platform.name}
                className="size-15"
              >
                <Icon size={40} />
              </Circle>
            );
          })}
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div6Ref}
        duration={2}
      />
    </div>
  );
}
