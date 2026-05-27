import crypto from "crypto";

/**
 * RFC 3986 percent-encoding (required by OAuth 1.0a spec).
 */
export function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

/**
 * Build an OAuth 1.0a HMAC-SHA1 signature.
 *
 * @see https://developer.x.com/en/docs/authentication/oauth-1-0a/creating-a-signature
 */
export function buildSignature(
  method: string,
  baseUrl: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret = "",
): string {
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join("&");

  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(baseUrl),
    percentEncode(paramString),
  ].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  return crypto
    .createHmac("sha1", signingKey)
    .update(signatureBaseString)
    .digest("base64");
}

/**
 * Build a complete OAuth 1.0a Authorization header for an authenticated API request.
 * Generates nonce + timestamp automatically.
 */
export function buildOAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessSecret: string,
  extraParams?: Record<string, string>,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
    ...extraParams,
  };

  oauthParams.oauth_signature = buildSignature(
    method,
    url,
    oauthParams,
    consumerSecret,
    accessSecret,
  );

  return (
    "OAuth " +
    Object.entries(oauthParams)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
      .join(", ")
  );
}
