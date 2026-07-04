"use client";

import clsx from "clsx";
import {
  MoreHorizontal,
  Settings,
  Bell,
  PenTool,
  Send,
  CalendarDays,
  Scroll,
  BarChart3,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import * as React from "react";
import UserProfile from "~/components/user-profile";

const navItems = [
  {
    label: "Post",
    href: "/dashboard",
    icon: Send,
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    label: "All Posts",
    href: "/dashboard/all-posts",
    icon: Scroll,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const moreMenuItems = [
  {
    label: "Drafts",
    href: "/dashboard/drafts",
    icon: PenTool,
    description: "Your saved drafts",
  },
  {
    label: "Connections",
    href: "/dashboard/connect",
    icon: LinkIcon,
    description: "Manage your connections",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);

  const handleMoreItemClick = (href: string) => {
    setIsMoreOpen(false);
    router.push(href);
  };

  return (
    <>
      <div className="bg-background/80 border-border/40 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-lg min-[1024px]:hidden">
        <div className="relative flex h-16 items-center justify-around px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200",
                pathname === item.href
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}

          {/* More menu */}
          <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={clsx(
                  "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95",
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="border-border/40 h-auto max-h-[85vh] rounded-t-[2.5rem] border-t pb-10"
            >
              <SheetHeader className="pb-4">
                <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                <SheetDescription>
                  Manage your account and notifications
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* User Profile Section */}
                <div className="bg-muted/30 border-border/40 rounded-2xl border p-4">
                  <UserProfile showName={true} />
                </div>

                {/* Menu Items */}
                <div className="grid gap-3">
                  {moreMenuItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleMoreItemClick(item.href)}
                      className={clsx(
                        "flex items-center gap-4 rounded-2xl p-4 transition-all active:scale-[0.98]",
                        pathname === item.href
                          ? "bg-primary/10 text-primary border-primary/20 border"
                          : "bg-muted/30 hover:bg-muted/50 border border-transparent",
                      )}
                    >
                      <div
                        className={clsx(
                          "relative flex h-12 w-12 items-center justify-center rounded-xl",
                          pathname === item.href
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{item.label}</p>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Bottom padding to prevent content from being hidden behind the nav */}
      <div className="h-16 min-[1024px]:hidden" />
    </>
  );
}
