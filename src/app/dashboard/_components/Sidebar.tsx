"use client";

import UserProfile from "~/components/user-profile";
import clsx from "clsx";
import Link from "next/link";
import {
  type LucideIcon,
  Settings,
  Bell,
  PenTool,
  CalendarDays,
  LinkIcon,
  Scroll,
  BarChart3,
  Send,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
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
    label: "Drafts",
    href: "/dashboard/drafts",
    icon: PenTool,
  },
  // {
  //   label: "Content Lab",
  //   href: "/dashboard/create",
  //   icon: FlaskConical,
  // },
  // {
  //   label: "Analytics",
  //   href: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  {
    label: "Connections",
    href: "/dashboard/connect",
    icon: LinkIcon,
  },
];

export default function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <div className="group bg-background hidden h-full w-64 border-r min-[1024px]:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 pt-4 pb-2 pl-4">
          <Image
            src={
              "https://c4qrl532oo.ufs.sh/f/s0GPcE56MbtBl3FSS0sBQjgrwMc5HoZpy3dEeLPF9kvxOnV6"
            }
            alt="logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <p className="text-foreground text-xl font-bold">postmate</p>
        </div>
        <nav
          aria-label="Main Navigation"
          className="flex h-full w-full flex-col justify-between py-4"
        >
          {/* Top Navigation */}
          <div className="w-full px-3">
            <ul className="list-none space-y-0.5 pl-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex w-full items-center gap-3 overflow-hidden rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-all",
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
          <div className="flex w-full flex-col">
            {/* Notifications + Settings */}
            <div className="space-y-0.5 px-3">
              <ul className="list-none pl-0">
                <li>
                  <Link
                    href="/dashboard/notifications"
                    className={clsx(
                      "flex w-full items-center gap-3 overflow-hidden rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-all",
                      pathname === "/dashboard/notifications"
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
                    href="/dashboard/settings"
                    className={clsx(
                      "flex w-full items-center gap-3 overflow-hidden rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-all",
                      pathname === "/dashboard/settings"
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
            <div className="mt-2 px-3 pt-2">
              <UserProfile showName={true} />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
