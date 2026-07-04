import { AnimatedBeamMultipleOutputDemo } from "~/components/posting-beam";

export default function SupportedPlatforms() {
  return (
    <section className="mt-10 min-h-screen">
      <div className="mx-auto flex flex-col items-center justify-center gap-5 px-6 py-30 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase">
            Supported Platforms
          </p>
          <h2 className="text-center text-3xl leading-relaxed font-normal tracking-normal sm:text-4xl md:text-5xl">
            All the platforms you can post to
          </h2>
          <p className="text-foreground/50 max-w-lg text-base sm:text-lg md:text-xl">
            Create, customize, and schedule posts for all your platforms from
            one unified dashboard.
          </p>
        </div>
        <div className="h-full w-full">
          <AnimatedBeamMultipleOutputDemo />
        </div>
      </div>
    </section>
  );
}
