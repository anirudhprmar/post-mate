import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "~/components/ui/navigation-menu";
import Image from "next/image";

const navItems = [
    { label: "Demo" },
    { label: "Features"},
    // { label: "Download", hasChevron: false },
    {label: "Blog"},
    { label: "Pricing" },
];

export default function Navbar() {
    return (
        <header className="fixed top-0 z-50 right-0 left-0 w-full">
        <nav className="relative flex items-center justify-between w-full h-20 bg-muted px-5 border-b border-dashed">

            <div>
                <Link href="/" className="flex items-center">
                    <Image
                    src={'/pmlogo.png'}
                    alt="logo"
                    width={50}
                    height={50}
                    />
                    <p className="text-xl font-bold tracking-tight text-foreground select-none">
                        Postmate
                    </p>
                </Link>
            </div>

            {/* Center Navigation - Mute others hover effect */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group/nav hidden md:flex items-center gap-5">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href="#"
                        className={cn(
                            "flex items-center gap-1.5 text-[15px] font-medium transition-all duration-300 ease-out",
                            "text-foreground group-hover/nav:text-foreground/30 hover:text-foreground"
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
                    size={'lg'}
                    className="rounded-md bg-zinc-200/50"
                >
                    <Link href="/login">Log in</Link>
                </Button>
                <Button
                    variant={'default'}
                    size="lg"
                    className="rounded-md"
                >
                    Start for Free
                </Button>
            </div>
        </nav>
        </header>
    );
}
