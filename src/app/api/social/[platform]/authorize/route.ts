import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import crypto from "crypto";
import { getSession } from "~/server/better-auth/server";
import { percentEncode, buildSignature } from "~/lib/social-oauth/x-oauth";
import { PLATFORM_OAUTH_CONFIGS } from "~/lib/social-oauth/platforms";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> },
) {
  const { platform } = await context.params;

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

    oauthParams.oauth_signature = buildSignature(
      "POST",
      requestTokenUrl,
      oauthParams,
      env.X_CONSUMER_SECRET,
    );

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
      console.error(
        "[X OAuth] request_token failed:",
        response.status,
        errorText,
      );
      return NextResponse.redirect(
        new URL("/dashboard/connect?error=x_request_failed", request.url),
      );
    }

    const body = await response.text();
    const parsed = Object.fromEntries(new URLSearchParams(body));

    if (parsed.oauth_callback_confirmed !== "true" || !parsed.oauth_token) {
      console.error("[X OAuth] Unexpected response:", parsed);
      return NextResponse.redirect(
        new URL(
          "/dashboard/connect?error=x_callback_not_confirmed",
          request.url,
        ),
      );
    }

    const redirectResponse = NextResponse.redirect(
      `https://api.x.com/oauth/authorize?oauth_token=${parsed.oauth_token}`,
    );

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

  const redirectUrl = new URL(config.authorizationUrl);

  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("client_id", config.clientId);
  redirectUrl.searchParams.set(
    "redirect_uri",
    `${env.NEXT_PUBLIC_APP_URL}/api/social/${platform}/callback`,
  );
  redirectUrl.searchParams.set("scope", config.scopes.join(","));
  if (platform === "instagram") {
    redirectUrl.searchParams.set("enable_fb_login", "0");
    redirectUrl.searchParams.set("force_authentication", "1");
  }

  let codeVerifier: string | undefined;

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
