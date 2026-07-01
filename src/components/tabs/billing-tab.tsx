"use client";
import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import { OrderCard } from "../billing/OrderCard";
import { EmptyBilling } from "../billing/EmptyBilling";
import type { OrdersResponse } from "~/lib/types/settings";

interface BillingTabProps {
  orders: OrdersResponse | null;
  onCustomerPortal: () => Promise<void>;
}

export function BillingTab({ orders, onCustomerPortal }: BillingTabProps) {
  return (
    <div className="mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Billing History</h3>
          <p className="text-muted-foreground text-sm">
            View your past and upcoming invoices
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onCustomerPortal}
          disabled={orders === null}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Manage Subscription
        </Button>
      </div>
      {orders?.result?.items && orders.result.items.length > 0 ? (
        <div className="space-y-4">
          {orders.result.items.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyBilling orders={orders} />
      )}
    </div>
  );
}
