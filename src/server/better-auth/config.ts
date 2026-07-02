import "server-only";

import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";
import { sendEmail } from "~/server/email";
import { SubscriptionEmail } from "~/components/emails/subscription-email";
import {
  account,
  subscription,
  session,
  user,
  verification,
  organization as orgTable,
  member,
  invitation,
} from "~/server/db/schema";
import { env } from "~/env";
import { db } from "~/server/db";
import { organization } from "better-auth/plugins";

const dodoClient = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.NODE_ENV === "production" ? "live_mode" : "test_mode",
});

async function upsertSubscription(data: {
  id: string;
  status: string;
  currency: string;
  amount: number;
  recurringInterval: string;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  customerId: string;
  productId: string;
  discountId: string | null;
  customerCancellationReason: string | null;
  customerCancellationComment: string | null;
  metadata: string | null;
  customFieldData: string | null;
  userId: string;
}) {
  await db
    .insert(subscription)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: subscription.id,
      set: {
        updatedAt: new Date(),
        status: data.status,
        currency: data.currency,
        amount: data.amount,
        recurringInterval: data.recurringInterval,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        canceledAt: data.canceledAt,
        customerId: data.customerId,
        productId: data.productId,
        discountId: data.discountId,
        customerCancellationReason: data.customerCancellationReason,
        customerCancellationComment: data.customerCancellationComment,
        metadata: data.metadata,
        customFieldData: data.customFieldData,
        userId: data.userId,
      },
    });
}

export const auth = betterAuth({
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  allowedDevOrigins: [env.NEXT_PUBLIC_APP_URL],
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      subscription,
      organization: orgTable,
      member,
      invitation,
    },
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  plugins: [
    organization(),
    dodopayments({
      client: dodoClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId:
                env.NEXT_PUBLIC_CREATOR_MONTHLY_TIER ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_CREATOR_MONTHLY_TIER environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_CREATOR_MONTHLY_TIER_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_CREATOR_MONTHLY_TIER_SLUG environment variable is required",
                  );
                })(),
            },
            {
              productId:
                env.NEXT_PUBLIC_CREATOR_YEARLY_TIER ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_CREATOR_YEARLY_TIER environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_CREATOR_YEARLY_TIER_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_CREATOR_YEARLY_TIER_SLUG environment variable is required",
                  );
                })(),
            },
            {
              productId:
                env.NEXT_PUBLIC_PRO_YEARLY_TIER ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_PRO_YEARLY_TIER environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_PRO_YEARLY_TIER_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_PRO_YEARLY_TIER_SLUG environment variable is required",
                  );
                })(),
            },
            {
              productId:
                env.NEXT_PUBLIC_PRO_MONTHLY_TIER ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_PRO_MONTHLY_TIER environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_PRO_MONTHLY_TIER_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_PRO_MONTHLY_TIER_SLUG environment variable is required",
                  );
                })(),
            },
          ],
          successUrl: `${env.NEXT_PUBLIC_APP_URL}/${env.DODO_PAYMENTS_SUCCESS_URL}`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey:
            env.DODO_PAYMENTS_WEBHOOK_SECRET ??
            (() => {
              throw new Error(
                "DODO_PAYMENTS_WEBHOOK_SECRET environment variable is required",
              );
            })(),
          onSubscriptionActive: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "active");
          },
          onSubscriptionUpdated: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "updated");
          },
          onSubscriptionRenewed: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "updated");
          },
          onSubscriptionPlanChanged: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "updated");
          },
          onSubscriptionCancelled: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "canceled");
          },
          onSubscriptionExpired: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "canceled");
          },
          onSubscriptionOnHold: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "updated");
          },
          onSubscriptionFailed: async (payload) => {
            await handleSubscriptionWebhook(payload.data, "updated");
          },
        }),
      ],
    }),
    nextCookies(),
  ],
});

async function handleSubscriptionWebhook(
  data: {
    subscription_id: string;
    status: string;
    currency: string;
    recurring_pre_tax_amount: number;
    payment_frequency_interval: string;
    previous_billing_date: Date | string;
    next_billing_date: Date | string;
    cancel_at_next_billing_date: boolean;
    cancelled_at?: Date | string | null;
    customer: { customer_id: string; email: string; name: string };
    product_id: string;
    discount_id?: string | null;
    cancellation_feedback?: string | null;
    cancellation_comment?: string | null;
    metadata?: Record<string, string>;
    custom_field_responses?: Array<unknown> | null;
    [key: string]: unknown;
  },
  emailStatus: "active" | "created" | "canceled" | "updated",
) {
  try {
    const [subscriber] = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.email, data.customer.email));

    if (!subscriber) {
      console.warn(
        "No user found for Dodo customer email:",
        data.customer.email,
      );
      return;
    }

    await upsertSubscription({
      id: data.subscription_id,
      status: data.status,
      currency: data.currency,
      amount: data.recurring_pre_tax_amount,
      recurringInterval: data.payment_frequency_interval,
      currentPeriodStart: data.previous_billing_date
        ? new Date(
            data.previous_billing_date instanceof Date
              ? data.previous_billing_date.toISOString()
              : data.previous_billing_date,
          )
        : null,
      currentPeriodEnd: new Date(
        data.next_billing_date instanceof Date
          ? data.next_billing_date.toISOString()
          : data.next_billing_date,
      ),
      cancelAtPeriodEnd: data.cancel_at_next_billing_date,
      canceledAt: data.cancelled_at
        ? new Date(
            data.cancelled_at instanceof Date
              ? data.cancelled_at.toISOString()
              : data.cancelled_at,
          )
        : null,
      customerId: data.customer.customer_id,
      productId: data.product_id,
      discountId: data.discount_id ?? null,
      customerCancellationReason: data.cancellation_feedback
        ? String(data.cancellation_feedback)
        : null,
      customerCancellationComment: data.cancellation_comment ?? null,
      metadata:
        data.metadata && Object.keys(data.metadata).length > 0
          ? JSON.stringify(data.metadata)
          : null,
      customFieldData:
        data.custom_field_responses && data.custom_field_responses.length > 0
          ? JSON.stringify(data.custom_field_responses)
          : null,
      userId: subscriber.id,
    });

    void sendEmail({
      to: subscriber.email,
      subject: `Subscription ${
        emailStatus === "created" || emailStatus === "active"
          ? "Confirmed"
          : emailStatus === "canceled"
            ? "Canceled"
            : "Updated"
      } - Postmate`,
      react: SubscriptionEmail({
        name: subscriber.name,
        planName: data.product_id,
        status: emailStatus === "active" ? "created" : emailStatus,
      }),
    });
  } catch (error) {
    console.error("💥 Error processing subscription webhook:", error);
  }
}

export type Session = typeof auth.$Infer.Session;
