"use client";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { Order } from "~/lib/types/settings";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex justify-center gap-2">
                <h4 className="text-base font-medium">
                  {order.product?.name ?? "Subscription"}
                </h4>
                <div className="flex items-center gap-2">
                  {order.subscription?.status === "paid" ? (
                    <Badge className="bg-green-100 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Paid
                    </Badge>
                  ) : order.subscription?.status === "canceled" ? (
                    <Badge variant="destructive" className="text-xs">
                      Canceled
                    </Badge>
                  ) : order.subscription?.status === "refunded" ? (
                    <Badge className="bg-blue-100 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Refunded
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {order.subscription?.status}
                    </Badge>
                  )}
                  {order.subscription?.status === "canceled" && (
                    <span className="text-muted-foreground text-xs">
                      • Canceled on{" "}
                      {order.subscription.endedAt
                        ? new Date(
                            order.subscription.endedAt,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-medium">
                ${(order.totalAmount / 100).toFixed(2)}
              </div>
              <div className="text-muted-foreground text-xs">
                {order.currency?.toUpperCase()}
              </div>
            </div>
          </div>
          {order.items?.length > 0 && (
            <div className="mt-2 border-t pt-3">
              <ul className="space-y-1.5 text-sm">
                {order.items.map((item, index) => (
                  <li
                    key={`${order.id}-${item.label}-${index}`}
                    className="flex justify-between"
                  >
                    <span className="text-muted-foreground max-w-[200px] truncate">
                      {item.label}
                    </span>
                    <span className="font-medium">
                      ${(item.amount / 100).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
