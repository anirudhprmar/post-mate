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
import { env } from "~/env";
// import { api } from "~/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"


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

export default function PricingTable({ ref, initialIsAuthenticated, initialPurchaseDetails }: props) {
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

    if (!CREATOR_MONTHLY_TIER || !CREATOR_MONTHLY_SLUG || !PRO_MONTHLY_TIER || !PRO_MONTHLY_SLUG || !CREATOR_YEARLY_TIER || !CREATOR_YEARLY_SLUG || !PRO_YEARLY_TIER || !PRO_YEARLY_SLUG) {
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



    const creatorMonthlyFeatures = [
        "Unlimited CSV file uploads and conversions",
        "Convert to PDF instantly",
        "No monthly subscription",
        "Lifetime access",
        "Priority support",
    ];

    return (
        <section id="pricing" className="w-full p-5" ref={ref}>

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-semibold tracking-tight">
                    Choose the plan that fits your goals.
                </h2>
                <p>Choose the plan that</p>
            </div>

            <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center">
                    <TabsList className="flex justify-center">
                        <TabsTrigger value="monthly">
                            Monthly
                        </TabsTrigger>
                        <TabsTrigger value="yearly">
                            Yearly
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="monthly">
                    <div className="mx-auto flex items-center justify-center gap-5">

                        <Card className="relative drop-shadow-xl ">
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="bg-foreground text-background px-4 py-1 text-sm">{hasPurchasedProduct(CREATOR_MONTHLY_TIER) ? "Purchased" : "Best Value"}</Badge>
                            </div>
                            <CardHeader className="text-center pt-10 pb-8">
                                <CardTitle className="text-2xl font-semibold">Creator</CardTitle>

                                <CardDescription className="text-base mt-2">Perfect for individuals and small teams
                                </CardDescription>

                                <div className="mt-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold tracking-tight">$19</span>
                                        <span className="text-muted-foreground text-sm">
                                            /month
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {creatorMonthlyFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                                            <p className="text-sm text-muted-foreground text-center">
                                                Creator Monthly Access Active
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-col w-full gap-4">
                                        <Button
                                            className="w-full"
                                            size={'lg'}
                                            onClick={() => handleCheckout(CREATOR_MONTHLY_TIER, CREATOR_MONTHLY_SLUG)}
                                        >
                                            {isAuthenticated === false ? "Sign In to Purchase" : "Get Creator Monthly Access"}
                                        </Button>
                                        <p className="text-muted-foreground text-xs text-center">$0.00 due today, cancel anytime</p>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                        <Card className="relative drop-shadow-xl ">
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="bg-foreground text-background px-4 py-1 text-sm">{hasPurchasedProduct(PRO_MONTHLY_TIER) ? "Purchased" : "Best Value"}</Badge>
                            </div>
                            <CardHeader className="text-center pt-10 pb-8">
                                <CardTitle className="text-2xl font-semibold">PRO</CardTitle>

                                <CardDescription className="text-base mt-2">Perfect for professionals and businesses
                                </CardDescription>

                                <div className="mt-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold tracking-tight">$39</span>
                                        <span className="text-muted-foreground text-sm">
                                            /month
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {creatorMonthlyFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                                            <p className="text-sm text-muted-foreground text-center">
                                                Creator Monthly Access Active
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-col w-full gap-4">
                                        <Button
                                            className="w-full"
                                            size={'lg'}
                                            onClick={() => handleCheckout(PRO_MONTHLY_TIER, PRO_MONTHLY_SLUG)}
                                        >
                                            {isAuthenticated === false ? "Sign In to Purchase" : "Get PRO Monthly Access"}
                                        </Button>
                                        <p className="text-muted-foreground text-xs text-center">$0.00 due today, cancel anytime</p>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="yearly">
                    <div className="mx-auto flex items-center justify-center gap-5">

                        <Card className="relative drop-shadow-xl">
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="bg-foreground text-background px-4 py-1 text-sm">{hasPurchasedProduct(CREATOR_YEARLY_TIER) ? "Purchased" : "Best Value"}</Badge>
                            </div>
                            <CardHeader className="text-center pt-10 pb-8">
                                <CardTitle className="text-2xl font-semibold">Creator</CardTitle>

                                <CardDescription className="text-base mt-2">Perfect for individuals and small teams
                                </CardDescription>

                                <div className="mt-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold tracking-tight">$16</span>
                                        <span className="text-muted-foreground/80 text-sm">
                                            /month
                                        </span>
                                        <span className="text-muted-foreground text-sm">Billed as $192/year</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {creatorMonthlyFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                                            <p className="text-sm text-muted-foreground text-center">
                                                Creator Yearly Access Active
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-col w-full gap-4">
                                        <Button
                                            className="w-full"
                                            size={'lg'}
                                            onClick={() => handleCheckout(CREATOR_YEARLY_TIER, CREATOR_YEARLY_SLUG)}
                                        >
                                            {isAuthenticated === false ? "Sign In to Purchase" : "Get Creator Yearly Access"}
                                        </Button>
                                        <p className="text-muted-foreground text-xs text-center">$0.00 due today, cancel anytime</p>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                        <Card className="relative drop-shadow-xl ">
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="bg-foreground text-background px-4 py-1 text-sm">{hasPurchasedProduct(PRO_MONTHLY_TIER) ? "Purchased" : "Best Value"}</Badge>
                            </div>
                            <CardHeader className="text-center pt-10 pb-8">
                                <CardTitle className="text-2xl font-semibold">PRO</CardTitle>

                                <CardDescription className="text-base mt-2">Perfect for professionals and businesses
                                </CardDescription>

                                <div className="mt-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold tracking-tight">$34</span>
                                        <span className="text-muted-foreground/80 text-sm">
                                            /month
                                        </span>
                                        <span className="text-muted-foreground text-sm">Billed as $408/year</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {creatorMonthlyFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                                            <p className="text-sm text-muted-foreground text-center">
                                                PRO Yearly Access Active
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-col w-full gap-4">
                                        <Button
                                            className="w-full"
                                            size={'lg'}
                                            onClick={() => handleCheckout(PRO_YEARLY_TIER, PRO_YEARLY_SLUG)}
                                        >
                                            {isAuthenticated === false ? "Sign In to Purchase" : "Get PRO Yearly Access"}
                                        </Button>
                                        <p className="text-muted-foreground text-xs text-center">$0.00 due today, cancel anytime</p>
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