import { AnimatedBeamMultipleOutputDemo } from "~/components/posting-beam";

export default function SupportedPlatforms() {
  return (
    <section className="mt-10 min-h-screen">
      <div className="mx-auto flex flex-col items-center justify-center gap-5 px-6 py-30 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-center text-3xl leading-relaxed font-normal tracking-tight sm:text-4xl md:text-5xl">
            All the platforms you can post to
          </h2>
        </div>
        <div className="h-full w-full">
          <AnimatedBeamMultipleOutputDemo />
        </div>
      </div>
    </section>
  );
}
