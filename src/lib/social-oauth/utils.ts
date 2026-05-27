import crypto from "crypto";
import { env } from "~/env";

/**
 * Generates a signed, URL-safe state parameter containing the userId and an expiry timestamp.
 */
export function generateState(userId: string): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  const payload = JSON.stringify({ userId, nonce, expiry });
  
  const secret = env.BETTER_AUTH_SECRET || "fallback-secret-for-development";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
    
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url");
}

/**
 * Verifies the state parameter, checks signature and expiry, and returns the userId if valid.
 */
export function verifyState(state: string): string | null {
  try {
    const raw = Buffer.from(state, "base64url").toString("utf-8");
    const { payload, signature } = JSON.parse(raw) as { payload: string; signature: string };
    
    const secret = env.BETTER_AUTH_SECRET || "fallback-secret-for-development";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
      
    if (signature !== expectedSignature) {
      console.error("[OAuth Utils] State signature verification failed");
      return null;
    }
    
    const { userId, expiry } = JSON.parse(payload) as { userId: string; expiry: number };
    if (Date.now() > expiry) {
      console.error("[OAuth Utils] State parameter has expired");
      return null;
    }
    
    return userId;
  } catch (err) {
    console.error("[OAuth Utils] Failed to parse state:", err);
    return null;
  }
}

/**
 * Generates PKCE code_verifier and code_challenge (S256).
 */
export function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
    
  return { codeVerifier, codeChallenge };
}
