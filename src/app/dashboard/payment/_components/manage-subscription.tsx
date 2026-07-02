"use client";
import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import { authClient } from "~/server/better-auth/client";

export default function ManageSubscription() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          await authClient.customer.portal();
        } catch (error) {
          console.error("Failed to open customer portal:", error);
        }
      }}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      Manage Subscription
    </Button>
  );
}
