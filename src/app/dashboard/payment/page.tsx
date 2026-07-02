import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import ManageSubscription from "./_components/manage-subscription";
import { api } from "~/trpc/server";

export default async function PaymentPage() {
  const subscriptionDetails = await api.subscription.getDetails();

  return (
    <div>
      <div className="space-y-4 p-6">
        <div className="relative min-h-100 overflow-y-hidden">
          {!subscriptionDetails.hasSubscription ||
          subscriptionDetails.subscription?.status !== "active" ? (
            <>
              <div className="absolute inset-0 top-40 z-10 flex items-center justify-center rounded-lg">
                <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-900">
                  <h3 className="mb-2 text-xl font-semibold">
                    Subscription Required
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need an active subscription to access payment management
                    features.
                  </p>
                  <Link href="/pricing">
                    <Button>Subscribe Now</Button>
                  </Link>
                </div>
              </div>
              <div className="pointer-events-none blur-sm">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Management</CardTitle>
                    <CardDescription>
                      Manage your billing and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Current Plan
                        </p>
                        <p className="text-md">Pro Plan</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Billing Status
                        </p>
                        <p className="text-md">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Your current subscription information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">
                      Status
                    </p>
                    <p className="text-md capitalize">
                      {subscriptionDetails.subscription.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">
                      Amount
                    </p>
                    <p className="text-md">
                      {subscriptionDetails.subscription.amount / 100}{" "}
                      {subscriptionDetails.subscription.currency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">
                      Billing Interval
                    </p>
                    <p className="text-md capitalize">
                      {subscriptionDetails.subscription.recurringInterval}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">
                      Current Period End
                    </p>
                    <p className="text-md">
                      {new Date(
                        subscriptionDetails.subscription.currentPeriodEnd,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {subscriptionDetails.subscription.cancelAtPeriodEnd && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      Your subscription will cancel at the end of the current
                      billing period.
                    </p>
                  </div>
                )}
                <ManageSubscription />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
