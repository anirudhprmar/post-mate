"use client";
import { Button } from "~/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 space-y-4 px-6 py-20 lg:px-8">
        <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden text-center sm:gap-6">
          <p className="z-50 mt-2 flex max-w-xs flex-col items-center justify-center gap-1 text-2xl leading-normal font-normal tracking-tight sm:mt-6 sm:text-2xl md:text-2xl">
            One place to manage all your socials
          </p>
          <h1 className="z-50 max-w-xl px-4 text-sm leading-tight font-bold sm:text-8xl md:text-8xl">
            Post Once. Everywhere.
          </h1>
        </div>

        <div className="w-full max-w-sm px-4 sm:max-w-fit sm:px-0">
          <Button
            size="lg"
            variant="default"
            className="border-primary/20 bg-primary shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30 h-12 w-full rounded-full border px-5 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            <Link href={"/login"}>
              <div className="flex items-center gap-2">
                <p className="text-primary-foreground text-sm font-semibold tracking-[0.01em]">
                  login to your dashboard
                </p>
                <ArrowUpRight className="text-primary-foreground size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
