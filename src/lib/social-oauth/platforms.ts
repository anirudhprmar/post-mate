import { env } from "~/env";

export interface PlatformOAuthConfig {
  platformId: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
  parseProfile: (data: any) => {
    accountId: string;
    username: string;
    avatarUrl?: string | null;
    platformSpecificData?: Record<string, any>;
  };
}

export const PLATFORM_OAUTH_CONFIGS: Record<string, PlatformOAuthConfig> = {
  linkedin: {
    platformId: "linkedin",
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    userInfoUrl: "https://api.linkedin.com/v2/userinfo",
    scopes: ["openid", "profile", "w_member_social", "email"],
    clientId: env.LINKEDIN_CLIENT_ID,
    clientSecret: env.LINKEDIN_CLIENT_SECRET,
    parseProfile: (data: any) => {
      const rawId = data.sub || "";
      // Strip "urn:li:person:" if present to get raw person ID
      const accountId = rawId.replace("urn:li:person:", "");
      return {
        accountId,
        username: data.name || data.given_name || "LinkedIn User",
        avatarUrl: data.picture || null,
        platformSpecificData: {},
      };
    },
  },
  instagram: {
    platformId: "instagram",
    authorizationUrl: "https://www.instagram.com/oauth/authorize",
    tokenUrl: "https://api.instagram.com/oauth/access_token",
    userInfoUrl: "https://graph.instagram.com/me?fields=id,username",
    scopes: [
      "instagram_business_basic",
      "instagram_business_content_publish",
      "instagram_business_manage_comments",
      "instagram_business_manage_messages",
    ],
    clientId: env.INSTA_CLIENT_ID,
    clientSecret: env.INSTA_CLIENT_SECRET,
    parseProfile: (data: any) => {
      return {
        accountId: data.id,
        username: data.username || "Instagram User",
        avatarUrl: null,
        platformSpecificData: {},
      };
    },
  },
  threads: {
    platformId: "threads",
    authorizationUrl: "https://www.threads.net/oauth/authorize",
    tokenUrl: "https://graph.threads.net/oauth/access_token",
    userInfoUrl: "https://graph.threads.net/v1.0/me?fields=id,username",
    scopes: [
      "threads_basic",
      "threads_content_publish",
      "threads_manage_replies",
      "threads_manage_insights",
    ],
    clientId: env.THREADS_CLIENT_ID,
    clientSecret: env.THREADS_CLIENT_SECRET,
    parseProfile: (data: any) => {
      return {
        accountId: data.id,
        username: data.username || "Threads User",
        avatarUrl: null,
        platformSpecificData: {},
      };
    },
  },
  facebook: {
    platformId: "facebook",
    authorizationUrl: "https://www.facebook.com/v21.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
    userInfoUrl:
      "https://graph.facebook.com/me?fields=id,name,picture.type(large)",
    scopes: [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
      // Required for pages linked to Meta Business Suite; /me/accounts is empty without it
      "business_management",
    ],
    clientId: env.FB_CLIENT_ID,
    clientSecret: env.FB_CLIENT_SECRET,
    parseProfile: (data: any) => {
      return {
        accountId: data.id,
        username: data.name || "Facebook User",
        avatarUrl: data.picture?.data?.url || null,
        platformSpecificData: {},
      };
    },
  },
  youtube: {
    platformId: "youtube",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl:
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    scopes: [
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.upload",
    ],
    clientId: env.YT_CLIENT_ID,
    clientSecret: env.YT_CLIENT_SECRET,
    parseProfile: (data: any) => {
      const channel = data?.items?.[0];
      return {
        accountId: channel?.id ?? "",
        username: channel?.snippet?.title || "YouTube Channel",
        avatarUrl:
          channel?.snippet?.thumbnails?.default?.url ||
          channel?.snippet?.thumbnails?.medium?.url ||
          null,
        platformSpecificData: {},
      };
    },
  },
};
