import { Layers, CalendarClock, LayoutGrid, Smartphone } from "lucide-react";
import Image from "next/image";

const featureList = [
  {
    icon: Layers,
    title: "Post to multiple platforms",
    description:
      "Publish to Instagram, X, LinkedIn, and more with a single click. Reach everywhere effortlessly.",
    video: undefined as string | undefined,
    action: "/manage.png",
    altTag: "connections page of postmate",
    width: 1915,
    height: 1074,
  },
  {
    icon: CalendarClock,
    title: "Schedule posts for later",
    description:
      "Queue up content for peak engagement times. Your audience will always see you at the right moment.",
    video: undefined as string | undefined,
    action: "/schedule.png",
    altTag: "scheduler page of postmate",
    width: 1917,
    height: 1078,
  },
  {
    icon: LayoutGrid,
    title: "Preview posts across platforms",
    description:
      "See how your posts look on different platforms before you schedule.",
    video: undefined as string | undefined,
    action: "/preview.png",
    altTag: "previewing post across platforms",
    width: 1918,
    height: 1069,
  },
  {
    icon: Smartphone,
    title: "Works on mobile",
    description:
      "Use it on the go. Switch between mobile and desktop with ease. However you like it.",
    video: undefined as string | undefined,
    action: "/mobilee.png",
    altTag: "mobile view of postmate",
    width: 1080,
    height: 1080,
  },
];

export default function Features() {
  return (
    <section id="features" className="mt-10 scroll-mt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 lg:px-8">
        {featureList.map((feature) => {
          const Icon = feature.icon;
          const isPortrait = feature.height > feature.width;

          return (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-5 py-14 text-center sm:gap-6 sm:py-16"
            >
              {/* Title */}
              <div className="flex items-center justify-center gap-3">
                <div className="bg-primary/10 text-primary shrink-0 rounded-lg p-2">
                  <Icon className="size-4" />
                </div>
                <h3 className="text-foreground text-lg leading-snug font-semibold tracking-tight sm:text-xl">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-balance">
                {feature.description}
              </p>

              {/* Media */}
              <div
                className={`border-border bg-muted/30 mt-2 w-full overflow-hidden rounded-xl border shadow-sm ${isPortrait ? "max-w-[22rem]" : "max-w-xl"}`}
              >
                {feature.video ? (
                  <video
                    className="h-auto w-full"
                    src={feature.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={feature.action}
                    alt={feature.altTag}
                    width={feature.width}
                    height={feature.height}
                    className="h-auto w-full"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
