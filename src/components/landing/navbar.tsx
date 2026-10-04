import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";

const navigationLinks = [
  { label: "Features", href: "/#features" },
  { label: "Support", href: "mailto:app.postmate@gmail.com" },
  { label: "Security", href: "/privacy-policy" },
  { label: "Resources", href: "/#faq" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid h-18 w-full max-w-6xl grid-cols-[1fr_auto] items-center px-6 sm:px-10 md:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="/"
          aria-label="Post Mate home"
          className="flex items-center"
        >
          <Image
            src="https://c4qrl532oo.ufs.sh/f/s0GPcE56MbtBl3FSS0sBQjgrwMc5HoZpy3dEeLPF9kvxOnV6"
            alt=""
            width={36}
            height={36}
            className="size-9"
          />
          <span className="text-foreground text-xl font-bold tracking-tight select-none">
            post mate
          </span>
        </Link>

        <div className="hidden h-10 w-[390px] items-center justify-around rounded-md bg-zinc-100 px-4 md:flex">
          {navigationLinks.map(({ label, href }, index) => (
            <div key={label} className="flex h-full items-center gap-5">
              {index > 0 && (
                <span aria-hidden="true" className="h-3 w-px bg-zinc-300" />
              )}
              <Link
                href={href}
                className="text-[11px] font-medium whitespace-nowrap text-zinc-900 transition-colors hover:text-zinc-500"
              >
                {label}
              </Link>
            </div>
          ))}
        </div>

        <Button
          asChild
          size="lg"
          className="h-10 justify-self-end rounded-full bg-black px-7 text-xs font-medium text-white hover:bg-zinc-800"
        >
          <Link href="/login">Log in</Link>
        </Button>

        <div className="col-span-2 flex h-8 items-center justify-center gap-3 pb-1 sm:gap-5 md:hidden">
          {navigationLinks.map(({ label, href }, index) => (
            <div key={label} className="flex items-center gap-3 sm:gap-5">
              {index > 0 && (
                <span aria-hidden="true" className="h-3 w-px bg-zinc-300" />
              )}
              <Link
                href={href}
                className="text-[10px] font-medium whitespace-nowrap text-zinc-900 transition-colors hover:text-zinc-500"
              >
                {label}
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
