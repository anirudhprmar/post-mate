import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { account, subscription, session, user, verification } from '~/server/db/schema';
import { env } from "~/env";
import { db } from "~/server/db";
import { genericOAuth } from "better-auth/plugins";

function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const auth = betterAuth({
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL
  ],
  allowedDevOrigins: [
    env.NEXT_PUBLIC_APP_URL,
  ],
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // Cache duration in seconds
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      subscription
    }
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET
    },
    linkedin: {
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET
    },
    twitter: {
      clientId: env.X_CLIENT_ID,
      clientSecret: env.X_CLIENT_SECRET,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      trustedProviders: ["linkedin", "twitter", "instagram"],
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "instagram",
          clientId: env.INSTA_CLIENT_ID,
          clientSecret: env.INSTA_CLIENT_SECRET,
          authorizationUrl: "https://api.instagram.com/oauth/authorize",
          tokenUrl: "https://api.instagram.com/oauth/access_token",
          scopes: ["user_profile", "user_media", "threads_basic"],
        },
      ],
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId:
                env.NEXT_PUBLIC_STARTER_ID ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_STARTER_ID environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_STARTER_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_STARTER_SLUG environment variable is required",
                  );
                })(),
            },
          ],
          successUrl: `${env.NEXT_PUBLIC_APP_URL}/${env.POLAR_SUCCESS_URL}`,
          authenticatedUsersOnly: true
        }),
        portal(),
        webhooks({
          secret:
            env.POLAR_WEBHOOK_SECRET ??
            (() => {
              throw new Error(
                "POLAR_WEBHOOK_SECRET environment variable is required",
              );
            })(),
          onPayload: async ({ data, type }) => {
            if (
              type === "subscription.created" ||
              type === "subscription.active" ||
              type === "subscription.canceled" ||
              type === "subscription.revoked" ||
              type === "subscription.uncanceled" ||
              type === "subscription.updated"
            ) {

              try {
                // STEP 1: Extract user ID from customer data
                const userId = data.customer?.externalId;
                if (!userId || !data.checkoutId) {
                  console.warn("No user or checkout found", { userId, checkoutId: data.checkoutId });
                  return;
                }
                // STEP 2: Build subscription data
                const subscriptionData = {
                  id: data.id,
                  createdAt: new Date(data.createdAt),
                  updatedAt: safeParseDate(data.modifiedAt),
                  amount: data.amount,
                  currency: data.currency,
                  recurringInterval: data.recurringInterval,
                  status: data.status,
                  currentPeriodStart:
                    safeParseDate(data.currentPeriodStart) ?? new Date(),
                  currentPeriodEnd:
                    safeParseDate(data.currentPeriodEnd) ?? new Date(),
                  cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
                  canceledAt: safeParseDate(data.canceledAt),
                  startedAt: safeParseDate(data.startedAt) ?? new Date(),
                  endsAt: safeParseDate(data.endsAt),
                  endedAt: safeParseDate(data.endedAt),
                  customerId: data.customerId,
                  productId: data.productId,
                  discountId: data.discountId ?? null,
                  checkoutId: data.checkoutId,
                  customerCancellationReason:
                    data.customerCancellationReason ?? null,
                  customerCancellationComment:
                    data.customerCancellationComment ?? null,
                  metadata: data.metadata
                    ? JSON.stringify(data.metadata)
                    : null,
                  customFieldData: data.customFieldData
                    ? JSON.stringify(data.customFieldData)
                    : null,
                  userId: userId,
                };



                // STEP 3: Use Drizzle's onConflictDoUpdate for proper upsert
                await db
                  .insert(subscription)
                  .values(subscriptionData)
                  .onConflictDoUpdate({
                    target: subscription.id,
                    set: {
                      updatedAt: subscriptionData.updatedAt ?? new Date(),
                      amount: subscriptionData.amount,
                      currency: subscriptionData.currency,
                      recurringInterval: subscriptionData.recurringInterval,
                      status: subscriptionData.status,
                      currentPeriodStart: subscriptionData.currentPeriodStart,
                      currentPeriodEnd: subscriptionData.currentPeriodEnd,
                      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
                      canceledAt: subscriptionData.canceledAt,
                      startedAt: subscriptionData.startedAt,
                      endsAt: subscriptionData.endsAt,
                      endedAt: subscriptionData.endedAt,
                      customerId: subscriptionData.customerId,
                      productId: subscriptionData.productId,
                      discountId: subscriptionData.discountId,
                      checkoutId: subscriptionData.checkoutId,
                      customerCancellationReason:
                        subscriptionData.customerCancellationReason,
                      customerCancellationComment:
                        subscriptionData.customerCancellationComment,
                      metadata: subscriptionData.metadata,
                      customFieldData: subscriptionData.customFieldData,
                      userId: subscriptionData.userId,
                    },
                  });


              } catch (error) {
                console.error(
                  "💥 Error processing subscription webhook:",
                  error,
                );
                // Don't throw - let webhook succeed to avoid retries
              }
            }

          },

        })
      ],
    }),
    nextCookies()]
});


export type Session = typeof auth.$Infer.Session;
