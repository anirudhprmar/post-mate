import { api, HydrateClient } from "~/trpc/server";
import DashboardSideBar from "./_components/Sidebar";
import MobileBottomNav from "./_components/MobileBottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prefetch both queries on the server to populate the React Query cache
  void api.user.me.prefetch();
  void api.connectedAccount.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="flex h-screen w-full overflow-hidden">
        <aside className="h-full">
          <DashboardSideBar />
        </aside>
        <main
          className="flex-1 overflow-y-auto pb-20 min-[1024px]:pb-0"
          id="dashboard-main"
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </HydrateClient>
  );
}
