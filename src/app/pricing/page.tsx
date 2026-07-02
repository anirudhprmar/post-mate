import PricingTable from "./_components/pricing-table";
import { api } from "~/trpc/server";
import { getSession } from "~/server/better-auth/server";

export default async function PricingPage() {
  const session = await getSession();
  const isAuthenticated = !!session;

  let purchaseDetails = null;
  if (isAuthenticated) {
    const subscriptionDetails = await api.subscription.getDetails();
    if (
      subscriptionDetails.hasSubscription &&
      subscriptionDetails.subscription
    ) {
      purchaseDetails = {
        hasPurchased: true,
        purchase: {
          productId: subscriptionDetails.subscription.productId,
          status:
            subscriptionDetails.subscription.status === "active"
              ? "paid"
              : subscriptionDetails.subscription.status,
          paid: subscriptionDetails.subscription.status === "active",
        },
      };
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <PricingTable
        initialIsAuthenticated={isAuthenticated}
        initialPurchaseDetails={purchaseDetails}
      />
    </div>
  );
}
