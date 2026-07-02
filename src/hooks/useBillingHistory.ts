"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/server/better-auth/client";
import { env } from "~/env";
import type { OrdersResponse } from "~/lib/types/settings";

const productIdToName: Record<string, string> = {
  [env.NEXT_PUBLIC_CREATOR_MONTHLY_TIER]: "Creator Monthly",
  [env.NEXT_PUBLIC_PRO_MONTHLY_TIER]: "Pro Monthly",
  [env.NEXT_PUBLIC_CREATOR_YEARLY_TIER]: "Creator Yearly",
  [env.NEXT_PUBLIC_PRO_YEARLY_TIER]: "Pro Yearly",
};

export function useBillingHistory() {
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setBillingLoading(true);
      try {
        const ordersResponse =
          await authClient.dodopayments.customer.payments.list({
            query: { page: 1, limit: 50, status: "succeeded" },
          });

        if (ordersResponse.data && ordersResponse.data.items) {
          const succeeded = ordersResponse.data.items.filter(
            (item) => item.status === "succeeded",
          );

          const subsResponse =
            await authClient.dodopayments.customer.subscriptions.list({
              query: { page: 1, limit: 50 },
            });

          const subProductMap = new Map<string, string>();
          if (subsResponse.data?.items) {
            for (const sub of subsResponse.data.items) {
              if (sub.subscription_id && sub.product_id) {
                subProductMap.set(sub.subscription_id, sub.product_id);
              }
            }
          }

          const mappedItems = succeeded.flatMap((item) => {
            if (!item.subscription_id) return [];

            const productId = subProductMap.get(item.subscription_id);
            if (!productId) return [];

            const productName = productIdToName[productId] ?? "";

            return [
              {
                id: item.payment_id,
                product: productName,
                invoiceURL: item.invoice_url ?? "",
                createdAt: item.created_at,
                totalAmount: item.total_amount,
                currency: item.currency,
                status: "succeeded",
                subscription: {
                  status: "paid",
                },
              },
            ];
          });

          setOrders({
            result: {
              items: mappedItems,
            },
          });
        } else {
          setOrders(null);
        }
      } catch (orderError) {
        console.log(
          "Payments fetch failed - customer may not exist in Dodo yet:",
          orderError,
        );
        setOrders(null);
      } finally {
        setBillingLoading(false);
      }
    };
    void fetchOrders();
  }, []);

  const handleCustomerPortal = async () => {
    try {
      const { data: customerPortal } =
        await authClient.dodopayments.customer.portal();
      if (customerPortal?.url) {
        window.location.href = customerPortal.url;
      }
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open customer portal");
    }
  };

  return { orders, billingLoading, handleCustomerPortal };
}
