import { ArrowRight } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const withoutPostmate = [
  { time: "1-2hr+", description: "Scripting, brainstorming, ideating" },
  { time: "1-2hr+", description: "Recording, editing, re-recording" },
  { time: "30min+", description: "Reformatting for each platform manually" },
  {
    time: "30min+",
    description: "Scheduling & posting across platforms one by one",
  },
  { time: "20min+", description: "Previewing, fixing mistakes, re-uploading" },
  { time: "2hr+", description: "5-10 accounts across multiple platforms" },
];

const withPostmate = [
  { time: "1-2hr+", description: "Scripting, brainstorming, ideating" },
  { time: "1-2hr+", description: "Recording, editing, re-recording" },
  {
    time: "2min",
    description: "Reformatting once for each platform from just one place",
  },
  { time: "20sec", description: "One-click publish everywhere" },
  {
    time: "0min",
    description: "Live preview catches issues before they go out",
  },
];

export default function WhyUs() {
  return (
    <section className="mt-10 min-h-screen">
      {/* Section header */}
      <div className="flex flex-col items-center space-y-4 px-6 text-center">
        <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase">
          why
        </p>
        <h2 className="max-w-lg text-3xl leading-relaxed font-normal tracking-normal sm:text-4xl md:text-5xl">
          Content creation is a grind. <s>It shouldn't be.</s>
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-8 px-6 py-14 md:grid-cols-2 lg:gap-16 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Without Postmate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col space-y-4">
              {withoutPostmate.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-start gap-3 text-lg font-medium"
                >
                  <ArrowRight className="size-5 shrink-0 text-red-500" />
                  <span className="min-w-[60px] font-semibold text-red-600">
                    {item.time}
                  </span>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-2xl font-bold text-red-600">
              {" "}
              = 8 hr of content creation.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              With Postmate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col space-y-4">
              {withPostmate.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-start gap-3 text-lg font-medium"
                >
                  <ArrowRight className="size-5 shrink-0 text-green-500" />
                  <span className="min-w-[60px] font-semibold text-green-600">
                    {item.time}
                  </span>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-2xl font-bold text-green-600">
              {" "}
              = 4.5 hr of content creation.
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              Thats half the time & you only have to focus on what matters, i.e
              content.
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
