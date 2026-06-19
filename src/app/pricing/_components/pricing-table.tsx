"use client";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authClient } from "~/server/better-auth/client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type RefObject } from "react";
// import { env } from "~/env";
// import { api } from "~/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface PurchaseDetails {
  hasPurchased: boolean;
  purchase?: {
    productId: string;
    status: string;
    paid: boolean;
  } | null;
}

interface props {
  ref?: RefObject<HTMLElement | null>;
  initialIsAuthenticated: boolean;
  initialPurchaseDetails: PurchaseDetails | null;
}

export default function PricingTable({
  ref,
  initialIsAuthenticated,
  initialPurchaseDetails,
}: props) {
  const router = useRouter();

  // Use passed props directly
  const isAuthenticated = initialIsAuthenticated;
  const purchaseDetails = initialPurchaseDetails;

  const handleCheckout = async (productId: string, slug: string) => {
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }

    try {
      await authClient.checkout({
        products: [productId],
        slug: slug,
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Oops, something went wrong");
    }
  };

  const handleManagePurchase = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open purchase management");
    }
  };

  const CREATOR_MONTHLY_TIER = "price_1S7t052L9078725B75504508";
  const CREATOR_MONTHLY_SLUG = "creator";

  const CREATOR_YEARLY_TIER = "price_1S7t052L9078725B75504508";
  const CREATOR_YEARLY_SLUG = "creator";

  const PRO_MONTHLY_TIER = "price_1S7t052L9078725B75504508";
  const PRO_MONTHLY_SLUG = "pro";

  const PRO_YEARLY_TIER = "price_1S7t052L9078725B75504508";
  const PRO_YEARLY_SLUG = "pro";

  if (
    !CREATOR_MONTHLY_TIER ||
    !CREATOR_MONTHLY_SLUG ||
    !PRO_MONTHLY_TIER ||
    !PRO_MONTHLY_SLUG ||
    !CREATOR_YEARLY_TIER ||
    !CREATOR_YEARLY_SLUG ||
    !PRO_YEARLY_TIER ||
    !PRO_YEARLY_SLUG
  ) {
    throw new Error("Missing required environment variables for Lifetime tier");
  }

  const hasPurchasedProduct = (tierProductId: string) => {
    if (!purchaseDetails) return false;

    return (
      purchaseDetails.hasPurchased &&
      purchaseDetails.purchase?.productId === tierProductId &&
      purchaseDetails.purchase?.status === "paid" &&
      purchaseDetails.purchase?.paid === true
    );
  };

  const creatorFeatures = [
    "15 connected social accounts",
    "Schedule posts",
    "AI posts generation",
    "Platform specific content generation",
    "Idea pipeline",
  ];

  const proFeatures = [
    "Everything in creator plan",
    "unlimited connected social accounts",
    "Priority support",
    "Invite team members",
    "Monthly Strategy Calls",
  ];

  return (
    <section id="pricing" className="w-full p-5" ref={ref}>
      <div className="mb-8 flex flex-col items-center space-y-4 px-4 text-center">
        <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase">
          Pricing
        </p>
        <h2 className="text-3xl leading-relaxed font-normal tracking-normal sm:text-4xl md:text-5xl">
          Simple pricing, maximum value.
        </h2>
        <p className="text-foreground/50 mt-2 max-w-lg text-base sm:text-lg md:text-xl">
          Choose the plan that fits your goals
        </p>
      </div>

      <Tabs defaultValue="monthly" className="flex w-full flex-col">
        <div className="flex items-center justify-center">
          <TabsList className="flex justify-center bg-white">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly">
          <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-8 px-4 md:px-0 lg:flex-row lg:gap-5">
            <Card className="relative w-full max-w-sm drop-shadow-xl">
              <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
                <Badge className="px-4 py-1 text-sm" variant={"outline"}>
                  {hasPurchasedProduct(CREATOR_MONTHLY_TIER)
                    ? "Purchased"
                    : "Best Value"}
                </Badge>
              </div>
              <CardHeader className="pt-12 pb-8 text-center">
                <CardTitle className="text-2xl font-semibold">
                  CREATOR
                </CardTitle>

                <CardDescription className="mt-2 text-base">
                  Perfect for individuals and small teams
                </CardDescription>

                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold tracking-tight">
                      $19
                    </span>
                    <span className="text-muted-foreground py-2 pt-2 text-sm">
                      /month
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {creatorFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                {hasPurchasedProduct(CREATOR_MONTHLY_TIER) ? (
                  <div className="w-full space-y-3">
                    <Button
                      className="w-full py-6 text-lg"
                      variant="outline"
                      onClick={handleManagePurchase}
                    >
                      Manage Purchase
                    </Button>
                    {purchaseDetails?.purchase && (
                      <p className="text-muted-foreground text-center text-sm">
                        Creator Monthly Access Active
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex-col gap-4">
                    <Button
                      className="w-full"
                      size={"lg"}
                      onClick={() =>
                        handleCheckout(
                          CREATOR_MONTHLY_TIER,
                          CREATOR_MONTHLY_SLUG,
                        )
                      }
                    >
                      {isAuthenticated === false
                        ? "Sign In to Purchase"
                        : "Get Creator Monthly Access"}
                    </Button>
                    <p className="text-muted-foreground pt-2 text-center text-xs">
                      $0.00 due today, cancel anytime
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>
            <Card className="relative w-full max-w-sm drop-shadow-xl">
              <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
                <Badge className="px-4 py-1 text-sm" variant={"default"}>
                  {hasPurchasedProduct(PRO_MONTHLY_TIER)
                    ? "Purchased"
                    : "Most Popular"}
                </Badge>
              </div>
              <CardHeader className="pt-12 pb-8 text-center">
                <CardTitle className="text-2xl font-semibold">PRO</CardTitle>

                <CardDescription className="mt-2 text-base">
                  Perfect for professionals and businesses
                </CardDescription>

                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold tracking-tight">
                      $39
                    </span>
                    <span className="text-muted-foreground py-2 pt-2 text-sm">
                      /month
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                {hasPurchasedProduct(PRO_MONTHLY_TIER) ? (
                  <div className="w-full space-y-3">
                    <Button
                      className="w-full py-6 text-lg"
                      variant="outline"
                      onClick={handleManagePurchase}
                    >
                      Manage Purchase
                    </Button>
                    {purchaseDetails?.purchase && (
                      <p className="text-muted-foreground text-center text-sm">
                        Creator Monthly Access Active
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex-col gap-4">
                    <Button
                      className="w-full"
                      size={"lg"}
                      onClick={() =>
                        handleCheckout(PRO_MONTHLY_TIER, PRO_MONTHLY_SLUG)
                      }
                    >
                      {isAuthenticated === false
                        ? "Sign In to Purchase"
                        : "Get PRO Monthly Access"}
                    </Button>
                    <p className="text-muted-foreground pt-2 text-center text-xs">
                      $0.00 due today, cancel anytime
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly">
          <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-8 px-4 md:px-0 lg:flex-row lg:gap-5">
            <Card className="relative w-full max-w-sm drop-shadow-xl">
              <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
                <Badge className="px-4 py-1 text-sm" variant={"outline"}>
                  {hasPurchasedProduct(CREATOR_YEARLY_TIER)
                    ? "Purchased"
                    : "Best Value"}
                </Badge>
              </div>
              <CardHeader className="pt-12 pb-8 text-center">
                <CardTitle className="text-2xl font-semibold">
                  CREATOR
                </CardTitle>

                <CardDescription className="mt-2 text-base">
                  Perfect for individuals and small teams
                </CardDescription>

                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold tracking-tight">
                      $16
                    </span>
                    <span className="text-muted-foreground/80 text-sm">
                      /month
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Billed as $192/year
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {creatorFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                {hasPurchasedProduct(CREATOR_YEARLY_TIER) ? (
                  <div className="w-full space-y-3">
                    <Button
                      className="w-full py-6 text-lg"
                      variant="outline"
                      onClick={handleManagePurchase}
                    >
                      Manage Purchase
                    </Button>
                    {purchaseDetails?.purchase && (
                      <p className="text-muted-foreground text-center text-sm">
                        Creator Yearly Access Active
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex-col gap-4">
                    <Button
                      className="w-full"
                      size={"lg"}
                      onClick={() =>
                        handleCheckout(CREATOR_YEARLY_TIER, CREATOR_YEARLY_SLUG)
                      }
                    >
                      {isAuthenticated === false
                        ? "Sign In to Purchase"
                        : "Get Creator Yearly Access"}
                    </Button>
                    <p className="text-muted-foreground pt-2 text-center text-xs">
                      $0.00 due today, cancel anytime
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>
            <Card className="relative w-full max-w-sm drop-shadow-xl">
              <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
                <Badge className="px-4 py-1 text-sm" variant={"default"}>
                  {hasPurchasedProduct(PRO_MONTHLY_TIER)
                    ? "Purchased"
                    : "Most Popular"}
                </Badge>
              </div>
              <CardHeader className="pt-12 pb-8 text-center">
                <CardTitle className="text-2xl font-semibold">PRO</CardTitle>

                <CardDescription className="mt-2 text-base">
                  Perfect for professionals and businesses
                </CardDescription>

                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold tracking-tight">
                      $34
                    </span>
                    <span className="text-muted-foreground/80 text-sm">
                      /month
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Billed as $408/year
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                {hasPurchasedProduct(PRO_YEARLY_TIER) ? (
                  <div className="w-full space-y-3">
                    <Button
                      className="w-full py-6 text-lg"
                      variant="outline"
                      onClick={handleManagePurchase}
                    >
                      Manage Purchase
                    </Button>
                    {purchaseDetails?.purchase && (
                      <p className="text-muted-foreground text-center text-sm">
                        PRO Yearly Access Active
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex-col gap-4">
                    <Button
                      className="w-full"
                      size={"lg"}
                      onClick={() =>
                        handleCheckout(PRO_YEARLY_TIER, PRO_YEARLY_SLUG)
                      }
                    >
                      {isAuthenticated === false
                        ? "Sign In to Purchase"
                        : "Get PRO Yearly Access"}
                    </Button>
                    <p className="text-muted-foreground pt-2 text-center text-xs">
                      $0.00 due today, cancel anytime
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
