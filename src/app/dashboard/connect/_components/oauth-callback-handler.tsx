"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export function OAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const processed = useRef(false);

  const utils = api.useUtils();

  const connected = searchParams.get("connected");
  useEffect(() => {
    if (!connected || processed.current) return;
    processed.current = true;

    // Invalidate the connected accounts query so the UI refreshes
    void utils.connectedAccount.getAll.invalidate();

    // Normalize platform name for toast display
    const platformDisplay =
      connected === "x"
        ? "X"
        : connected === "linkedin"
          ? "LinkedIn"
          : connected.charAt(0).toUpperCase() + connected.slice(1);
    toast.success(`${platformDisplay} connected!`);

    // Clean up the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("connected");
    router.replace(url.pathname + (url.search || ""));
  }, [connected, utils, router]);

  const error = searchParams.get("error");
  useEffect(() => {
    if (!error) return;
    toast.error("Connection failed", { description: error.replace(/_/g, " ") });

    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    router.replace(url.pathname + (url.search || ""));
  }, [error, router]);

  return null;
}
