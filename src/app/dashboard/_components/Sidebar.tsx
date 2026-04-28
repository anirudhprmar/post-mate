"use client";

import UserProfile from "~/components/user-profile";
import clsx from "clsx";
import Link from "next/link";
import {
  type LucideIcon,
  Settings,
  Calendar,
  Home,
  Sparkles,
  RocketIcon,
  Bell,
  PenTool,
  Users,
  Sprout,
  Waypoints,
  FileText,
  Lightbulb,
  PlusIcon
} from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import PostContent from "~/components/post-content";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: "Calendar",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Ideas",
    href: "/dashboard/ideas",
    icon: Lightbulb,
  },
  {
    label: "Create",
    href: "/dashboard/create",
    icon: FileText,
  },
  {
    label: "Inspiration",
    href: "/dashboard/inspiration",
    icon: Sparkles,
  },
  // {
  //   label: "Calendar",
  //   href: "/dashboard/calendar",
  //   icon: Calendar,
  // },
  // {
  //   label: "References",
  //   href: "/dashboard/references",
  //   icon: Waypoints,
  // },
  {
    label: "Drafts",
    href: "/dashboard/drafts",
    icon: PenTool,
  },
  // {
  //   label: "Connections",
  //   href: "/dashboard/connect",
  //   icon: Users,
  // },
];

export default function DashboardSideBar() {
  const pathname = usePathname();


  return (
    <div className="hidden min-[1024px]:block group w-64 border-r h-full bg-background">
      <div className="flex h-full flex-col">
        <div className="pl-4 pt-4 pb-2">
          <p className="text-foreground font-bold text-xl">post mate</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={'lg'} variant={'default'} className="m-2 rounded-sm"><PlusIcon className="h-4 w-4" /> Create Post</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] min-w-5xl h-150 flex flex-col">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>
                What are you posting today?
              </DialogDescription>
            </DialogHeader>

            <PostContent />

          </DialogContent>
        </Dialog>
        <nav aria-label="Main Navigation" className="flex flex-col h-full justify-between w-full py-4">

          {/* Top Navigation */}
          <div className="w-full px-3">
            <ul className="list-none pl-0 space-y-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 w-full rounded-sm px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === item.href
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col w-full">
            {/* Notifications + Settings */}
            <div className="px-3 space-y-0.5">
              <ul className="list-none pl-0">
                <li>
                  <Link
                    href="/notifications"
                    className={clsx(
                      "flex items-center w-full gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === "/notifications"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Bell className="h-5 w-5 shrink-0" />
                    <span>Notifications</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className={clsx(
                      "flex items-center w-full gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Profile — aligned with nav items */}
            <div className="mt-2 pt-2 px-3">
              <UserProfile showName={true} />
            </div>
          </div>

        </nav>
      </div>
    </div>
  );
}