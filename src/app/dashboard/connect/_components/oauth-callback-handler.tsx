"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type SupportedProvider = "linkedin" | "instagram" | "twitter" | "facebook" | "threads";
const SUPPORTED: SupportedProvider[] = ["linkedin", "instagram", "twitter", "facebook", "threads"];


export function OAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const processed = useRef(false);

  const rawLinked = searchParams.get("linked");
  const linked = SUPPORTED.includes(rawLinked as SupportedProvider)
    ? (rawLinked as SupportedProvider)
    : null;

  const utils = api.useUtils();

  const sync = api.connectedAccount.syncFromOAuth.useMutation({
    onSuccess: (account) => {
      void utils.connectedAccount.getAll.invalidate();
      toast.success(`${linked} connected!`, {
        description: account?.username ? `Connected as ${account.username}` : undefined,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("linked");
      router.replace(url.pathname + (url.search || ""));
    },
    onError: (err) => {
      toast.error(`Failed to save ${linked ?? "account"}`, { description: err.message });
      const url = new URL(window.location.href);
      url.searchParams.delete("linked");
      router.replace(url.pathname + (url.search || ""));
    },
  });

  useEffect(() => {
    if (!linked || processed.current || sync.isPending || sync.isSuccess || sync.isError) return;
    processed.current = true;
    sync.mutate({ provider: linked });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linked]);

  if (!linked || (!sync.isPending && !sync.isError)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 shadow-lg text-sm text-muted-foreground animate-in slide-in-from-bottom-2 duration-300">
      <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
      <span>Saving {linked} account…</span>
    </div>
  );
}
