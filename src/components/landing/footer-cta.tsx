import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

export default function FooterCTA() {
  return (
    <section className="">
      <div className="px-4 py-12 sm:p-20">
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-serif text-2xl leading-relaxed font-normal tracking-normal sm:text-3xl md:text-5xl">
              Ready to take over social media.
            </p>
          </div>
          <Link href={"/pricing"}>
            <Button
              variant={"default"}
              size={"lg"}
              className="rounded-md px-8 py-3 text-sm font-medium shadow-sm transition-transform hover:-translate-y-0.5 sm:px-10 sm:py-6 sm:text-base"
            >
              Try for $0
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
