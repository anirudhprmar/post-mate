import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import crypto from "crypto";
import { getSession } from "~/server/better-auth/server";
import { percentEncode, buildSignature } from "~/lib/social-oauth/x-oauth";
import { PLATFORM_OAUTH_CONFIGS } from "~/lib/social-oauth/platforms";
import { generateState, generatePKCE } from "~/lib/social-oauth/utils";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ platform: string }> },
) {
    const { platform } = await context.params;

    // Verify the user is logged in
    const session = await getSession();
    if (!session?.user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // ── X (Twitter) OAuth 1.0a Flow ───────────────────────────────────────
    if (platform === "x") {
        const requestTokenUrl = "https://api.x.com/oauth/request_token";
        const callbackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/social/x/callback`;

        const oauthParams: Record<string, string> = {
            oauth_callback: callbackUrl,
            oauth_consumer_key: env.X_CONSUMER_KEY,
            oauth_nonce: crypto.randomBytes(16).toString("hex"),
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
            oauth_version: "1.0",
        };

        // Sign the request
        oauthParams.oauth_signature = buildSignature(
            "POST",
            requestTokenUrl,
            oauthParams,
            env.X_CONSUMER_SECRET,
        );

        // Build Authorization header
        const authHeader =
            "OAuth " +
            Object.entries(oauthParams)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
                .join(", ");

        const response = await fetch(requestTokenUrl, {
            method: "POST",
            headers: { Authorization: authHeader },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[X OAuth] request_token failed:", response.status, errorText);
            return NextResponse.redirect(
                new URL("/dashboard/connect?error=x_request_failed", request.url),
            );
        }

        const body = await response.text();
        const parsed = Object.fromEntries(new URLSearchParams(body));

        if (parsed.oauth_callback_confirmed !== "true" || !parsed.oauth_token) {
            console.error("[X OAuth] Unexpected response:", parsed);
            return NextResponse.redirect(
                new URL("/dashboard/connect?error=x_callback_not_confirmed", request.url),
            );
        }

        // Redirect user to X's authorize page
        const redirectResponse = NextResponse.redirect(
            `https://api.x.com/oauth/authorize?oauth_token=${parsed.oauth_token}`,
        );

        // Store request token in cookies for verification in callback
        redirectResponse.cookies.set("x_oauth_token", parsed.oauth_token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10,
            path: "/",
        });

        redirectResponse.cookies.set(
            "x_oauth_token_secret",
            parsed.oauth_token_secret ?? "",
            {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 10,
                path: "/",
            },
        );

        return redirectResponse;
    }

    const config = PLATFORM_OAUTH_CONFIGS[platform];
    if (!config) {
        return NextResponse.json(
            { error: `Platform "${platform}" is not supported yet` },
            { status: 400 },
        );
    }

    const state = generateState(session.user.id);
    const redirectUrl = new URL(config.authorizationUrl);

    redirectUrl.searchParams.set("response_type", "code");
    redirectUrl.searchParams.set("client_id", config.clientId);
    redirectUrl.searchParams.set("redirect_uri", `${env.NEXT_PUBLIC_APP_URL}/api/social/${platform}/callback`);
    redirectUrl.searchParams.set("scope", config.scopes.join(" "));
    redirectUrl.searchParams.set("state", state);

    let codeVerifier: string | undefined;
    if (config.usePKCE) {
        const pkce = generatePKCE();
        codeVerifier = pkce.codeVerifier;
        redirectUrl.searchParams.set("code_challenge", pkce.codeChallenge);
        redirectUrl.searchParams.set("code_challenge_method", "S256");
    }

    const response = NextResponse.redirect(redirectUrl.toString());

    if (codeVerifier) {
        response.cookies.set(`${platform}_code_verifier`, codeVerifier, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10,
            path: "/",
        });
    }

    return response;
}