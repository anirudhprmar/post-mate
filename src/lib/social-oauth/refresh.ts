import { env } from "~/env";
import { db } from "~/server/db";
import { connectedAccount } from "~/server/db/schema";
import { eq } from "drizzle-orm";

interface RefreshResult {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
}

async function refreshLinkedInToken(
  refreshToken: string,
): Promise<RefreshResult> {
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: env.LINKEDIN_CLIENT_ID,
        client_secret: env.LINKEDIN_CLIENT_SECRET,
      }).toString(),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LinkedIn token refresh failed: ${response.status} - ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

async function refreshInstagramToken(
  accessToken: string,
): Promise<RefreshResult> {
  const response = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Instagram token refresh failed: ${response.status} - ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

export async function refreshAccountToken(accountId: string): Promise<boolean> {
  const account = await db.query.connectedAccount.findFirst({
    where: eq(connectedAccount.id, accountId),
  });

  if (!account) {
    console.error(`[Token Refresh] Connected account ${accountId} not found`);
    return false;
  }

  try {
    let result: RefreshResult;

    if (account.platform === "linkedin") {
      if (!account.refreshToken) {
        throw new Error("No refresh token available for LinkedIn account");
      }
      result = await refreshLinkedInToken(account.refreshToken);
    } else if (account.platform === "instagram") {
      result = await refreshInstagramToken(account.accessToken);
    } else if (account.platform === "x") {
      // X OAuth 1.0a tokens do not expire, nothing to refresh
      return true;
    } else {
      console.warn(
        `[Token Refresh] Refresh not implemented for platform: ${account.platform}`,
      );
      return false;
    }

    // Update the database
    await db
      .update(connectedAccount)
      .set({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken || account.refreshToken,
        expiresAt: result.expiresAt || account.expiresAt,
        status: "active",
        lastRefreshed: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(connectedAccount.id, accountId));

    console.info(
      `[Token Refresh] Successfully refreshed token for account ${accountId} (${account.platform})`,
    );
    return true;
  } catch (error) {
    console.error(
      `[Token Refresh] Failed to refresh token for account ${accountId} (${account.platform}):`,
      error,
    );

    // Set account status to expired/error on failure
    await db
      .update(connectedAccount)
      .set({
        status: "expired",
        updatedAt: new Date(),
      })
      .where(eq(connectedAccount.id, accountId));

    return false;
  }
}
