import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { connectedAccount } from "~/server/db/schema";
import { getSession } from "~/server/better-auth/server";
import { buildOAuthHeader } from "~/lib/social-oauth/x-oauth";
import { PLATFORM_OAUTH_CONFIGS } from "~/lib/social-oauth/platforms";
import { verifyState } from "~/lib/social-oauth/utils";

const VALID_PLATFORMS = [
  "instagram",
  "x",
  "facebook",
  "linkedin",
  "youtube",
  "threads",
] as const;
type PlatformType = (typeof VALID_PLATFORMS)[number];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> },
) {
  const { platform } = await context.params;

  // Verify the user is logged in
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
  }

  const { searchParams } = new URL(request.url);
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorParam) {
    console.error(
      `[OAuth Callback] Platform ${platform} returned error:`,
      errorParam,
      errorDescription,
    );
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=${errorParam}`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  // ── X (Twitter) OAuth 1.0a Callback ──────────────────────────────────
  if (platform === "x") {
    const oauth_token = searchParams.get("oauth_token");
    const oauth_verifier = searchParams.get("oauth_verifier");

    // Verify the request token matches what we stored
    const storedToken = request.cookies.get("x_oauth_token")?.value;
    if (!storedToken || storedToken !== oauth_token) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/connect?error=token_mismatch",
          env.NEXT_PUBLIC_APP_URL,
        ),
      );
    }

    // X OAuth 1.0a Step 3: Exchange for access token
    const tokenResponse = await fetch(
      `https://api.x.com/oauth/access_token?oauth_verifier=${oauth_verifier}&oauth_token=${oauth_token}`,
      { method: "POST" },
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(
        "[X OAuth] access_token failed:",
        tokenResponse.status,
        errorText,
      );
      return NextResponse.redirect(
        new URL(
          "/dashboard/connect?error=x_token_exchange_failed",
          env.NEXT_PUBLIC_APP_URL,
        ),
      );
    }

    const body = await tokenResponse.text();
    const parsed = new URLSearchParams(body);

    const accessToken = parsed.get("oauth_token");
    const accessSecret = parsed.get("oauth_token_secret");
    const xUserId = parsed.get("user_id");
    const screenName = parsed.get("screen_name");

    if (!accessToken || !accessSecret || !xUserId) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/connect?error=x_missing_tokens",
          env.NEXT_PUBLIC_APP_URL,
        ),
      );
    }

    // Fetch user profile (avatar) using raw fetch + OAuth 1.0a
    let avatarUrl: string | undefined;
    try {
      const profileUrl = "https://api.x.com/2/users/me";
      const profileUrlWithFields = `${profileUrl}?user.fields=profile_image_url`;

      const authHeader = buildOAuthHeader(
        "GET",
        profileUrl,
        env.X_CONSUMER_KEY,
        env.X_CONSUMER_SECRET,
        accessToken,
        accessSecret,
        { "user.fields": "profile_image_url" },
      );

      const profileRes = await fetch(profileUrlWithFields, {
        headers: { Authorization: authHeader },
      });

      if (profileRes.ok) {
        const profileData = (await profileRes.json()) as {
          data: { profile_image_url?: string };
        };
        avatarUrl = profileData.data.profile_image_url?.replace("_normal", "");
      }
    } catch (e) {
      console.error("[X OAuth] Failed to fetch profile:", e);
    }

    // Upsert into connectedAccount
    await db
      .insert(connectedAccount)
      .values({
        userId: session.user.id,
        platform: "x",
        accountId: xUserId,
        username: screenName ?? `user_${xUserId}`,
        avatarUrl: avatarUrl ?? null,
        accessToken,
        refreshToken: null,
        expiresAt: null,
        platformSpecificData: { oauthTokenSecret: accessSecret },
        status: "active",
        lastRefreshed: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          connectedAccount.userId,
          connectedAccount.platform,
          connectedAccount.accountId,
        ],
        set: {
          username: screenName ?? `user_${xUserId}`,
          avatarUrl: avatarUrl ?? null,
          accessToken,
          platformSpecificData: { oauthTokenSecret: accessSecret },
          status: "active",
          lastRefreshed: new Date(),
          updatedAt: new Date(),
        },
      });

    // Clear cookies and redirect
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard/connect?connected=x", env.NEXT_PUBLIC_APP_URL),
    );
    redirectResponse.cookies.delete("x_oauth_token");
    redirectResponse.cookies.delete("x_oauth_token_secret");

    return redirectResponse;
  }

  // ── Generic OAuth 2.0 Callback (LinkedIn, Instagram, etc.) ────────────
  if (!VALID_PLATFORMS.includes(platform as any)) {
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=invalid_platform`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  const config = PLATFORM_OAUTH_CONFIGS[platform];
  if (!config) {
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=platform_not_configured`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=missing_code_or_state`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  // Verify state to prevent CSRF and ensure correct user
  const stateUserId = verifyState(state);
  if (!stateUserId || stateUserId !== session.user.id) {
    console.error("[OAuth Callback] State verification failed", {
      stateUserId,
      sessionUserId: session.user.id,
    });
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=state_verification_failed`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  // Retrieve PKCE code verifier if config specifies it
  let codeVerifier: string | undefined;
  if (config.usePKCE) {
    codeVerifier = request.cookies.get(`${platform}_code_verifier`)?.value;
    if (!codeVerifier) {
      console.error(`[OAuth Callback] Missing code verifier for ${platform}`);
      return NextResponse.redirect(
        new URL(
          `/dashboard/connect?error=missing_code_verifier`,
          env.NEXT_PUBLIC_APP_URL,
        ),
      );
    }
  }

  // Exchange authorization code for tokens
  const tokenRequestBody: Record<string, string> = {
    grant_type: "authorization_code",
    code,
    redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/social/${platform}/callback`,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  if (codeVerifier) {
    tokenRequestBody.code_verifier = codeVerifier;
  }

  const tokenResponse = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(tokenRequestBody).toString(),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error(
      `[OAuth Callback] ${platform} token exchange failed:`,
      tokenResponse.status,
      errorText,
    );
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=token_exchange_failed`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
  };

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token || null;
  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000)
    : null;

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=missing_access_token`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  // Fetch user profile info
  let profileData: any;
  try {
    const profileResponse = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error(
        `Profile fetch failed: ${profileResponse.status} - ${await profileResponse.text()}`,
      );
    }

    profileData = await profileResponse.json();
  } catch (e) {
    console.error(
      `[OAuth Callback] Failed to fetch profile for ${platform}:`,
      e,
    );
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=profile_fetch_failed`,
        env.NEXT_PUBLIC_APP_URL,
      ),
    );
  }

  const parsedProfile = config.parseProfile(profileData);

  // Upsert into connectedAccount database table
  await db
    .insert(connectedAccount)
    .values({
      userId: session.user.id,
      platform: platform as PlatformType,
      accountId: parsedProfile.accountId,
      username: parsedProfile.username,
      avatarUrl: parsedProfile.avatarUrl ?? null,
      accessToken,
      refreshToken,
      expiresAt,
      platformSpecificData: parsedProfile.platformSpecificData ?? {},
      status: "active",
      lastRefreshed: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        connectedAccount.userId,
        connectedAccount.platform,
        connectedAccount.accountId,
      ],
      set: {
        username: parsedProfile.username,
        avatarUrl: parsedProfile.avatarUrl ?? null,
        accessToken,
        refreshToken: refreshToken ?? connectedAccount.refreshToken,
        expiresAt: expiresAt ?? connectedAccount.expiresAt,
        platformSpecificData: parsedProfile.platformSpecificData ?? {},
        status: "active",
        lastRefreshed: new Date(),
        updatedAt: new Date(),
      },
    });

  // Clean up cookies and redirect
  const redirectResponse = NextResponse.redirect(
    new URL(
      `/dashboard/connect?connected=${platform}`,
      env.NEXT_PUBLIC_APP_URL,
    ),
  );

  if (config.usePKCE) {
    redirectResponse.cookies.delete(`${platform}_code_verifier`);
  }

  return redirectResponse;
}
