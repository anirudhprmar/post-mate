"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/server/better-auth/client";
import type { OrdersResponse } from "~/lib/types/settings";

export function useBillingHistory() {
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setBillingLoading(true);
      try {
        const ordersResponse = await authClient.customer.orders.list({});
        if (ordersResponse.data) {
          setOrders(ordersResponse.data as unknown as OrdersResponse);
        } else {
          setOrders(null);
        }
      } catch (orderError) {
        console.log(
          "Orders fetch failed - customer may not exist in Polar yet:",
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
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open customer portal");
    }
  };

  return { orders, billingLoading, handleCustomerPortal };
}
