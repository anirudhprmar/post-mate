import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { connectedAccount } from "~/server/db/schema";
import { getSession } from "~/server/better-auth/server";
import { buildOAuthHeader } from "~/lib/x-oauth";

export async function GET(request: NextRequest) {
    // Verify the user is logged in
    const session = await getSession();
    if (!session?.user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const { searchParams } = new URL(request.url);
    const oauth_token = searchParams.get("oauth_token");
    const oauth_verifier = searchParams.get("oauth_verifier");

    // Verify the request token matches what we stored
    const storedToken = request.cookies.get("x_oauth_token")?.value;
    if (!storedToken || storedToken !== oauth_token) {
        return NextResponse.redirect(
            new URL("/dashboard/connect?error=token_mismatch", request.url),
        );
    }

    // ── X OAuth 1.0a Step 3: Exchange for access token ────────────────────
    const tokenResponse = await fetch(
        `https://api.x.com/oauth/access_token?oauth_verifier=${oauth_verifier}&oauth_token=${oauth_token}`,
        { method: "POST" },
    );

    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("[X OAuth] access_token failed:", tokenResponse.status, errorText);
        return NextResponse.redirect(
            new URL("/dashboard/connect?error=x_token_exchange_failed", request.url),
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
            new URL("/dashboard/connect?error=x_missing_tokens", request.url),
        );
    }

    // ── Fetch user profile (avatar) using raw fetch + OAuth 1.0a ──────────
    let avatarUrl: string | undefined;
    try {
        const profileUrl = "https://api.x.com/2/users/me";
        const profileUrlWithFields = `${profileUrl}?user.fields=profile_image_url`;

        // Signature is built against the base URL + query params
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
            // Remove "_normal" suffix for full-size avatar
            avatarUrl = profileData.data.profile_image_url?.replace("_normal", "");
        }
    } catch (e) {
        console.error("[X OAuth] Failed to fetch profile:", e);
    }

    // ── Upsert into connectedAccount ──────────────────────────────────────
    await db
        .insert(connectedAccount)
        .values({
            userId: session.user.id,
            platform: "x",
            accountId: xUserId,
            username: screenName ?? `user_${xUserId}`,
            avatarUrl: avatarUrl ?? null,
            accessToken,
            refreshToken: null, // OAuth 1.0a tokens are long-lived
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

    // ── Clear cookies and redirect ────────────────────────────────────────
    const redirectResponse = NextResponse.redirect(
        new URL("/dashboard/connect?connected=twitter", request.url),
    );
    redirectResponse.cookies.delete("x_oauth_token");
    redirectResponse.cookies.delete("x_oauth_token_secret");

    return redirectResponse;
}