import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const ideaStatus = pgEnum("idea_status", ["raw", "refined", "drafting", "done"]);
export const draftStatus = pgEnum("draft_status", ["writing", "review", "ready", "published"]);
export const scheduleStatus = pgEnum("schedule_status", ["pending", "publishing", "published", "failed"]);


export const idea = pgTable("idea", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  status: ideaStatus("status").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("idea_user_id_idx").on(t.userId),
]));

export const draft = pgTable("draft", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ideaId: text("idea_id").notNull().references(() => idea.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  media: text("media"),
  status: draftStatus("status").notNull(),
  platform: text("platform").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("draft_idea_id_idx").on(t.ideaId),
  index("draft_user_id_idx").on(t.userId),
]))

export const scheduledPost = pgTable("scheduled_post", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  draftId: text("draft_id").notNull().references(() => draft.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  publishAt: timestamp("publish_at").notNull(),
  status: scheduleStatus("status").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("scheduled_post_draft_id_idx").on(t.draftId),
  index("scheduled_post_user_id_idx").on(t.userId),
  index("scheduled_post_publish_at_status_idx").on(t.publishAt, t.status),
]))

export const niche = pgTable("niche", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull().array(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("niche_user_id_idx").on(t.userId),
]))

export const inspiration = pgTable("inspiration", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sourceProfileUrl: text("source_profile_url").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("inspiration_user_id_idx").on(t.userId),
]))

export const connectedAccount = pgTable("connected_account", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  platform: text("platform").notNull(),
  platformUserId: text("platform_user_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("connected_account_user_id_idx").on(t.userId),
  index("connected_account_platform_idx").on(t.platform, t.userId),
]))

// ── Relations ────────────────────────────────────────────────────────

export const ideaRelations = relations(idea, ({ one, many }) => ({
  user: one(user, { fields: [idea.userId], references: [user.id] }),
  drafts: many(draft),
}))

export const draftRelations = relations(draft, ({ one, many }) => ({
  idea: one(idea, { fields: [draft.ideaId], references: [idea.id] }),
  user: one(user, { fields: [draft.userId], references: [user.id] }),
  scheduledPosts: many(scheduledPost),
}))

export const scheduledPostRelations = relations(scheduledPost, ({ one }) => ({
  draft: one(draft, { fields: [scheduledPost.draftId], references: [draft.id] }),
  user: one(user, { fields: [scheduledPost.userId], references: [user.id] }),
}))

export const nicheRelations = relations(niche, ({ one }) => ({
  user: one(user, { fields: [niche.userId], references: [user.id] }),
}))

export const inspirationRelations = relations(inspiration, ({ one }) => ({
  user: one(user, { fields: [inspiration.userId], references: [user.id] }),
}))

export const connectedAccountRelations = relations(connectedAccount, ({ one }) => ({
  user: one(user, { fields: [connectedAccount.userId], references: [user.id] }),
}))

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  ideas: many(idea),
  drafts: many(draft),
  scheduledPosts: many(scheduledPost),
  niches: many(niche),
  inspirations: many(inspiration),
  connectedAccounts: many(connectedAccount),
  subscriptions: many(subscription),
}));

export const subscription = pgTable("subscription", (d) => ({
  id: d.text("id").primaryKey(),
  createdAt: d.timestamp("createdAt").notNull(),
  modifiedAt: d.timestamp("modifiedAt"),
  amount: d.integer("amount").notNull(),
  currency: d.text("currency").notNull(),
  recurringInterval: d.text("recurringInterval").notNull(),
  status: d.text("status").notNull(),
  currentPeriodStart: d.timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: d.timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: d.boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: d.timestamp("canceledAt"),
  startedAt: d.timestamp("startedAt").notNull(),
  endsAt: d.timestamp("endsAt"),
  endedAt: d.timestamp("endedAt"),
  customerId: d.text("customerId").notNull(),
  productId: d.text("productId").notNull(),
  discountId: d.text("discountId"),
  checkoutId: d.text("checkoutId").notNull(),
  customerCancellationReason: d.text("customerCancellationReason"),
  customerCancellationComment: d.text("customerCancellationComment"),
  metadata: d.text("metadata"), // JSON string
  customFieldData: d.text("customFieldData"), // JSON string
  userId: d.text("userId").references(() => user.id),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, { fields: [subscription.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

