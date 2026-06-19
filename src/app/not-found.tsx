"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-primary-foreground flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="mb-8">
        <h1 className="text-foreground dark:text-secondary text-[180px] leading-none font-bold sm:text-[240px] lg:text-[300px]">
          404
        </h1>
      </div>

      <div className="bg-primary mb-8 max-w-2xl rounded-3xl px-8 py-12 text-center sm:px-12">
        {/* Heading */}
        <h2 className="mb-4 text-2xl font-normal text-white sm:text-3xl">
          Oops! Page not found
        </h2>

        {/* Button */}
        <Button className="group bg-foreground hover:bg-primary-foreground h-auto rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:text-black">
          <Link href="/" className="dark:text-primary flex items-center gap-2">
            GO BACK HOME
            <div className="bg-primary-foreground group-hover:bg-foreground dark:bg-secondary flex size-8 items-center justify-center rounded-full transition-all duration-300 group-hover:-rotate-45">
              <ArrowRight className="dark:text-primary-foreground size-4 text-black transition-colors duration-300 group-hover:text-white" />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
