import { env } from "~/env";

export interface PlatformOAuthConfig {
  platformId: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
  usePKCE: boolean;
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
    usePKCE: false,
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
    // Instagram Graph / Basic Display API user info
    userInfoUrl: "https://graph.instagram.com/me?fields=id,username",
    scopes: [
      "instagram_business_basic",
      "instagram_business_content_publish",
      "instagram_business_manage_comments",
      "instagram_business_manage_messages",
    ],
    clientId: env.INSTA_CLIENT_ID,
    clientSecret: env.INSTA_CLIENT_SECRET,
    usePKCE: false,
    parseProfile: (data: any) => {
      return {
        accountId: data.id,
        username: data.username || "Instagram User",
        avatarUrl: null,
        platformSpecificData: {},
      };
    },
  },
};
