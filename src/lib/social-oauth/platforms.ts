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
  threads:{
    platformId: "threads",
    authorizationUrl: "https://www.threads.net/oauth/authorize",
    tokenUrl: "https://api.threads.net/oauth/access_token",
    userInfoUrl: "https://api.threads.net/me?fields=id,username",
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
        username: data.username || "Instagram User",
        avatarUrl: null,
        platformSpecificData: {},
      };
    },
  },
  facebook:{},
  bluesky: {
    platformId: "bsky",
    authorizationUrl: "https://bsky.social/oauth/authorize",
    tokenUrl: "https://bsky.social/oauth/access_token",
    userInfoUrl: "https://bsky.social/xrpc/com.atproto.identity.lookup",
    scopes: ["identity", "threadgate", "tweetgate", "feedgen"],
    clientId: env.BLUESKY_CLIENT_ID,
    clientSecret: env.BLUESKY_CLIENT_SECRET,
    parseProfile: (data: any) => {
      return {
        accountId: data.handle,
        username: data.handle,
        avatarUrl: data.avatar || null,
        platformSpecificData: {},
      };
    },
  },
  youtube: {
    platformId: "youtube",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v3/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scopes: [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
    clientId: env.YT_CLIENT_ID,
    clientSecret: env.YT_CLIENT_SECRET,
    parseProfile: (data: any) => {
      return {
        accountId: data.id,
        username: data.name || "YouTube User",
        avatarUrl: data.picture || null,
        platformSpecificData: {},
      };
    },
  },

};
