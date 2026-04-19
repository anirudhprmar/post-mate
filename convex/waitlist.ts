import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("waitlist")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (existing) {
            throw new Error("Email already registered");
        }

        await ctx.db.insert("waitlist", {
            email: args.email,
            createdAt: Date.now(),
        });

        return { success: true };
    },
});

export const getCount = query({
    args: {},
    handler: async (ctx) => {
        const entries = await ctx.db.query("waitlist").collect();
        return entries.length;
    },
});
