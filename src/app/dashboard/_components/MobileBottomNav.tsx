"use client";

import clsx from "clsx";
import {
  UserIcon,
  ListTodo,
  MoreHorizontal,
  Settings,
  Bell,
  TreeDeciduousIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/lib/api";
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
    label: "Today",
    href: "/profile",
    icon: UserIcon,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: TreeDeciduousIcon,
  },
];

const moreMenuItems = [
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "View your notifications",
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
  // const { data: unreadCount } = api.notification.getUnreadCount.useQuery();

  const handleMoreItemClick = (href: string) => {
    setIsMoreOpen(false);
    router.push(href);
  };

  return (
    <>
      <div className="min-[1024px]:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/40">
        <div className="relative flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1",
                pathname === item.href
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
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
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1",
                  "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[auto] max-h-[85vh] rounded-t-[2.5rem] border-t border-border/40 pb-10">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                <SheetDescription>
                  Manage your account and notifications
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* User Profile Section */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                  <UserProfile showName={true} />
                </div>

                {/* Menu Items */}
                <div className="grid gap-3">
                  {moreMenuItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleMoreItemClick(item.href)}
                      className={clsx(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98]",
                        pathname === item.href
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted/30 border border-transparent hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={clsx(
                          "flex items-center justify-center w-12 h-12 rounded-xl relative",
                          pathname === item.href
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                        {/* {item.label === "Notifications" && !!unreadCount && unreadCount > 0 && (
                          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground font-bold border-2 border-background">
                            {unreadCount}
                          </span>
                        )} */}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{item.label}</p>
                          {/* {item.label === "Notifications" && !!unreadCount && unreadCount > 0 && (
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )} */}
                        </div>
                        <p className="text-sm text-muted-foreground">
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
      <div className="min-[1024px]:hidden h-16" />
    </>
  );
}
