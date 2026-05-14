import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const ideaStatus = pgEnum("idea_status", ["raw", "refined", "drafting", "done"]);
export const scheduleStatus = pgEnum("schedule_status", ["pending", "publishing", "published", "failed"]);
export const accountStatus = pgEnum("account_status", ["active", "expired", "revoked", "error"]);
export const platform = pgEnum("platform", ["instagram", "twitter", "facebook", "linkedin", "youtube", "threads"]);
export const postStatus = pgEnum("post_status", ["draft", "scheduled", "published", "failed"]);
export const targetStatus = pgEnum("target_status", ["pending", "publishing", "published", "failed", "skipped"])

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


export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  recurringInterval: text("recurring_interval").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  canceledAt: timestamp("canceled_at"),
  startedAt: timestamp("started_at").notNull(),
  endsAt: timestamp("ends_at"),
  endedAt: timestamp("ended_at"),
  customerId: text("customer_id").notNull(),
  productId: text("product_id").notNull(),
  discountId: text("discount_id"),
  checkoutId: text("checkout_id").notNull(),
  customerCancellationReason: text("customer_cancellation_reason"),
  customerCancellationComment: text("customer_cancellation_comment"),
  metadata: text("metadata"),
  customFieldData: text("custom_field_data"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (t) => (
  [index("subscription_userId_idx").on(t.userId),]
));

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
  index("idea_userId_idx").on(t.userId),
]));

export const draft = pgTable("draft", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ideaId: text("idea_id").notNull().references(() => idea.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  media: text("media"),
  status: postStatus("status").notNull(),
  platform: platform("platform").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("draft_idea_id_idx").on(t.ideaId),
  index("draft_userId_idx").on(t.userId),
]))


export const inspiration = pgTable("inspiration", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  postData: jsonb("post_data"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("inspiration_userId_idx").on(t.userId),
]))

export const connectedAccount = pgTable("connected_account", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  platform: platform("platform").notNull(),
  accountId: text("account_id").notNull(),
  avatarUrl: text("avatar_url"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  platformSpecificData: jsonb("platform_specific_data").default(sql`'{}'::jsonb`),
  status: accountStatus("status").notNull(),
  lastRefreshed: timestamp("last_refreshed"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => ([
  index("connected_account_userId_idx").on(t.userId),
  index("connected_account_platform_idx").on(t.platform, t.userId),
  uniqueIndex("connected_account_user_platform_account_idx").on(t.userId, t.platform, t.accountId),
]))

export const posts = pgTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  media: jsonb("media").$type<{ url: string; key: string; type: "image" | "video"; mimeType?: string; thumbnailUrl?: string }[]>().default(sql`'[]'::jsonb`), // later add carousels and stories
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  status: postStatus("status").notNull().default("draft"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
}, (t) => (
  [
    index("posts_userId_idx").on(t.userId),
    index("posts_scheduled_for_idx").on(t.scheduledFor),
    index("posts_status_idx").on(t.status),]
))

export const post_targets = pgTable("post_targets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  connectedAccountId: text("connected_account_id").notNull().references(() => connectedAccount.id, { onDelete: "cascade" }),
  status: targetStatus("status").notNull().default("pending"),
  publishedUrl: text("published_url"),
  errorMessage: text("error_message"),
  postedAt: timestamp("posted_at"),
  analytics: jsonb("analytics").$type<{
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  }>().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
},
  (t) => ([
    index("post_targets_post_id_idx").on(t.postId),
    index("post_targets_connected_account_id_idx").on(t.connectedAccountId),
    uniqueIndex("post_targets_post_account_unique").on(t.postId, t.connectedAccountId),
  ])
)


// ── Relations ────────────────────────────────────────────────────────

export const ideaRelations = relations(idea, ({ one, many }) => ({
  user: one(user, { fields: [idea.userId], references: [user.id] }),
  drafts: many(draft),
}))

export const draftRelations = relations(draft, ({ one }) => ({
  idea: one(idea, { fields: [draft.ideaId], references: [idea.id] }),
  user: one(user, { fields: [draft.userId], references: [user.id] }),
}))

export const inspirationRelations = relations(inspiration, ({ one }) => ({
  user: one(user, { fields: [inspiration.userId], references: [user.id] }),
}))

export const connectedAccountRelations = relations(connectedAccount, ({ one }) => ({
  user: one(user, { fields: [connectedAccount.userId], references: [user.id] }),
}))

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(user, { fields: [posts.userId], references: [user.id] }),
  targets: many(post_targets),
}))

export const postTargetRelations = relations(post_targets, ({ one }) => ({
  post: one(posts, { fields: [post_targets.postId], references: [posts.id] }),
  connectedAccount: one(connectedAccount, { fields: [post_targets.connectedAccountId], references: [connectedAccount.id] }),
}))

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  ideas: many(idea),
  drafts: many(draft),
  inspirations: many(inspiration),
  connectedAccounts: many(connectedAccount),
  subscriptions: many(subscription),
  posts: many(posts)
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

