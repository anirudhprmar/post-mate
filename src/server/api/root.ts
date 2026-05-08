import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { ideaRouter } from "~/server/api/routers/idea";
import { draftRouter } from "~/server/api/routers/draft";
import { inspirationRouter } from "~/server/api/routers/inspiration";
import { connectedAccountRouter } from "~/server/api/routers/connectedAccount";
import { subscriptionRouter } from "~/server/api/routers/subscription";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    idea: ideaRouter,
    draft: draftRouter,
    inspiration: inspirationRouter,
    connectedAccount: connectedAccountRouter,
    subscription: subscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.idea.getAll();
 *       ^? Idea[]
 */
export const createCaller = createCallerFactory(appRouter);
