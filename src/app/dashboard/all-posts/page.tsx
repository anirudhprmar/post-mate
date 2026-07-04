import { api, HydrateClient } from "~/trpc/server";
import AllPostsClientPage from "./all-posts-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  void api.post.getInfinite.prefetch({ limit: 12, status: "all" });

  return (
    <HydrateClient>
      <AllPostsClientPage />
    </HydrateClient>
  );
}
