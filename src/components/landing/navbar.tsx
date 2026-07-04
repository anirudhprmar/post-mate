import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import Image from "next/image";

const navItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-100 w-full">
      <nav className="bg-muted relative flex h-20 w-full items-center justify-between border-b border-dashed px-5">
        <div>
          <Link href="/" className="flex items-center">
            <Image
              src={
                "https://c4qrl532oo.ufs.sh/f/s0GPcE56MbtBl3FSS0sBQjgrwMc5HoZpy3dEeLPF9kvxOnV6"
              }
              alt="logo"
              width={50}
              height={50}
            />
            <p className="text-foreground text-xl font-bold tracking-tight select-none">
              post mate
            </p>
          </Link>
        </div>

        {/* Center Navigation - Mute others hover effect */}
        <div className="group/nav absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href="#"
              className={cn(
                "flex items-center gap-1.5 text-[15px] font-medium transition-all duration-300 ease-out",
                "text-foreground group-hover/nav:text-foreground/30 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size={"lg"}
            className="rounded-md bg-zinc-200/50"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Link href={"/pricing"}>
            <Button variant={"default"} size="lg" className="rounded-md">
              Start for Free
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
