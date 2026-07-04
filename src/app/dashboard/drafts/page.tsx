import { api, HydrateClient } from "~/trpc/server";
import DraftsClientPage from "./drafts-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  void api.draft.getAll.prefetch();

  return (
    <HydrateClient>
      <DraftsClientPage />
    </HydrateClient>
  );
}
