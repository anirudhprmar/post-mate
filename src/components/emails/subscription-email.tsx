import { BaseEmail } from "./base-email";

interface SubscriptionEmailProps {
  name: string;
  planName: string;
  status: "created" | "active" | "canceled" | "updated";
}

function getStatusMessage(status: SubscriptionEmailProps["status"]) {
  switch (status) {
    case "created":
      return {
        heading: "Welcome to Postmate!",
        body: "Your subscription has been created successfully.",
      };
    case "active":
      return {
        heading: "Subscription Active",
        body: "Your subscription is now active.",
      };
    case "canceled":
      return {
        heading: "Subscription Canceled",
        body: "Your subscription has been canceled.",
      };
    case "updated":
      return {
        heading: "Subscription Updated",
        body: "Your subscription has been updated.",
      };
  }
}

export function SubscriptionEmail({
  name,
  planName,
  status,
}: SubscriptionEmailProps) {
  const msg = getStatusMessage(status);

  return (
    <BaseEmail title={msg.heading} previewText={msg.body}>
      <h2 style={{ color: "#333", fontSize: 20 }}>{msg.heading}</h2>
      <p style={{ color: "#555", lineHeight: "1.6" }}>Hi {name},</p>
      <p style={{ color: "#555", lineHeight: "1.6" }}>{msg.body}</p>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: 6,
          padding: 16,
          margin: "16px 0",
        }}
      >
        <p style={{ margin: 0, color: "#333" }}>
          <strong>Plan:</strong> {planName}
        </p>
      </div>
      <p style={{ color: "#555", lineHeight: "1.6" }}>
        If you have any questions, feel free to reach out.
      </p>
    </BaseEmail>
  );
}
