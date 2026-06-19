import PricingTable from "./_components/pricing-table";
// import { api } from "~/trpc/server";

export default async function PricingPage() {
  // const isAuthenticated = await api.user.isAuthenticated();

  // let purchaseDetails = null;
  // if (isAuthenticated) {
  //     purchaseDetails = await api.payment.getPurchaseDetails();
  // }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <PricingTable
        initialIsAuthenticated={false}
        initialPurchaseDetails={null}
      />
    </div>
  );
}
