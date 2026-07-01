"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import DraftManager from "./_components/DraftManager";

export default function DraftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: draft,
    isLoading,
    refetch,
  } = api.draft.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground text-lg">Draft not found.</p>
        <Button
          onClick={() => router.push("/dashboard/drafts")}
          variant="outline"
          className="rounded-full"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Drafts
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Mesh Background */}
      <div className="bg-mesh animate-mesh pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20" />
      <DraftManager draft={draft} refetch={refetch} />
    </div>
  );
}
