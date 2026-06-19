import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { subscription } from "~/server/db/schema";

export const subscriptionRouter = createTRPCRouter({
  getDetails: protectedProcedure.query(async ({ ctx }) => {
    const userSubscriptions = await ctx.db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, ctx.session.user.id));

    if (!userSubscriptions.length) {
      return { hasSubscription: false as const };
    }

    // Get the most recent active subscription
    const activeSubscription = userSubscriptions
      .filter((sub) => sub.status === "active")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    if (activeSubscription) {
      // Validate that the subscription has valid dates
      if (
        !activeSubscription.currentPeriodStart ||
        !activeSubscription.currentPeriodEnd
      ) {
        return {
          hasSubscription: false as const,
          error: "Invalid subscription data",
          errorType: "GENERAL" as const,
        };
      }

      const now = new Date();
      const isInGracePeriod =
        activeSubscription.cancelAtPeriodEnd === true &&
        new Date(activeSubscription.currentPeriodEnd) > now;

      const sub = {
        id: activeSubscription.id,
        productId: activeSubscription.productId,
        status: activeSubscription.status,
        amount: activeSubscription.amount,
        currency: activeSubscription.currency,
        recurringInterval: activeSubscription.recurringInterval,
        currentPeriodStart: activeSubscription.currentPeriodStart,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd,
        canceledAt: activeSubscription.canceledAt,
        organizationId: null,
      };

      if (isInGracePeriod) {
        return {
          hasSubscription: true as const,
          subscription: sub,
          error:
            "Subscription will end on " +
            new Date(activeSubscription.currentPeriodEnd).toLocaleDateString(),
          errorType: "CANCELED" as const,
        };
      }

      return {
        hasSubscription: true as const,
        subscription: sub,
      };
    }

    // Fallback: no active subscription, check for latest subscription (canceled/expired)
    const latestSubscription = userSubscriptions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    if (latestSubscription) {
      if (
        !latestSubscription.currentPeriodStart ||
        !latestSubscription.currentPeriodEnd
      ) {
        return {
          hasSubscription: false as const,
          error: "Invalid subscription data",
          errorType: "GENERAL" as const,
        };
      }

      const now = new Date();
      const isExpired = new Date(latestSubscription.currentPeriodEnd) < now;
      const isCanceled = latestSubscription.status === "canceled";

      return {
        hasSubscription: true as const,
        subscription: {
          id: latestSubscription.id,
          productId: latestSubscription.productId,
          status: latestSubscription.status,
          amount: latestSubscription.amount,
          currency: latestSubscription.currency,
          recurringInterval: latestSubscription.recurringInterval,
          currentPeriodStart: latestSubscription.currentPeriodStart,
          currentPeriodEnd: latestSubscription.currentPeriodEnd,
          cancelAtPeriodEnd: latestSubscription.cancelAtPeriodEnd,
          canceledAt: latestSubscription.canceledAt,
          organizationId: null,
        },
        error: isCanceled
          ? "Subscription has been canceled"
          : isExpired
            ? "Subscription has expired"
            : "Subscription is not active",
        errorType: isCanceled
          ? ("CANCELED" as const)
          : isExpired
            ? ("EXPIRED" as const)
            : ("GENERAL" as const),
      };
    }

    return { hasSubscription: false as const };
  }),

  isSubscribed: protectedProcedure.query(async ({ ctx }) => {
    const userSubscriptions = await ctx.db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, ctx.session.user.id));

    if (!userSubscriptions.length) {
      return false;
    }

    const activeSubscription = userSubscriptions
      .filter((sub) => sub.status === "active")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    if (!activeSubscription) {
      return false;
    }

    const now = new Date();

    // Active and not canceled
    if (
      activeSubscription.status === "active" &&
      !activeSubscription.cancelAtPeriodEnd
    ) {
      return true;
    }

    // In grace period (active but will cancel at period end)
    if (
      activeSubscription.status === "active" &&
      activeSubscription.cancelAtPeriodEnd &&
      activeSubscription.currentPeriodEnd &&
      new Date(activeSubscription.currentPeriodEnd) > now
    ) {
      return true;
    }

    return false;
  }),

  hasAccess: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userSubscriptions = await ctx.db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.session.user.id));

      if (!userSubscriptions.length) {
        return false;
      }

      const activeSubscription = userSubscriptions
        .filter((sub) => sub.status === "active")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

      if (!activeSubscription) {
        return false;
      }

      const now = new Date();
      const isActive = activeSubscription.status === "active";
      const isInGracePeriod =
        isActive &&
        activeSubscription.cancelAtPeriodEnd &&
        activeSubscription.currentPeriodEnd &&
        new Date(activeSubscription.currentPeriodEnd) > now;

      return (
        (isActive || isInGracePeriod) &&
        activeSubscription.productId === input.productId
      );
    }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const userSubscriptions = await ctx.db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, ctx.session.user.id));

    if (!userSubscriptions.length) {
      return "none" as const;
    }

    const latestSubscription = userSubscriptions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    if (!latestSubscription) {
      return "none" as const;
    }

    const now = new Date();

    if (latestSubscription.status === "canceled") {
      return "canceled" as const;
    }

    if (
      latestSubscription.currentPeriodEnd &&
      new Date(latestSubscription.currentPeriodEnd) <= now
    ) {
      return "expired" as const;
    }

    if (latestSubscription.status === "active") {
      return "active" as const;
    }

    return "none" as const;
  }),
});
