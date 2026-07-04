import { api, HydrateClient } from "~/trpc/server";
import ConnectClientPage from "./connect-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  void api.connectedAccount.getAll.prefetch();

  return (
    <HydrateClient>
      <ConnectClientPage />
    </HydrateClient>
  );
}
