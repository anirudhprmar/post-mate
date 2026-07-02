"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authClient } from "~/server/better-auth/client";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { api } from "~/lib/api";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export default function UserProfile({
  mini,
  showName = false,
}: {
  mini?: boolean;
  showName?: boolean;
}) {
  const router = useRouter();

  const {
    data: userInfo,
    isLoading,
    error,
  } = api.user.me.useQuery(undefined, {
    retry: 1,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (error) {
    return (
      <div
        className={`flex w-full items-center justify-start gap-3 overflow-hidden rounded whitespace-nowrap ${mini ? "px-2 py-2" : "px-4 pt-2 pb-3"}`}
      >
        <div className="shrink-0 text-sm text-red-500">⚠️</div>
        {!mini && (
          <div
            className={`text-sm text-red-500 transition-opacity duration-300 ${showName ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            {error.message || "Failed to load user profile"}
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex w-full items-center justify-start gap-3 overflow-hidden rounded whitespace-nowrap hover:cursor-pointer ${mini ? "px-2 py-2" : "px-3 py-2 pb-2"}`}
        >
          <Avatar className="shrink-0">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                {userInfo?.image ? (
                  <AvatarImage src={userInfo?.image} alt="User Avatar" />
                ) : (
                  <AvatarFallback>{"U"}</AvatarFallback>
                )}
              </>
            )}
          </Avatar>
          {mini ? null : (
            <div
              className={`flex items-center gap-2 transition-opacity duration-300 ${showName ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              <p className="text-md font-medium">
                {isLoading ? "Loading..." : (userInfo?.name ?? "User")}
              </p>
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/dashboard/payment">
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <div className="flex gap-2 px-2 pb-2">
            <Button
              size="sm"
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="w-fit"
            >
              Light
            </Button>
            <Button
              size="sm"
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="w-fit"
            >
              Dark
            </Button>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
