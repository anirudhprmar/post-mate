import { api, HydrateClient } from "~/trpc/server";
import CalendarClientPage from "./calendar-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  void api.post.getAll.prefetch();

  return (
    <HydrateClient>
      <CalendarClientPage />
    </HydrateClient>
  );
}
