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
  Lightbulb
} from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "~/lib/api";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: "Home",
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
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    label: "References",
    href: "/dashboard/references",
    icon: Waypoints,
  },
  {
    label: "Drafts",
    href: "/dashboard/drafts",
    icon: PenTool,
  },
  {
    label: "Connections",
    href: "/dashboard/connect",
    icon: Users,
  },
];

export default function DashboardSideBar() {
  const pathname = usePathname();
  // const { data: unreadCount } = api.notification.getUnreadCount.useQuery()


  return (
    <div className="min-[1024px]:block hidden group w-14 hover:w-64 border-r h-full bg-background transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-col">
        <nav aria-label="Main Navigation" className="flex flex-col h-full justify-between items-start w-full space-y-1 py-5">
          {/* Main Navigation */}
          <div className="w-full space-y-1 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center group-hover:justify-start gap-3 w-full rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === item.href
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-2 w-full">
            <div className="px-2">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/notifications"
                    className={clsx(
                      "flex items-center group-hover:justify-start w-full gap-3 rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === "/notifications"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Bell className="h-5 w-5 shrink-0" />
                    {/* <div className="relative">
                      {!!unreadCount && unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground group-hover:hidden">
                          {unreadCount}
                        </span>
                      )}
                      {!!unreadCount && unreadCount > 0 && (
                        <span className="hidden group-hover:flex absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div> */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Notifications
                    </span>
                    {/* {!!unreadCount && unreadCount > 0 && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )} */}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className={clsx(
                      "flex items-center group-hover:justify-start w-full gap-3 rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden",
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Settings
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden">
              <UserProfile />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}