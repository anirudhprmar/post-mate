import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { organization, member, invitation, user } from "~/server/db/schema";
import { auth } from "~/server/better-auth";
import { authClient } from "~/server/better-auth/client";

export const orgsRouter = createTRPCRouter({
  // 1. List user's organizations
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo,
        createdAt: organization.createdAt,
        metadata: organization.metadata,
        role: member.role,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, ctx.session.user.id));
  }),

  // 2. Get specific organization details
  get: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify membership
      const membership = await ctx.db
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, input.organizationId),
            eq(member.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (membership.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this organization",
        });
      }

      const org = await ctx.db
        .select()
        .from(organization)
        .where(eq(organization.id, input.organizationId))
        .limit(1);

      if (org.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      return {
        ...org[0],
        role: membership[0]!.role,
      };
    }),

  // 3. Create organization
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const org = await auth.api.createOrganization({
          body: {
            name: input.name,
            slug: input.slug,
          },
          headers: ctx.headers,
        });
        return org;
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to create organization",
          cause: err,
        });
      }
    }),

  // 4. Update organization
  update: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await auth.api.updateOrganization({
          body: {
            organizationId: input.organizationId,
            data: {
              name: input.name,
              slug: input.slug,
              logo: input.logo,
            },
          },
          headers: ctx.headers,
        });
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to update organization",
          cause: err,
        });
      }
    }),

  // 5. Delete organization
  delete: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.deleteOrganization({
          body: {
            organizationId: input.organizationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to delete organization",
          cause: err,
        });
      }
    }),

  // 6. Set active organization
  setActive: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.setActiveOrganization({
          body: {
            organizationId: input.organizationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to set active organization",
          cause: err,
        });
      }
    }),

  // 7. List members of organization
  listMembers: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check membership of requesting user
      const isMember = await ctx.db
        .select({ id: member.id })
        .from(member)
        .where(
          and(
            eq(member.organizationId, input.organizationId),
            eq(member.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (isMember.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this organization",
        });
      }

      return ctx.db
        .select({
          id: member.id,
          role: member.role,
          createdAt: member.createdAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(eq(member.organizationId, input.organizationId));
    }),

  // 8. Update member role
  changeMemberRole: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        memberId: z.string(),
        role: z.enum(["admin", "member", "owner"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.updateMemberRole({
          body: {
            memberId: input.memberId,
            role: input.role,
            organizationId: input.organizationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to change member role",
          cause: err,
        });
      }
    }),

  // 9. Remove member
  removeMember: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.removeMember({
          body: {
            memberIdOrEmail: input.memberId,
            organizationId: input.organizationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to remove member",
          cause: err,
        });
      }
    }),

  // 10. Invite member
  invite: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const inv = await auth.api.createInvitation({
          body: {
            email: input.email,
            role: input.role,
            organizationId: input.organizationId,
          },
          headers: ctx.headers,
        });
        return inv;
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to invite member",
          cause: err,
        });
      }
    }),

  // 11. List pending invitations
  listInvitations: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check membership of requesting user
      const isMember = await ctx.db
        .select({ id: member.id })
        .from(member)
        .where(
          and(
            eq(member.organizationId, input.organizationId),
            eq(member.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (isMember.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this organization",
        });
      }

      return ctx.db
        .select()
        .from(invitation)
        .where(
          and(
            eq(invitation.organizationId, input.organizationId),
            eq(invitation.status, "pending"),
          ),
        );
    }),

  // 12. Cancel invitation
  cancelInvitation: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        invitationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.cancelInvitation({
          body: {
            invitationId: input.invitationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to cancel invitation",
          cause: err,
        });
      }
    }),

  // 13. Accept invitation
  acceptInvitation: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.acceptInvitation({
          body: {
            invitationId: input.invitationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to accept invitation",
          cause: err,
        });
      }
    }),

  // 14. Reject invitation
  rejectInvitation: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await auth.api.rejectInvitation({
          body: {
            invitationId: input.invitationId,
          },
          headers: ctx.headers,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Failed to reject invitation",
          cause: err,
        });
      }
    }),
});
