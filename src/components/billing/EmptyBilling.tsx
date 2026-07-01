"use client";
import { Card, CardContent } from "~/components/ui/card";
import type { OrdersResponse } from "~/lib/types/settings";

interface EmptyBillingProps {
  orders: OrdersResponse | null;
}

export function EmptyBilling({ orders }: EmptyBillingProps) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            className="text-muted-foreground mb-4 h-10 w-10"
            viewBox="0 0 24 24"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
          <p className="text-muted-foreground mt-2 mb-4 text-sm">
            {orders === null
              ? "Unable to load billing history. This may be because your account is not yet set up for billing."
              : "You don't have any orders yet. Your billing history will appear here."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
