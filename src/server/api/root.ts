import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { draftRouter } from "~/server/api/routers/draft";
import { connectedAccountRouter } from "~/server/api/routers/connectedAccount";
import { userRouter } from "./routers/user";
import { mediaRouter } from "./routers/media";
import { postRouter } from "./routers/posts";
import { orgsRouter } from "./routers/orgs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  draft: draftRouter,
  connectedAccount: connectedAccountRouter,
  media: mediaRouter,
  post: postRouter,
  orgs: orgsRouter,
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
